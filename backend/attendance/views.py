from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db.models import Count, Q
from django.utils import timezone
from datetime import datetime
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Student, Attendance, AttendanceSummary
from .serializers import (
    StudentSerializer, AttendanceSerializer, AttendanceCreateSerializer,
    BulkAttendanceCreateSerializer, AttendanceSummarySerializer
)

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.filter(is_active=True)
    serializer_class = StudentSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name', 'roll_number', 'email']
    ordering_fields = ['name', 'roll_number', 'class_name', 'created_at']
    ordering = ['class_name', 'roll_number']

    def get_queryset(self):
        queryset = Student.objects.filter(is_active=True)
        class_name = self.request.query_params.get('class_name')
        if class_name:
            queryset = queryset.filter(class_name=class_name)
        return queryset

    def perform_destroy(self, instance):
        # Soft delete instead of actual deletion
        instance.is_active = False
        instance.save()

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        total_students = Student.objects.filter(is_active=True).count()
        class_stats = Student.objects.filter(is_active=True).values(
            'class_name'
        ).annotate(
            count=Count('id')
        ).order_by('class_name')
        
        return Response({
            'total_students': total_students,
            'class_distribution': list(class_stats)
        })

    @action(detail=True, methods=['get'])
    def attendance_history(self, request, pk=None):
        student = self.get_object()
        attendance = Attendance.objects.filter(student=student).order_by('-date', 'period')
        
        page = self.paginate_queryset(attendance)
        if page is not None:
            serializer = AttendanceSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = AttendanceSerializer(attendance, many=True)
        return Response(serializer.data)

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['student__name', 'student__roll_number', 'remarks']
    ordering_fields = ['date', 'period', 'student__name', 'created_at']
    ordering = ['-date', 'period', 'student__roll_number']

    def get_queryset(self):
        queryset = Attendance.objects.all()
        
        # Manual filtering for student, date, period, status, class_name
        student_id = self.request.query_params.get('student')
        if student_id:
            queryset = queryset.filter(student_id=student_id)
            
        date = self.request.query_params.get('date')
        if date:
            queryset = queryset.filter(date=date)
            
        period = self.request.query_params.get('period')
        if period:
            queryset = queryset.filter(period=period)
            
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
            
        class_name = self.request.query_params.get('student__class_name')
        if class_name:
            queryset = queryset.filter(student__class_name=class_name)
            
        return queryset

    def get_serializer_class(self):
        if self.action == 'create':
            return AttendanceCreateSerializer
        return AttendanceSerializer

    @action(detail=False, methods=['post'])
    def mark_attendance(self, request):
        serializer = AttendanceCreateSerializer(data=request.data)
        if serializer.is_valid():
            # Check for duplicate attendance
            existing_attendance = Attendance.objects.filter(
                student=serializer.validated_data['student'],
                date=serializer.validated_data['date'],
                period=serializer.validated_data['period']
            ).exists()
            
            if existing_attendance:
                return Response(
                    {'error': 'Attendance already marked for this student, date, and period.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            attendance = serializer.save()
            # Update attendance summary
            self._update_attendance_summary(attendance.student)
            
            return_serializer = AttendanceSerializer(attendance)
            return Response(return_serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def bulk_attendance(self, request):
        serializer = BulkAttendanceCreateSerializer(data=request.data)
        if serializer.is_valid():
            date = serializer.validated_data['date']
            period = serializer.validated_data['period']
            created_by = serializer.validated_data.get('created_by', '')
            attendance_data = serializer.validated_data['attendance_data']
            
            created_attendances = []
            errors = []
            
            for item in attendance_data:
                try:
                    student = Student.objects.get(id=item['student_id'])
                    
                    # Check for duplicate
                    existing_attendance = Attendance.objects.filter(
                        student=student,
                        date=date,
                        period=period
                    ).exists()
                    
                    if existing_attendance:
                        errors.append({
                            'student_id': item['student_id'],
                            'error': 'Attendance already exists'
                        })
                        continue
                    
                    attendance = Attendance.objects.create(
                        student=student,
                        date=date,
                        period=period,
                        status=item['status'],
                        remarks=item.get('remarks', ''),
                        created_by=created_by
                    )
                    created_attendances.append(attendance)
                    
                    # Update attendance summary for each student
                    self._update_attendance_summary(student)
                    
                except Student.DoesNotExist:
                    errors.append({
                        'student_id': item['student_id'],
                        'error': 'Student not found'
                    })
                except Exception as e:
                    errors.append({
                        'student_id': item['student_id'],
                        'error': str(e)
                    })
            
            if errors and not created_attendances:
                return Response(
                    {'errors': errors},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            return_serializer = AttendanceSerializer(created_attendances, many=True)
            response_data = {
                'created': return_serializer.data,
                'errors': errors
            }
            
            return Response(response_data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def student_history(self, request):
        roll_number = request.query_params.get('roll_number')
        student_id = request.query_params.get('student_id')
        
        if not roll_number and not student_id:
            return Response(
                {'error': 'Either roll_number or student_id parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            if roll_number:
                student = Student.objects.get(roll_number=roll_number)
            else:
                student = Student.objects.get(id=student_id)
            
            attendance = Attendance.objects.filter(student=student).order_by('-date', 'period')
            
            page = self.paginate_queryset(attendance)
            if page is not None:
                serializer = AttendanceSerializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            
            serializer = AttendanceSerializer(attendance, many=True)
            return Response(serializer.data)
            
        except Student.DoesNotExist:
            return Response(
                {'error': 'Student not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['get'])
    def attendance_percentage(self, request):
        students = Student.objects.filter(is_active=True)
        class_filter = request.query_params.get('class_name')
        
        if class_filter:
            students = students.filter(class_name=class_filter)
        
        result = []
        for student in students:
            total_classes = Attendance.objects.filter(student=student).count()
            present_classes = Attendance.objects.filter(
                student=student, 
                status='present'
            ).count()
            
            percentage = (present_classes / total_classes * 100) if total_classes > 0 else 0
            
            result.append({
                'id': student.id,
                'name': student.name,
                'roll_number': student.roll_number,
                'class_name': student.class_name,
                'percentage': round(percentage, 2),
                'present': present_classes,
                'total': total_classes
            })
        
        # Sort by percentage descending
        result.sort(key=lambda x: x['percentage'], reverse=True)
        return Response(result)

    @action(detail=False, methods=['get'])
    def daily_summary(self, request):
        date_str = request.query_params.get('date')
        if not date_str:
            date = timezone.now().date()
        else:
            try:
                date = datetime.strptime(date_str, '%Y-%m-%d').date()
            except ValueError:
                return Response(
                    {'error': 'Invalid date format. Use YYYY-MM-DD.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        attendance_data = Attendance.objects.filter(date=date)
        
        total_records = attendance_data.count()
        present_count = attendance_data.filter(status='present').count()
        absent_count = attendance_data.filter(status='absent').count()
        late_count = attendance_data.filter(status='late').count()
        
        attendance_rate = (present_count / total_records * 100) if total_records > 0 else 0
        
        return Response({
            'date': date,
            'total_records': total_records,
            'present_count': present_count,
            'absent_count': absent_count,
            'late_count': late_count,
            'attendance_rate': round(attendance_rate, 2)
        })

    @action(detail=False, methods=['get'])
    def class_statistics(self, request):
        classes = Student.objects.filter(is_active=True).values_list(
            'class_name', flat=True
        ).distinct()
        
        result = []
        for class_name in classes:
            students = Student.objects.filter(class_name=class_name, is_active=True)
            total_students = students.count()
            
            if total_students == 0:
                continue
            
            # Calculate average attendance percentage for the class
            class_percentages = []
            high_count = medium_count = low_count = 0
            
            for student in students:
                total_classes = Attendance.objects.filter(student=student).count()
                if total_classes == 0:
                    continue
                    
                present_classes = Attendance.objects.filter(
                    student=student, status='present'
                ).count()
                percentage = (present_classes / total_classes) * 100
                class_percentages.append(percentage)
                
                if percentage >= 90:
                    high_count += 1
                elif percentage >= 75:
                    medium_count += 1
                else:
                    low_count += 1
            
            avg_attendance = round(sum(class_percentages) / len(class_percentages), 2) if class_percentages else 0
            
            result.append({
                'class_name': class_name,
                'total_students': total_students,
                'average_attendance': avg_attendance,
                'high_attendance_count': high_count,
                'medium_attendance_count': medium_count,
                'low_attendance_count': low_count
            })
        
        return Response(result)

    def _update_attendance_summary(self, student):
        """Update attendance summary for a student"""
        try:
            summary, created = AttendanceSummary.objects.get_or_create(student=student)
            summary.update_summary()
        except Exception as e:
            print(f"Error updating attendance summary for student {student.id}: {e}")

class AttendanceSummaryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AttendanceSummary.objects.all()
    serializer_class = AttendanceSummarySerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['student__name', 'student__roll_number']
    ordering_fields = ['attendance_percentage', 'student__name', 'student__class_name']
    ordering = ['-attendance_percentage']

    def get_queryset(self):
        queryset = AttendanceSummary.objects.all()
        class_name = self.request.query_params.get('student__class_name')
        if class_name:
            queryset = queryset.filter(student__class_name=class_name)
        return queryset

    @action(detail=False, methods=['get'])
    def low_attendance(self, request):
        """Get students with attendance below threshold"""
        threshold_str = request.query_params.get('threshold', '75')
        try:
            threshold = float(threshold_str)
        except ValueError:
            threshold = 75.0
        
        low_attendance = self.queryset.filter(
            attendance_percentage__lt=threshold
        ).order_by('attendance_percentage')
        
        page = self.paginate_queryset(low_attendance)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(low_attendance, many=True)
        return Response(serializer.data)