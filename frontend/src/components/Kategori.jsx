import React, { useState, useEffect, useRef } from "react";
import { Modal } from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Cookies from "js-cookie";

const Kategori = () => {
  const modalRef = useRef(null);
  const modalInstance = useRef(null);
  const editModalRef = useRef(null);
  const editModalInstance = useRef(null);

  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const token = Cookies.get("token");

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:7080/kategori", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Gagal memuat kategori");

        const data = await response.json();
        setCategories(data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (token) fetchCategories();
  }, [token]);

  // Show modal for adding category
  const showModal = () => {
    if (!modalInstance.current) {
      modalInstance.current = new Modal(modalRef.current);
    }
    modalInstance.current.show();
  };

  // Add category
  const addCategory = async () => {
    try {
      const response = await fetch("http://localhost:7080/addkategori", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nama: categoryName, keterangan: categoryDescription }),
      });

      if (!response.ok) throw new Error("Gagal menambah kategori");

      const result = await response.json();
      alert("Kategori berhasil ditambahkan!");
      setCategories([...categories, { id_kategori: result.id, nama: categoryName, keterangan: categoryDescription }]);
      setCategoryName("");
      setCategoryDescription("");
      if (modalInstance.current && typeof modalInstance.current.hide === "function") {
        modalInstance.current.hide();
      }
      
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Terjadi kesalahan saat menambahkan kategori.");
    }
  };

  // Delete category
  const deleteCategory = async (id_kategori) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus kategori ini?")) return;

    try {
      const response = await fetch("http://localhost:7080/deletekategori", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_kategori }),
      });

      if (!response.ok) throw new Error("Gagal menghapus kategori");

      alert("Kategori berhasil dihapus!");
      setCategories(categories.filter((category) => category.id_kategori !== id_kategori));
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Terjadi kesalahan saat menghapus kategori.");
    }
  };

  // Edit category
  const editCategory = (id_kategori, nama, keterangan) => {
    setEditCategoryId(id_kategori);
    setCategoryName(nama);
    setCategoryDescription(keterangan);
    if (!editModalInstance.current) {
      editModalInstance.current = new Modal(editModalRef.current);
    }
    editModalInstance.current.show();
  };

  // Update category
  const updateCategory = async () => {
    try {
      const response = await fetch("http://localhost:7080/editkategori", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_kategori: editCategoryId, nama: categoryName, keterangan: categoryDescription }),
      });

      if (!response.ok) throw new Error("Gagal mengedit kategori");

      alert("Kategori berhasil diperbarui!");
      setCategories(
        categories.map((category) =>
          category.id_kategori === editCategoryId
            ? { ...category, nama: categoryName, keterangan: categoryDescription }
            : category
        )
      );
      setCategoryName("");
      setCategoryDescription("");
      setEditCategoryId(null);
      if (editModalInstance.current) editModalInstance.current.hide();
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Terjadi kesalahan saat memperbarui kategori.");
    }
  };

  // Filter categories
  const filteredCategories = categories.filter((category) =>
    Object.values(category).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="container mt-4">
      <h3>Kategori</h3>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Cari kategori..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <table className="table table-bordered">
        <thead>
          <tr>
            
            <th>Nama Kategori</th>
            <th>Keterangan</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <tr key={category.id_kategori}>
                
                <td>{category.nama}</td>
                <td>{category.keterangan || "-"}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => editCategory(category.id_kategori, category.nama, category.keterangan)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteCategory(category.id_kategori)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                Tidak ada kategori.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <button className="btn btn-primary mt-3" onClick={showModal}>
        Tambah Kategori
      </button>

      {/* Modal Tambah */}
      <div className="modal fade" ref={modalRef} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Tambah Kategori Baru</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Nama Kategori"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
              <textarea
                className="form-control"
                placeholder="Keterangan"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Tutup
              </button>
              <button className="btn btn-success" onClick={addCategory}>
                Simpan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Edit */}
      <div className="modal fade" ref={editModalRef} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Kategori</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Nama Kategori"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
              <textarea
                className="form-control"
                placeholder="Keterangan"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Tutup
              </button>
              <button className="btn btn-success" onClick={updateCategory}>
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kategori;
