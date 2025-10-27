import React, { useState } from "react";

const addStudentStyles = `
  .add-student-container {
    max-width: 800px;
    margin: 0 auto;
    animation: fadeIn 0.5s ease-in;
  }

  .form-header {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px 20px 0 0;
    padding: 2rem;
    text-align: center;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-bottom: none;
  }

  .form-header h2 {
    color: #333;
    font-size: 1.75rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .form-header h2 i {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .form-header p {
    color: #666;
    font-size: 1rem;
  }

  .student-form {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 0 0 20px 20px;
    padding: 2rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-top: none;
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

  .input-group.full-width {
    grid-column: 1 / -1;
  }

  .input-group label {
    color: #333;
    font-weight: 500;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }

  .input-group input {
    padding: 1rem;
    border: 2px solid #e1e5e9;
    border-radius: 10px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.8);
  }

  .input-group input:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    background: white;
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
    .add-student-container {
      padding: 1rem;
    }
    
    .form-row {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    .form-header,
    .student-form {
      padding: 1.5rem;
    }
  }
`;

const AddStudent = () => {
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    email: "",
    phone: "",
    class: ""
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
    if (!formData.name || !formData.rollNo) {
      alert("Name and Roll Number are required");
      return;
    }
    
    alert(`Student Added: ${formData.name}, Roll No: ${formData.rollNo}`);
    setFormData({
      name: "",
      rollNo: "",
      email: "",
      phone: "",
      class: ""
    });
  };

  return (
    <>
      <style>{addStudentStyles}</style>
      <div className="add-student-container">
        <div className="form-header">
          <h2><i className="fas fa-user-plus"></i> Add New Student</h2>
          <p>Register a new student in the system</p>
        </div>
        
        <form onSubmit={handleSubmit} className="student-form">
          <div className="form-row">
            <div className="input-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter student's full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="rollNo">Roll Number *</label>
              <input
                type="text"
                id="rollNo"
                name="rollNo"
                placeholder="Enter roll number"
                value={formData.rollNo}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="input-group full-width">
            <label htmlFor="class">Class/Division</label>
            <input
              type="text"
              id="class"
              name="class"
              placeholder="Enter class/division"
              value={formData.class}
              onChange={handleChange}
            />
          </div>
          
          <button type="submit" className="submit-btn">
            <i className="fas fa-user-plus"></i> Add Student
          </button>
        </form>
      </div>
    </>
  );
};

export default AddStudent;