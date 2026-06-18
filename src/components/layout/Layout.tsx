import { Outlet } from 'react-router-dom';
import { Sidebar } from './SideBar/SideBar';
import './Layout.css';

export function Layout() {
    return (
        <div className="layout-wrapper">
            {/* 1. A barra lateral que nunca recarrega */}
            <Sidebar />

            {/* 2. Onde as páginas (Balcão, Dashboard, etc) serão ejetadas */}
            <div className="layout-main-content">
                <Outlet />
            </div>
        </div>
    );
}