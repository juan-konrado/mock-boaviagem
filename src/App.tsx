import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

import SignIn from './pages/Signln';
import Home from './pages/Home';
import Balcao from './pages/Balcao'; // ou './pages/balcao' se você renomeou o arquivo
import Category from './pages/Category';
import Product from './pages/Product';
import EditProduct from './pages/EditProduct';
import Dashboard from './pages/Dashboard';
import History from './pages/History';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/home" element={<Home />} />
          <Route path="/balcao" element={<Balcao />} />
          <Route path="/category" element={<Category />} />
          <Route path="/product" element={<Product />} />
          <Route path="/edit-product" element={<EditProduct />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/historico" element={<History />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}