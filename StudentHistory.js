import React, { useState } from "react";

const studentHistoryStyles = `
  .student-history-container {
    max-width: 1200px;
    margin: 0 auto;
    animation: fadeIn 0.5s ease-in;
  }

  .history-controls {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    padding: 1.5rem 2rem;
    border-radius: 20px 20px 0 0;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
    margin-bottom: 0;
  }

  .search-box {
    position: relative;
    max-width: 400px;
    margin-bottom: 1rem;
  }

  .search-box i {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #667eea;
  }

  .search-box input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 3rem;
    border: 2px solid #e1e5e9;
    border-radius: 10px;
    font-size: 1rem;
    background: rgba(255, 255, 255, 0.8);
  }

  .table-container {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 0 0 20px 20px;
    padding: 2rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-top: none;
    overflow-x: auto;
  }

  .student-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 600px;
  }

  .student-table th {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 1rem;
    text-align: left;
    font-weight: 600;
  }

  .student-table td {
    padding: 1rem;
    border-bottom: 1px solid #e1e5e9;
  }

  .student-table tr:hover {
    background: rgba(102, 126, 234, 0.05);
  }

  .student-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    margin-right: 0.75rem;
  }

  .name-cell {
    display: flex;
    align-items: center;
  }

  .attendance-cell {
    font-weight: 600;
    font-size: 1rem;
  }

  .high-attendance {
    color: #4CAF50;
  }

  .medium-attendance {
    color: #FF9800;
  }

  .low-attendance {
    color: #F44336;
  }

  .actions-cell {
    display: flex;
    gap: 0.5rem;
  }

  .action-btn {
    width: 35px;
    height: 35px;
    border: none;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .view-btn {
    background: rgba(76, 175, 80, 0.1);
    color: #4CAF50;
  }

  .view-btn:hover {
    background: #4CAF50;
    color: white;
  }

  .edit-btn {
    background: rgba(33, 150, 243, 0.1);
    color: #2196F3;
  }

  .edit-btn:hover {
    background: #2196F3;
    color: white;
  }

  .no-results {
    text-align: center;
    padding: 3rem;
    color: #666;
  }

  @media (max-width: 768px) {
    .student-history-container {
      padding: 1rem;
    }
    
    .table-container {
      padding: 1rem;
    }
  }
`;

const StudentHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const students = [
    { id: 1, name: "Alice Johnson", roll: "101", class: "10A", attendance: "92%", lastUpdated: "2023-10-15" },
    { id: 2, name: "Bob Smith", roll: "102", class: "10A", attendance: "85%", lastUpdated: "2023-10-15" },
    { id: 3, name: "Carol Williams", roll: "103", class: "10B", attendance: "96%", lastUpdated: "2023-10-14" },
    { id: 4, name: "David Brown", roll: "104", class: "10B", attendance: "78%", lastUpdated: "2023-10-14" },
  ];

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.roll.includes(searchTerm) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAttendanceClass = (attendance) => {
    const percentage = parseInt(attendance);
    if (percentage >= 90) return "high-attendance";
    if (percentage >= 75) return "medium-attendance";
    return "low-attendance";
  };

  return (
    <>
      <style>{studentHistoryStyles}</style>
      <div className="student-history-container">
        <div className="form-header">
          <h2><i className="fas fa-history"></i> Student Attendance History</h2>
          <p>View and manage student attendance records</p>
        </div>
        
        <div className="history-controls">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search by name, roll number, or class..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="table-container">
          <table className="student-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Class</th>
                <th>Attendance</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td className="roll-cell">{student.roll}</td>
                  <td className="name-cell">
                    <div className="student-avatar">
                      {student.name.charAt(0)}
                    </div>
                    {student.name}
                  </td>
                  <td className="class-cell">{student.class}</td>
                  <td className={`attendance-cell ${getAttendanceClass(student.attendance)}`}>
                    {student.attendance}
                  </td>
                  <td className="date-cell">{student.lastUpdated}</td>
                  <td className="actions-cell">
                    <button className="action-btn view-btn">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="action-btn edit-btn">
                      <i className="fas fa-edit"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredStudents.length === 0 && (
            <div className="no-results">
              <i className="fas fa-search"></i>
              <p>No students found matching your search</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StudentHistory;