import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Importando o Layout Global
import { Layout } from './components/layout/Layout';

// Importando as Páginas (ajuste os caminhos conforme sua refatoração)
import SignIn from './pages/Signln/Signln';
import Balcao from './pages/Balcao/Balcao';
import Dashboard from './pages/Dashboard/Dashboard';
import History from './pages/History/History';
import Product from './pages/Product/Product';
import Category from './pages/Category/Category';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rota Pública (Tela de Login ocupa a tela inteira, sem Sidebar) */}
          <Route path="/" element={<SignIn />} />

          {/* Rotas Privadas (Envolvidas pelo Layout Principal) */}
          <Route element={<Layout />}>
            <Route path="/balcao" element={<Balcao />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/historico" element={<History />} />
            <Route path="/product" element={<Product />} />
            <Route path="/category" element={<Category />} />
            {/* Adicione as demais rotas aqui (Category, EditProduct, etc) */}
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}