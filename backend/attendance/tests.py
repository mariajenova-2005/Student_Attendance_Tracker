from django.test import TestCase
from django.utils import timezone
from .models import Student, Attendance
from datetime import date

class StudentModelTest(TestCase):
    def setUp(self):
        self.student = Student.objects.create(
            name="John Doe",
            roll_number="101",
            class_name="10A",
            email="john@example.com",
            phone="1234567890"
        )

    def test_student_creation(self):
        self.assertEqual(self.student.name, "John Doe")
        self.assertEqual(self.student.roll_number, "101")
        self.assertEqual(self.student.class_name, "10A")
        self.assertTrue(self.student.is_active)

    def test_student_str_representation(self):
        self.assertEqual(str(self.student), "John Doe (101) - 10A")

class AttendanceModelTest(TestCase):
    def setUp(self):
        self.student = Student.objects.create(
            name="Jane Smith",
            roll_number="102",
            class_name="10B"
        )
        self.attendance = Attendance.objects.create(
            student=self.student,
            date=date.today(),
            period="1",
            status="present",
            created_by="teacher"
        )

    def test_attendance_creation(self):
        self.assertEqual(self.attendance.student, self.student)
        self.assertEqual(self.attendance.date, date.today())
        self.assertEqual(self.attendance.period, "1")
        self.assertEqual(self.attendance.status, "present")

    def test_attendance_str_representation(self):
        expected_str = f"Jane Smith - {date.today()} - Period 1 - Present"
        self.assertEqual(str(self.attendance), expected_str)