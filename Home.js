import React, { useState } from "react";
import Navbar from "./Navbar";
import AddStudent from "./AddStudent";
import AddAttendance from "./AddAttendance";
import StudentHistory from "./StudentHistory";
import AttendancePercentage from "./AttendancePercentage";

const homeStyles = `
  .home-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .main-content {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .dashboard {
    animation: fadeIn 0.5s ease-in;
  }

  .dashboard-header {
    text-align: center;
    margin-bottom: 3rem;
    color: white;
  }

  .dashboard-header h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }

  .dashboard-header p {
    font-size: 1.1rem;
    opacity: 0.9;
  }

  .stats-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
  }

  .stat-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  }

  .stat-icon {
    width: 60px;
    height: 60px;
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-size: 1.5rem;
  }

  .stat-info h3 {
    font-size: 2rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 0.25rem;
  }

  .stat-info p {
    color: #666;
    font-size: 0.9rem;
  }

  .quick-actions {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  .quick-actions h2 {
    color: #333;
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .action-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }

  .action-card {
    background: white;
    border-radius: 15px;
    padding: 2rem 1.5rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid transparent;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  }

  .action-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
    border-color: #667eea;
  }

  .action-card i {
    font-size: 2.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 1rem;
  }

  .action-card h3 {
    color: #333;
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  .action-card p {
    color: #666;
    font-size: 0.85rem;
    line-height: 1.4;
  }

  @media (max-width: 768px) {
    .main-content {
      padding: 1rem;
    }
    
    .dashboard-header h1 {
      font-size: 2rem;
    }
    
    .stats-container {
      grid-template-columns: 1fr;
    }
    
    .action-cards {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 480px) {
    .action-cards {
      grid-template-columns: 1fr;
    }
  }
`;

const Home = () => {
  const [activeTab, setActiveTab] = useState("home");

  const renderContent = () => {
    switch(activeTab) {
      case "addStudent": 
        return <AddStudent />;
      case "addAttendance": 
        return <AddAttendance />;
      case "history": 
        return <StudentHistory />;
      case "performance": 
        return <AttendancePercentage />;
      default: 
        return (
          <div className="dashboard">
            <div className="dashboard-header">
              <h1>Dashboard Overview</h1>
              <p>Manage student attendance efficiently</p>
            </div>
            
            <div className="stats-container">
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-users"></i>
                </div>
                <div className="stat-info">
                  <h3>245</h3>
                  <p>Total Students</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-calendar-check"></i>
                </div>
                <div className="stat-info">
                  <h3>92%</h3>
                  <p>Overall Attendance</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-chart-line"></i>
                </div>
                <div className="stat-info">
                  <h3>15</h3>
                  <p>Low Attendance</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="stat-info">
                  <h3>Today</h3>
                  <p>Attendance Status</p>
                </div>
              </div>
            </div>
            
            <div className="quick-actions">
              <h2>Quick Actions</h2>
              <div className="action-cards">
                <div 
                  className="action-card" 
                  onClick={() => setActiveTab("addStudent")}
                >
                  <i className="fas fa-user-plus"></i>
                  <h3>Add Student</h3>
                  <p>Register new students</p>
                </div>
                
                <div 
                  className="action-card" 
                  onClick={() => setActiveTab("addAttendance")}
                >
                  <i className="fas fa-calendar-plus"></i>
                  <h3>Mark Attendance</h3>
                  <p>Record today's attendance</p>
                </div>
                
                <div 
                  className="action-card" 
                  onClick={() => setActiveTab("history")}
                >
                  <i className="fas fa-history"></i>
                  <h3>View History</h3>
                  <p>Check attendance records</p>
                </div>
                
                <div 
                  className="action-card" 
                  onClick={() => setActiveTab("performance")}
                >
                  <i className="fas fa-chart-pie"></i>
                  <h3>Performance</h3>
                  <p>View attendance analytics</p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <style>{homeStyles}</style>
      <div className="home-container">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="main-content">
          {renderContent()}
        </main>
      </div>
    </>
  );
};

export default Home;