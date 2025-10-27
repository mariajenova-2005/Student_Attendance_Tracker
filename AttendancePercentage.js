import React, { useState } from "react";

const attendancePercentageStyles = `
  .attendance-percentage-container {
    max-width: 1000px;
    margin: 0 auto;
    animation: fadeIn 0.5s ease-in;
  }

  .performance-controls {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    padding: 1.5rem 2rem;
    border-radius: 20px 20px 0 0;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
    margin-bottom: 0;
  }

  .class-filter {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .class-filter select {
    padding: 0.5rem 1rem;
    border: 2px solid #e1e5e9;
    border-radius: 8px;
    background: white;
  }

  .summary-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .summary-card {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  }

  .summary-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.1rem;
  }

  .summary-icon.high {
    background: linear-gradient(135deg, #4CAF50, #45a049);
  }

  .summary-icon.medium {
    background: linear-gradient(135deg, #FF9800, #f57c00);
  }

  .summary-icon.low {
    background: linear-gradient(135deg, #F44336, #d32f2f);
  }

  .summary-info h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #333;
  }

  .summary-info p {
    font-size: 0.75rem;
    color: #666;
  }

  .attendance-list {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 0 0 20px 20px;
    padding: 2rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-top: none;
  }

  .attendance-card {
    background: white;
    border-radius: 15px;
    padding: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    margin-bottom: 1rem;
  }

  .student-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .student-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 1.2rem;
  }

  .attendance-details {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.5rem;
  }

  .percentage {
    font-size: 1.5rem;
    font-weight: 700;
  }

  .percentage.high {
    color: #4CAF50;
  }

  .percentage.medium {
    color: #FF9800;
  }

  .percentage.low {
    color: #F44336;
  }

  .progress-container {
    width: 150px;
    height: 8px;
    background: #e9ecef;
    border-radius: 10px;
    overflow: hidden;
  }

  .progress-bar {
    height: 100%;
    border-radius: 10px;
  }

  @media (max-width: 768px) {
    .attendance-percentage-container {
      padding: 1rem;
    }
    
    .summary-cards {
      grid-template-columns: 1fr;
    }
    
    .attendance-card {
      flex-direction: column;
      align-items: stretch;
      gap: 1rem;
    }
  }
`;

const AttendancePercentage = () => {
  const [selectedClass, setSelectedClass] = useState("all");
  
  const attendanceData = [
    { id: 1, name: "Alice Johnson", roll: "101", class: "10A", percentage: 92, present: 46, total: 50 },
    { id: 2, name: "Bob Smith", roll: "102", class: "10A", percentage: 85, present: 42, total: 50 },
    { id: 3, name: "Carol Williams", roll: "103", class: "10B", percentage: 96, present: 48, total: 50 },
    { id: 4, name: "David Brown", roll: "104", class: "10B", percentage: 78, present: 39, total: 50 },
  ];

  const filteredData = selectedClass === "all" 
    ? attendanceData 
    : attendanceData.filter(student => student.class === selectedClass);

  const getPercentageClass = (percentage) => {
    if (percentage >= 90) return "high";
    if (percentage >= 75) return "medium";
    return "low";
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return "#4CAF50";
    if (percentage >= 75) return "#FF9800";
    return "#F44336";
  };

  return (
    <>
      <style>{attendancePercentageStyles}</style>
      <div className="attendance-percentage-container">
        <div className="form-header">
          <h2><i className="fas fa-chart-line"></i> Attendance Performance</h2>
          <p>Analyze student attendance percentages and trends</p>
        </div>
        
        <div className="performance-controls">
          <div className="class-filter">
            <label>Filter by Class:</label>
            <select 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="all">All Classes</option>
              <option value="10A">Class 10A</option>
              <option value="10B">Class 10B</option>
            </select>
          </div>
          
          <div className="summary-cards">
            <div className="summary-card">
              <div className="summary-icon high">
                <i className="fas fa-user-check"></i>
              </div>
              <div className="summary-info">
                <h3>2</h3>
                <p>Excellent (&gt;90%)</p>
              </div>
            </div>
            
            <div className="summary-card">
              <div className="summary-icon medium">
                <i className="fas fa-user"></i>
              </div>
              <div className="summary-info">
                <h3>1</h3>
                <p>Good (75-90%)</p>
              </div>
            </div>
            
            <div className="summary-card">
              <div className="summary-icon low">
                <i className="fas fa-user-times"></i>
              </div>
              <div className="summary-info">
                <h3>1</h3>
                <p>Needs Improvement (&lt;75%)</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="attendance-list">
          {filteredData.map((student) => (
            <div key={student.id} className="attendance-card">
              <div className="student-info">
                <div className="student-avatar">
                  {student.name.charAt(0)}
                </div>
                <div className="student-details">
                  <h4>{student.name}</h4>
                  <p>Roll No: {student.roll} | Class: {student.class}</p>
                </div>
              </div>
              
              <div className="attendance-details">
                <div className="percentage-info">
                  <span className={`percentage ${getPercentageClass(student.percentage)}`}>
                    {student.percentage}%
                  </span>
                  <div className="attendance-stats">
                    {student.present}/{student.total} days
                  </div>
                </div>
                
                <div className="progress-container">
                  <div 
                    className="progress-bar"
                    style={{
                      width: `${student.percentage}%`,
                      backgroundColor: getProgressColor(student.percentage)
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AttendancePercentage;