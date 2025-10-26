from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class Student(models.Model):
    CLASS_CHOICES = [
        ('10A', '10A'),
        ('10B', '10B'),
        ('10C', '10C'),
        ('11A', '11A'),
        ('11B', '11B'),
        ('11C', '11C'),
        ('12A', '12A'),
        ('12B', '12B'),
        ('12C', '12C'),
    ]
    
    name = models.CharField(max_length=100)
    roll_number = models.CharField(max_length=20, unique=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    class_name = models.CharField(max_length=10, choices=CLASS_CHOICES, default='10A')
    date_of_birth = models.DateField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['class_name', 'roll_number']
        indexes = [
            models.Index(fields=['roll_number']),
            models.Index(fields=['class_name']),
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return f"{self.name} ({self.roll_number}) - {self.class_name}"

    @property
    def attendance_percentage(self):
        total_attendance = self.attendance_records.count()
        if total_attendance == 0:
            return 0
        present_count = self.attendance_records.filter(status='present').count()
        return round((present_count / total_attendance) * 100, 2)

class Attendance(models.Model):
    STATUS_CHOICES = [
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('late', 'Late'),
        ('excused', 'Excused'),
    ]
    
    PERIOD_CHOICES = [
        ('1', 'Period 1'),
        ('2', 'Period 2'),
        ('3', 'Period 3'),
        ('4', 'Period 4'),
        ('5', 'Period 5'),
        ('6', 'Period 6'),
        ('7', 'Period 7'),
        ('8', 'Period 8'),
    ]
    
    student = models.ForeignKey(
        Student, 
        on_delete=models.CASCADE, 
        related_name='attendance_records'
    )
    date = models.DateField()
    period = models.CharField(max_length=10, choices=PERIOD_CHOICES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='present')
    remarks = models.TextField(blank=True, null=True)
    created_by = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date', 'period', 'student__roll_number']
        unique_together = ['student', 'date', 'period']
        indexes = [
            models.Index(fields=['date']),
            models.Index(fields=['student', 'date']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return f"{self.student.name} - {self.date} - {self.get_period_display()} - {self.get_status_display()}"

class AttendanceSummary(models.Model):
    student = models.OneToOneField(
        Student,
        on_delete=models.CASCADE,
        related_name='attendance_summary'
    )
    total_classes = models.PositiveIntegerField(default=0)
    classes_attended = models.PositiveIntegerField(default=0)
    classes_absent = models.PositiveIntegerField(default=0)
    classes_late = models.PositiveIntegerField(default=0)
    classes_excused = models.PositiveIntegerField(default=0)
    attendance_percentage = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        default=0.00,
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Attendance Summaries"
        indexes = [
            models.Index(fields=['attendance_percentage']),
        ]

    def __str__(self):
        return f"{self.student.name} - {self.attendance_percentage}%"

    def update_summary(self):
        from django.db.models import Count, Q
        
        attendance_data = self.student.attendance_records.aggregate(
            total=Count('id'),
            present=Count('id', filter=Q(status='present')),
            absent=Count('id', filter=Q(status='absent')),
            late=Count('id', filter=Q(status='late')),
            excused=Count('id', filter=Q(status='excused'))
        )
        
        self.total_classes = attendance_data['total'] or 0
        self.classes_attended = attendance_data['present'] or 0
        self.classes_absent = attendance_data['absent'] or 0
        self.classes_late = attendance_data['late'] or 0
        self.classes_excused = attendance_data['excused'] or 0
        
        if self.total_classes > 0:
            self.attendance_percentage = round(
                (self.classes_attended / self.total_classes) * 100, 2
            )
        else:
            self.attendance_percentage = 0.00
        
        self.save()