import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import LaporanPage from './pages/LaporanPage';
import ProfilePage from './pages/ProfilePage';
import './styles/index.css';

// 👉 import admin dashboard
import AdminApp from './admin/AdminApp';

// DEMO: anggap selalu logged-in (ubah nanti pakai /me)
const isLoggedIn = () => true;

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        {/* halaman login */}
        <Route path="/login" element={<LoginPage/>}/>

        {/* halaman user (warga) */}
        <Route path="/chat" element={<RequireAuth><ChatPage/></RequireAuth>} />
        <Route path="/laporan" element={<RequireAuth><LaporanPage/></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><ProfilePage/></RequireAuth>} />
        <Route path="/" element={<RequireAuth><HomePage/></RequireAuth>} />

        {/* ✨ halaman kelurahan/admin */}
        <Route path="/admin/*" element={<AdminApp/>} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/"/>} />
      </Routes>
    </BrowserRouter>
  );
}

function RequireAuth({children}){
  return isLoggedIn()? children : <Navigate to="/login"/>;
}
