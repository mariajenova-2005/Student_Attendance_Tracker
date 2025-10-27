import React, { useState } from "react";
import Login from "./components/Login";
import Home from "./components/Home";

const appStyles = `
  .App {
    min-height: 100vh;
  }

  button {
    font-family: 'Poppins', sans-serif;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
    outline: none;
  }

  input, select, textarea {
    font-family: 'Poppins', sans-serif;
    outline: none;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .fade-in {
    animation: fadeIn 0.5s ease-in;
  }
`;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <>
      <style>{appStyles}</style>
      <div className="App">
        {!isLoggedIn ? <Login onLogin={handleLogin} /> : <Home />}
      </div>
    </>
  );
}

export default App;