import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Importando o Layout Global
import { Layout } from './components/layout/Layout';

// Importando as Páginas (ajuste os caminhos conforme sua refatoração)
import Login from './pages/Login/Login';
import Balcao from './pages/Balcao/Balcao';
import Dashboard from './pages/Dashboard/Dashboard';
import History from './pages/History/History';
import Product from './pages/Product/Product';
import Category from './pages/Category/Category';
import Settings from './pages/Settings/Settings';
import Estoque from './pages/Estoque/Estoque';
import Equipe from './pages/Equipe/Equipe';
import Admin from './pages/Admin/Admin';


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rota Pública (Tela de Login ocupa a tela inteira, sem Sidebar) */}
          <Route path="/" element={<Login />} />

          {/* Rotas Privadas (Envolvidas pelo Layout Principal) */}
          <Route element={<Layout />}>
            <Route path="/balcao" element={<Balcao />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/historico" element={<History />} />
            <Route path="/product" element={<Product />} />
            <Route path="/category" element={<Category />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/estoque" element={<Estoque />} />
            <Route path="/equipe" element={<Equipe />} />
            <Route path="/admin" element={<Admin />} />

            {/* Adicione as demais rotas aqui (Category, EditProduct, etc) */}
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}