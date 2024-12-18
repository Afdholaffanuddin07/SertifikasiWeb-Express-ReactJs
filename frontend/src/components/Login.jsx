import React, { useState } from "react";
import Cookies from "js-cookie";  // Import js-cookie

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Menyiapkan body untuk request
    const body = {
      nama: username,
      password: password,
    };

    try {
      // Mengirimkan permintaan login ke backend
      const response = await fetch("http://localhost:7080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      // Mengambil response dari backend
      const data = await response.json();
   
      // Mengecek jika login berhasil
      if (response.ok) {
        // Jika berhasil, simpan token di cookies
        Cookies.set("token", data.data.token, { expires: 1 });  // Token disimpan selama 1 hari
        Cookies.set("id_user", data.data.id_user);
        console.log(data.data.id_user);
        
        onLogin(true);  // Mengubah status login di frontend
      } else {
        // Menampilkan error jika login gagal
        alert(data.message || "Login gagal!");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Terjadi kesalahan saat login. Silakan coba lagi.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-5 shadow-lg" style={{ width: "35rem" }}>
        <h3 className="text-center">Login</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control"
              placeholder="Username"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              placeholder="Password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 py-3">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
