// components/ProtectedRoute.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');  // Mengambil token dari cookies
    if (!token) {
      navigate('/login');  // Redirect ke login jika tidak ada token
    }
  }, [navigate]);

  return children;  // Tampilkan komponen anak jika token ada
};

export default ProtectedRoute;
