import React, { useState } from "react";

const addAttendanceStyles = `
  .add-attendance-container {
    max-width: 800px;
    margin: 0 auto;
    animation: fadeIn 0.5s ease-in;
  }

  .attendance-form {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .input-group {
    display: flex;
    flex-direction: column;
  }

  .input-group label {
    color: #333;
    font-weight: 500;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }

  .input-group input,
  .input-group select {
    padding: 1rem;
    border: 2px solid #e1e5e9;
    border-radius: 10px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.8);
  }

  .input-group input:focus,
  .input-group select:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    background: white;
  }

  .status-options {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .status-option {
    flex: 1;
    text-align: center;
    padding: 0.75rem;
    border: 2px solid #e1e5e9;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .status-option input {
    display: none;
  }

  .status-present,
  .status-absent,
  .status-late {
    font-weight: 500;
  }

  .status-option.active {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.1);
  }

  .status-option.active .status-present {
    color: #4CAF50;
  }

  .status-option.active .status-absent {
    color: #F44336;
  }

  .status-option.active .status-late {
    color: #FF9800;
  }

  .submit-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    margin-top: 1rem;
    width: 100%;
  }

  .submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
  }

  @media (max-width: 768px) {
    .add-attendance-container {
      padding: 1rem;
    }
    
    .form-row {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    .status-options {
      flex-direction: column;
    }
  }
`;

const AddAttendance = () => {
  const [formData, setFormData] = useState({
    rollNo: "",
    date: new Date().toISOString().split('T')[0],
    period: "",
    status: "present"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.rollNo || !formData.date || !formData.period) {
      alert("Roll Number, Date and Period are required");
      return;
    }
    
    alert(`Attendance recorded: Roll ${formData.rollNo}, Date ${formData.date}, Period ${formData.period}, Status: ${formData.status}`);
    setFormData(prevState => ({
      ...prevState,
      rollNo: "",
      period: ""
    }));
  };

  return (
    <>
      <style>{addAttendanceStyles}</style>
      <div className="add-attendance-container">
        <div className="form-header">
          <h2><i className="fas fa-calendar-check"></i> Mark Attendance</h2>
          <p>Record student attendance for a specific period</p>
        </div>
        
        <form onSubmit={handleSubmit} className="attendance-form">
          <div className="form-row">
            <div className="input-group">
              <label htmlFor="rollNo">Roll Number *</label>
              <input
                type="text"
                id="rollNo"
                name="rollNo"
                placeholder="Enter student roll number"
                value={formData.rollNo}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="date">Date *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="input-group">
              <label htmlFor="period">Period *</label>
              <select
                id="period"
                name="period"
                value={formData.period}
                onChange={handleChange}
                required
              >
                <option value="">Select Period</option>
                <option value="1">Period 1</option>
                <option value="2">Period 2</option>
                <option value="3">Period 3</option>
                <option value="4">Period 4</option>
                <option value="5">Period 5</option>
                <option value="6">Period 6</option>
                <option value="7">Period 7</option>
                <option value="8">Period 8</option>
              </select>
            </div>
            
            <div className="input-group">
              <label>Attendance Status</label>
              <div className="status-options">
                <label className={`status-option ${formData.status === "present" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="status"
                    value="present"
                    checked={formData.status === "present"}
                    onChange={handleChange}
                  />
                  <span className="status-present">Present</span>
                </label>
                
                <label className={`status-option ${formData.status === "absent" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="status"
                    value="absent"
                    checked={formData.status === "absent"}
                    onChange={handleChange}
                  />
                  <span className="status-absent">Absent</span>
                </label>
                
                <label className={`status-option ${formData.status === "late" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="status"
                    value="late"
                    checked={formData.status === "late"}
                    onChange={handleChange}
                  />
                  <span className="status-late">Late</span>
                </label>
              </div>
            </div>
          </div>
          
          <button type="submit" className="submit-btn">
            <i className="fas fa-save"></i> Record Attendance
          </button>
        </form>
      </div>
    </>
  );
};

export default AddAttendance;