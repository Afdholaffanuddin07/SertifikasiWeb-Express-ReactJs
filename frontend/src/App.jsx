import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Arsip from "./components/Arsip";
import Kategori from "./components/Kategori";
import ProtectedRoute from "./components/ProtectedRoute";
import Cookies from "js-cookie";  // Import js-cookie

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Cek token di localStorage atau cookies setiap kali komponen dimuat
    const token = Cookies.get("token");

    if (token) {
      setIsLoggedIn(true);  // Jika ada token, set isLoggedIn true
    } else {
      setIsLoggedIn(false);  // Jika tidak ada token, set isLoggedIn false
    }
  }, []);  // Hanya dijalankan sekali saat komponen dimuat

  return (
    <Router>
      {!isLoggedIn ? (
        <Login onLogin={setIsLoggedIn} />
      ) : (
        <div className="d-flex">
          <Sidebar />
          <div className="container-fluid" style={{ marginLeft: "250px" }}>
            <Routes>
              {/* Gunakan ProtectedRoute untuk melindungi rute */}
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/archive" element={<ProtectedRoute><Arsip /></ProtectedRoute>} />
              <Route path="/category" element={<ProtectedRoute><Kategori /></ProtectedRoute>} />
            </Routes>
          </div>
        </div>
      )}
    </Router>
  );
};

export default App;
