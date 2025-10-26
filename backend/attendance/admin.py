from django.contrib import admin
from .models import Student, Attendance, AttendanceSummary

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ['name', 'roll_number', 'class_name', 'email', 'phone', 'is_active', 'created_at']
    list_filter = ['class_name', 'is_active', 'created_at']
    search_fields = ['name', 'roll_number', 'email']
    list_editable = ['is_active']
    ordering = ['class_name', 'roll_number']

@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ['student', 'date', 'period', 'status', 'created_by', 'created_at']
    list_filter = ['date', 'period', 'status', 'student__class_name']
    search_fields = ['student__name', 'student__roll_number', 'remarks']
    date_hierarchy = 'date'
    ordering = ['-date', 'period']

@admin.register(AttendanceSummary)
class AttendanceSummaryAdmin(admin.ModelAdmin):
    list_display = ['student', 'total_classes', 'classes_attended', 'attendance_percentage', 'last_updated']
    list_filter = ['student__class_name', 'last_updated']
    search_fields = ['student__name', 'student__roll_number']
    readonly_fields = ['last_updated']
    ordering = ['-attendance_percentage']