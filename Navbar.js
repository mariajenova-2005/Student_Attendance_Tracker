import React, { useState } from "react";

const navbarStyles = `
  .navbar {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    position: sticky;
    top: 0;
    z-index: 1000;
  }

  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
  }

  .nav-logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.5rem;
    font-weight: 700;
    color: #667eea;
  }

  .nav-logo i {
    font-size: 1.75rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .nav-menu {
    display: flex;
    gap: 1.5rem;
    align-items: center;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
    color: #666;
    position: relative;
    overflow: hidden;
  }

  .nav-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    transition: left 0.3s ease;
    z-index: -1;
  }

  .nav-item:hover::before,
  .nav-item.active::before {
    left: 0;
  }

  .nav-item:hover,
  .nav-item.active {
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }

  .nav-item i {
    font-size: 1.1rem;
    transition: transform 0.3s ease;
  }

  .nav-item:hover i,
  .nav-item.active i {
    transform: scale(1.1);
  }

  .nav-toggle {
    display: none;
    flex-direction: column;
    cursor: pointer;
    padding: 0.5rem;
    background: none;
    border: none;
  }

  .nav-toggle i {
    font-size: 1.5rem;
    color: #667eea;
  }

  @media (max-width: 768px) {
    .nav-menu {
      position: fixed;
      top: 70px;
      right: -100%;
      flex-direction: column;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      width: 80%;
      max-width: 300px;
      text-align: center;
      transition: right 0.3s ease;
      box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
      border-radius: 0 0 0 20px;
      padding: 2rem 0;
      gap: 0;
    }

    .nav-menu.active {
      right: 0;
    }

    .nav-item {
      width: 100%;
      justify-content: center;
      border-radius: 0;
      padding: 1rem 2rem;
      margin: 0.25rem 0;
    }

    .nav-toggle {
      display: flex;
    }

    .nav-container {
      padding: 1rem;
    }
  }
`;

const Navbar = ({ activeTab, setActiveTab }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { id: "home", label: "Home", icon: "fa-home" },
    { id: "addStudent", label: "Add Student", icon: "fa-user-plus" },
    { id: "addAttendance", label: "Add Attendance", icon: "fa-calendar-check" },
    { id: "history", label: "History", icon: "fa-history" },
    { id: "performance", label: "Performance", icon: "fa-chart-line" }
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setIsMenuOpen(false);
  };

  return (
    <>
      <style>{navbarStyles}</style>
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <i className="fas fa-user-graduate"></i>
            <span>Attendance Tracker</span>
          </div>
          
          <div className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
            {menuItems.map((item) => (
              <div 
                key={item.id}
                className={`nav-item ${activeTab === item.id ? "active" : ""}`}
                onClick={() => handleNavClick(item.id)}
              >
                <i className={`fas ${item.icon}`}></i>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          
          <div 
            className="nav-toggle" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className={`fas ${isMenuOpen ? "fa-times" : "fa-bars"}`}></i>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;