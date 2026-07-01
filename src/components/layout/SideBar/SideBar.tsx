import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    FiMonitor, FiPieChart, FiList, FiLogOut, FiMenu, FiChevronLeft, FiSun, FiMoon, FiTag, FiGrid, FiPackage, FiSettings, FiUsers
} from "react-icons/fi";
import "./Sidebar.css";

export function Sidebar() {
    const navigate = useNavigate();

    // Estado de Colapso da Sidebar
    const [isCollapsed, setIsCollapsed] = useState(false);

    // 🟢 ESTADO DO TEMA (Importado do seu código)
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('@BoaViagem:theme');
        if (savedTheme) {
            return savedTheme === 'dark';
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    // 🟢 EFEITO DO TEMA: Injeta a classe no HTML e salva no navegador
    useEffect(() => {
        const html = document.documentElement;
        if (isDarkMode) {
            html.classList.add('dark');
            localStorage.setItem('@BoaViagem:theme', 'dark');
        } else {
            html.classList.remove('dark');
            localStorage.setItem('@BoaViagem:theme', 'light');
        }
    }, [isDarkMode]);

    // Dados mockados
    const userName = "João Silva";
    const userRole = "Gerente";

    const menuItems = [
        { icon: <FiMonitor />, text: "Frente de Caixa", path: "/balcao" },
        { icon: <FiPieChart />, text: "Estatísticas", path: "/dashboard" },
        { icon: <FiList />, text: "Histórico Comanda", path: "/historico" },
        { icon: <FiTag />, text: "Produtos", path: "/product" },
        { icon: <FiGrid />, text: "Categorias", path: "/category" },
        { icon: <FiPackage />, text: "Estoque", path: "/estoque" },
        { icon: <FiSettings />, text: "Configuração", path: "/settings" },
        { icon: <FiUsers />, text: "Equipe", path: "/equipe" },
        { icon: <FiUsers />, text: "Admin", path: "/admin" },


    ];

    const handleLogout = () => {
        if (window.confirm("Deseja realmente encerrar a sessão?")) {
            navigate("/");
        }
    };

    return (
        <aside className={`sidebar-container ${isCollapsed ? "collapsed" : ""}`}>

            {/* TOPO: BOTÃO DE EXPANDIR/REDUZIR */}
            <div className="sidebar-toggle-area">
                <button
                    className="toggle-btn"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    title={isCollapsed ? "Expandir" : "Recolher"}
                >
                    {isCollapsed ? <FiMenu size={20} /> : <FiChevronLeft size={20} />}
                </button>
            </div>

            {/* IDENTIFICAÇÃO DA EMPRESA E USUÁRIO */}
            <div className="sidebar-profile-section">
                <div className="profile-logo-wrapper">
                    <div className="brand-initial">B</div>
                </div>

                {!isCollapsed && (
                    <div className="profile-text-fade">
                        <h2 className="sidebar-system-title">BoaViagem Pub</h2>
                        <p className="sidebar-user-name">{userName}</p>
                        <p className="sidebar-user-role">{userRole}</p>
                    </div>
                )}
            </div>

            {/* LINKS DE NAVEGAÇÃO */}
            <nav className="sidebar-navigation-menu">
                {menuItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        className={({ isActive }) => `sidebar-link-item ${isActive ? "link-active" : ""}`}
                        title={item.text}
                    >
                        <span className="link-icon">{item.icon}</span>
                        {!isCollapsed && <span className="link-text">{item.text}</span>}
                    </NavLink>
                ))}
            </nav>

            {/* RODAPÉ: MODO ESCURO E SAIR */}
            <div className="sidebar-footer-area">
                {/* 🟢 BOTÃO DE MODO ESCURO/CLARO */}
                <button
                    className="sidebar-theme-btn"
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    title={isDarkMode ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
                >
                    <span className="link-icon">
                        {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
                    </span>
                    {!isCollapsed && (
                        <span className="link-text">
                            {isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
                        </span>
                    )}
                </button>

                <div className="footer-divider"></div>

                {/* BOTÃO DE LOGOUT */}
                <button className="sidebar-logout-btn" onClick={handleLogout} title="Sair do Sistema">
                    <span className="link-icon"><FiLogOut size={20} /></span>
                    {!isCollapsed && <span className="link-text">Sair</span>}
                </button>
            </div>
        </aside>
    );
}