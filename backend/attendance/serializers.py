from rest_framework import serializers
from .models import Student, Attendance, AttendanceSummary

class StudentSerializer(serializers.ModelSerializer):
    attendance_percentage = serializers.ReadOnlyField()
    
    class Meta:
        model = Student
        fields = [
            'id', 'name', 'roll_number', 'email', 'phone', 
            'class_name', 'date_of_birth', 'address', 
            'is_active', 'created_at', 'updated_at', 'attendance_percentage'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class AttendanceSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    student_roll = serializers.CharField(source='student.roll_number', read_only=True)
    student_class = serializers.CharField(source='student.class_name', read_only=True)
    
    class Meta:
        model = Attendance
        fields = [
            'id', 'student', 'student_name', 'student_roll', 'student_class',
            'date', 'period', 'status', 'remarks', 'created_by',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class AttendanceCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = ['student', 'date', 'period', 'status', 'remarks', 'created_by']

class BulkAttendanceSerializer(serializers.Serializer):
    student_id = serializers.IntegerField()
    status = serializers.ChoiceField(choices=Attendance.STATUS_CHOICES)
    remarks = serializers.CharField(required=False, allow_blank=True)

class BulkAttendanceCreateSerializer(serializers.Serializer):
    date = serializers.DateField()
    period = serializers.ChoiceField(choices=Attendance.PERIOD_CHOICES)
    attendance_data = BulkAttendanceSerializer(many=True)
    created_by = serializers.CharField(required=False, allow_blank=True)

class AttendanceSummarySerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    student_roll = serializers.CharField(source='student.roll_number', read_only=True)
    student_class = serializers.CharField(source='student.class_name', read_only=True)
    
    class Meta:
        model = AttendanceSummary
        fields = [
            'id', 'student', 'student_name', 'student_roll', 'student_class',
            'total_classes', 'classes_attended', 'classes_absent',
            'classes_late', 'classes_excused', 'attendance_percentage',
            'last_updated'
        ]
        read_only_fields = ['id', 'last_updated']

class StudentAttendanceStatsSerializer(serializers.Serializer):
    student_id = serializers.IntegerField()
    student_name = serializers.CharField()
    roll_number = serializers.CharField()
    class_name = serializers.CharField()
    total_classes = serializers.IntegerField()
    classes_attended = serializers.IntegerField()
    classes_absent = serializers.IntegerField()
    classes_late = serializers.IntegerField()
    attendance_percentage = serializers.FloatField()

class ClassAttendanceStatsSerializer(serializers.Serializer):
    class_name = serializers.CharField()
    total_students = serializers.IntegerField()
    average_attendance = serializers.FloatField()
    high_attendance_count = serializers.IntegerField()
    medium_attendance_count = serializers.IntegerField()
    low_attendance_count = serializers.IntegerField()

class DailyAttendanceSerializer(serializers.Serializer):
    date = serializers.DateField()
    total_students = serializers.IntegerField()
    present_count = serializers.IntegerField()
    absent_count = serializers.IntegerField()
    late_count = serializers.IntegerField()
    attendance_rate = serializers.FloatField()