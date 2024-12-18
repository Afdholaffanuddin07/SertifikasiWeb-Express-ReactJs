import React, { useState, useEffect, useRef } from "react";
import { Modal } from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Cookies from "js-cookie";

const Arsip = () => {
  const modalRef = useRef(null);
  const modalInstance = useRef(null);
  const [archives, setArchives] = useState([]);
  const [formData, setFormData] = useState({
    nomorSurat: "",
    kategori: "",
    judul: "",
    waktu: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const token = Cookies.get('token'); // Ambil token dari cookies

  // Mengambil data arsip dan kategori
  useEffect(() => {
    const fetchArchives = async () => {
      try {
        const response = await fetch("http://localhost:7080/surat", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Gagal memuat data arsip");
        }

        const data = await response.json();
        setArchives(data.data); // Menyimpan data arsip
      } catch (error) {
        console.error("Error fetching archives:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:7080/kategori", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Gagal memuat kategori");
        }

        const data = await response.json();
        setCategories(data.data); // Menyimpan data kategori
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (token) {
      fetchArchives(); // Mengambil arsip
      fetchCategories(); // Mengambil kategori
    } else {
      console.error("Token tidak ditemukan, silakan login.");
    }
  }, [token]);

  // Fungsi untuk mengubah input form
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "file") {
      // Jika input yang diubah adalah file, kita ambil file yang dipilih
      setFormData({ ...formData, file: files[0] });
    } else {
      // Jika input lainnya, update formData seperti biasa
      setFormData({ ...formData, [name]: value });
    }
  };
  

  // Fungsi untuk menambahkan arsip
  const addArchive = async () => {
    const form = new FormData();
    form.append("nomor", formData.nomorSurat);
    form.append("kategori", formData.kategori);
    form.append("judul", formData.judul);
    form.append("file", formData.file);
  
    try {
      const response = await fetch("http://localhost:7080/addsurat", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: form,
      });
  
      if (!response.ok) {
        throw new Error("Gagal menambahkan surat");
      }
  
      const result = await response.json();
      alert("Surat berhasil ditambahkan!");
  
      // Reset form setelah berhasil
      setFormData({
        nomorSurat: "",
        kategori: "",
        judul: "",
        waktu: "",
      });
  
      // Tutup modal setelah berhasil
      if (modalInstance.current) {
        modalInstance.current.hide();
      }
  
      
  
    } catch (error) {
      console.error("Error adding archive:", error);
      alert("Terjadi kesalahan saat menambahkan surat.");
    }
  };
  
  

  const showModal = () => {
    if (!modalInstance.current) {
      modalInstance.current = new Modal(modalRef.current);
    }
    modalInstance.current.show();
  };

  const filteredArchives = archives.filter((archive) =>
    Object.values(archive).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const deleteArchive = async (id) => {
    // Menghapus arsip dari tampilan lokal
    setArchives(archives.filter((archive) => archive.id_surat !== id));
  
    try {
      // Kirim request DELETE ke backend
      const response = await fetch("http://localhost:7080/deletesurat", {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }), // Kirim ID surat yang akan dihapus
      });
  
      if (!response.ok) {
        throw new Error("Gagal menghapus arsip");
      }
  
      // Menangani respons jika berhasil
      const result = await response.json();
      console.log(result.message); // Menampilkan pesan dari backend
    } catch (error) {
      console.error("Error deleting archive:", error);
      alert("Terjadi kesalahan saat menghapus arsip.");
    }
  };
  

  const downloadArchive = async (id) => {
    try {
      const downloadUrl = `http://localhost:7080/download/${id}`;
      const response = await fetch(downloadUrl, {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error('Gagal mengunduh file');
      }

      const blob = await response.blob();
      const fileName = `surat_${id}.pdf`;
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
    } catch (error) {
      console.error("Error during download:", error);
    }
  };

  const viewArchive = async (id) => {
    try {
      const viewUrl = `http://localhost:7080/viewsurat/${id}`;
      const response = await fetch(viewUrl, {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/pdf",
        },
      });

      if (!response.ok) {
        throw new Error('Gagal memuat file PDF');
      }

      const pdfBlob = await response.blob();
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
    } catch (error) {
      console.error("Error during file view:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Daftar Arsip</h3>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Cari arsip..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <table className="table table-bordered">
        <thead>
          <tr>
            
            <th>Nomor Surat</th>
            <th>Kategori</th>
            <th>Judul</th>
            <th>Waktu</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredArchives.length > 0 ? (
            filteredArchives.map((archive) => (
              <tr key={archive.id_surat}>
                
                <td>{archive.nomor}</td>
                <td>{archive.kategori}</td>
                <td>{archive.judul}</td>
                <td>{archive.waktu}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteArchive(archive.id_surat)}
                  >
                    Hapus
                  </button>
                  <button
                    className="btn btn-primary btn-sm mx-2"
                    onClick={() => downloadArchive(archive.id_surat)}
                  >
                    Download
                  </button>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => viewArchive(archive.id_surat)}
                  >
                    Lihat
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                Tidak ada arsip.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <button className="btn btn-primary mt-3" onClick={showModal}>
        Tambah Arsip
      </button>

      <div
        className="modal fade"
        ref={modalRef}
        tabIndex="-1"
        aria-labelledby="addArchiveModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Tambah Arsip Baru</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                name="nomorSurat"
                className="form-control mb-2"
                placeholder="Nomor Surat"
                value={formData.nomorSurat}
                onChange={handleChange}
              />
              <select
                name="kategori"
                className="form-control mb-2"
                value={formData.kategori}
                onChange={handleChange}
              >
                <option value="">Pilih Kategori</option>
                {categories.map((kategori) => (
                  <option key={kategori.id_kategori} value={kategori.nama}>
                    {kategori.nama}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="judul"
                className="form-control mb-2"
                placeholder="Judul"
                value={formData.judul}
                onChange={handleChange}
              />
              <input
                type="file"
                name="file"
                className="form-control"
                onChange={handleChange}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Tutup
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={addArchive}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Arsip;
