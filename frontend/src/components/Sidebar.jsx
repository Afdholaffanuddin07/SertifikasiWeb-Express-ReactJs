import React from "react";
import { Link } from "react-router-dom";
import { FaUserAlt, FaArchive, FaTags } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div
      className="p-4"
      style={{
        width: "425px", // Lebar sidebar diperbesar
        height: "100vh",
        backgroundColor: "#d0e6f6", // Latar sidebar lebih cerah (biru muda)
        color: "#333", // Warna teks lebih gelap
        boxShadow: "2px 0 10px rgba(0, 0, 0, 0.1)",
        borderRight: "2px solid #ccc",
      }}
    >
      <div className="text-center mb-5">
        <h4 className="fs-4 fw-bold">Menu</h4>
      </div>
      <ul className="list-unstyled">
        {/* Menu Profil */}
        <li className="mb-4">
          <Link
            to="/profile"
            className="d-block py-2 px-3 fs-5 rounded-3"
            style={{
              backgroundColor: "#b0cce1", // Warna menu sedikit lebih gelap
              color: "#fff",
              border: "1px solid #a0b8cc",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#8aa6c1") // Warna hover lebih gelap
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#b0cce1")
            }
          >
            <FaUserAlt className="me-3" />
            Profil
          </Link>
        </li>

        {/* Menu Arsip CRUD */}
        <li className="mb-4">
          <Link
            to="/archive"
            className="d-block py-2 px-3 fs-5 rounded-3"
            style={{
              backgroundColor: "#b0cce1",
              color: "#fff",
              border: "1px solid #a0b8cc",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#8aa6c1")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#b0cce1")
            }
          >
            <FaArchive className="me-3" />
            Arsip
          </Link>
        </li>

        {/* Menu Kategori CRUD */}
        <li className="mb-4">
          <Link
            to="/category"
            className="d-block py-2 px-3 fs-5 rounded-3"
            style={{
              backgroundColor: "#b0cce1",
              color: "#fff",
              border: "1px solid #a0b8cc",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#8aa6c1")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#b0cce1")
            }
          >
            <FaTags className="me-3" />
            Kategori
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
