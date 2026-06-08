import { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    FiLogOut,
    FiMoon,
    FiSun,
    FiMonitor,
    FiBarChart2,
    FiClock,
    FiBox,
    FiTag,
    FiEdit
} from 'react-icons/fi';
import { AuthContext } from '../contexts/AuthContext';

export function Header() {
    const { signOut, user } = useContext(AuthContext);
    const location = useLocation();

    // 🟢 ESTADO DO TEMA: Verifica o localStorage ou o sistema operacional do usuário
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('@BoaViagem:theme');
        if (savedTheme) {
            return savedTheme === 'dark';
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    // 🟢 EFEITO COLATERAL: Sempre que isDarkMode mudar, injeta no HTML e salva no navegador
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

    const isActive = (path: string) => location.pathname === path;

    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-20 flex justify-between items-center">

                {/* LOGO */}
                <Link to="/balcao" className="flex items-center gap-2 group outline-none focus:ring-2 focus:ring-orange-500 rounded-lg">
                    <div className="w-10 h-10 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                        <span className="text-white dark:text-slate-900 font-black text-xl tracking-tighter">BV</span>
                    </div>
                    <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight transition-colors">
                        Boa Viagem <span className="text-orange-500">Pub</span>
                    </span>
                </Link>

                {/* MENU DE NAVEGAÇÃO */}
                <nav className="hidden lg:flex items-center gap-2">
                    <Link
                        to="/balcao"
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${isActive('/balcao')
                                ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                            }`}
                    >
                        <FiMonitor className="w-5 h-5" /> Caixa/PDV
                    </Link>

                    <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2"></div>

                    <Link to="/dashboard" className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium transition-all ${isActive('/dashboard') ? 'text-blue-600 dark:text-blue-400 bg-slate-50 dark:bg-slate-800' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                        <FiBarChart2 className="w-4 h-4" /> Painel
                    </Link>

                    <Link to="/historico" className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium transition-all ${isActive('/historico') ? 'text-blue-600 dark:text-blue-400 bg-slate-50 dark:bg-slate-800' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                        <FiClock className="w-4 h-4" /> Histórico
                    </Link>

                    <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2"></div>

                    <Link to="/product" className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium transition-all ${isActive('/product') ? 'text-blue-600 dark:text-blue-400 bg-slate-50 dark:bg-slate-800' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                        <FiBox className="w-4 h-4" /> Produtos
                    </Link>

                    <Link to="/category" className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium transition-all ${isActive('/category') ? 'text-blue-600 dark:text-blue-400 bg-slate-50 dark:bg-slate-800' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                        <FiTag className="w-4 h-4" /> Categorias
                    </Link>

                    <Link to="/edit-product" className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium transition-all ${isActive('/edit-product') ? 'text-blue-600 dark:text-blue-400 bg-slate-50 dark:bg-slate-800' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                        <FiEdit className="w-4 h-4" /> Editar
                    </Link>
                </nav>

                {/* CONTROLES DA DIREITA */}
                <div className="flex items-center gap-4">

                    {/* 🟢 BOTÃO DE TEMA */}
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className="p-2.5 rounded-full text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all outline-none focus:ring-2 focus:ring-blue-500"
                        title={isDarkMode ? "Modo Claro" : "Modo Escuro"}
                    >
                        {isDarkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                    </button>

                    <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>

                    <button
                        onClick={signOut}
                        className="flex items-center gap-2 p-2.5 pr-4 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors font-bold text-sm outline-none focus:ring-2 focus:ring-red-500 group"
                    >
                        <FiLogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="hidden sm:block">Sair</span>
                    </button>
                </div>

            </div>
        </header>
    );
}