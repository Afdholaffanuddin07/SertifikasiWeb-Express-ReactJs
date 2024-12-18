import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import profileImage from '../assets/afdhol.jpg';

const Profile = () => {
  const [userData, setUserData] = useState(null); // State untuk menyimpan data pengguna
  const token = Cookies.get('token'); // Ambil token dari cookies
  const id = Cookies.get('id_user');

  // Fungsi untuk fetch data pengguna
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!token) {
          alert("Tidak ada token ditemukan. Anda harus login terlebih dahulu.");
          return;
        }

        // Ambil id_user dari token atau localStorage (sesuaikan sesuai kebutuhan)
        const id_user = id; // Contoh id_user, ganti dengan nilai dinamis jika ada

        const response = await fetch(`http://localhost:7080/getuserbyid/${id_user}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Kirim token JWT di header Authorization
          },
        });

        if (!response.ok) {
          throw new Error("Gagal mengambil data pengguna.");
        }

        const result = await response.json();
        setUserData(result.data); // Simpan data pengguna ke state
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Terjadi kesalahan saat mengambil data pengguna.");
      }
    };

    fetchUserData();
  }, [token]);

  const handleLogout = async () => {
    if (!token) {
      alert("Tidak ada token ditemukan. Anda harus login terlebih dahulu.");
      return;
    }

    try {
      const response = await fetch("http://localhost:7080/logout", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Kirim token JWT di header Authorization
        },
      });

      const data = await response.json();

      if (response.ok) {
        Cookies.remove('token');
        alert("You have logged out successfully.");
        window.location.href = "/login";
      } else {
        alert(data.message || "Logout gagal!");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Terjadi kesalahan saat logout.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card" style={{ width: '18rem' }}>
        <img src={profileImage} className="card-img-top" alt="Profile" />
        <div className="card-body">
          {userData ? (
            <>
              <h5 className="card-title">{userData.nama || "Nama Tidak Ditemukan"}</h5>
              
              <ul className="list-group list-group-flush">
                <li className="list-group-item">Nama: {userData.nama || "Tidak Ditemukan"}</li>
                <li className="list-group-item">Nim: {userData.nim || "Tidak Ditemukan"}</li>
                <li className="list-group-item">Jurusan: {userData.jurusan || "Tidak Ditemukan"}</li>
                <li className="list-group-item">Tanggal: {"24 Agustus 2023"}</li>
              </ul>
            </>
          ) : (
            <p>Memuat data pengguna...</p>
          )}
          <button onClick={handleLogout} className="btn btn-danger mt-3 w-100">Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
