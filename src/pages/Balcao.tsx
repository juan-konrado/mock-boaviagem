import { useState, useEffect, useMemo  } from 'react';
import { Header } from '../components/Header';
import { FiUsers, FiUser, FiSearch, FiClock, FiPlus } from 'react-icons/fi';
import Modal from 'react-modal';
import { ModalOrder } from '../components/ModalOrder';
import { ModalNewOrder } from '../components/ModalNewOrder';
import { api } from '../services/api';
import { io } from 'socket.io-client';


Modal.setAppElement('#root');

export type OrderProps = {
    id: string;
    tableId: string | null;
    name: string | null;
    status?: string;
    total?: number | string;
    table?: {
        number?: number | string;
        name?: string;
    };
}

export type OrderItemProps = {
    id: string;
    quantity: number;
    orderId: string;
    productId: string;
    product: {
        id: string;
        name: string;
        description: string;
        price: string | number;
    };
    order: {
        id: string;
        name: string | null;
        total: number | string;
    }
}

const MESAS_TOTAIS = Array.from({ length: 25 }, (_, i) => String(i + 1));

// ==========================================
// 🎨 COMPONENTE DE BACKGROUND ADAPTADO PARA DARK MODE
// ==========================================
const FloatingBottles = () => {
    const BottleSVG = ({ className = "w-16 h-16 text-slate-400 dark:text-slate-800" }) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M10 2v7.31L7.95 11.5A3 3 0 0 0 7 13.38V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-6.62a3 3 0 0 0-.95-1.88L14 9.31V2" />
            <path d="M10 5h4" />
        </svg>
    );

    const WineSVG = ({ className = "w-12 h-12 text-slate-400 dark:text-slate-800" }) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M8 22h8" />
            <path d="M12 15v7" />
            <path d="M12 15a7.5 7.5 0 0 0 7.5-7.5V3a1 1 0 0 0-1-1H5.5a1 1 0 0 0-1 1v4.5A7.5 7.5 0 0 0 12 15z" />
            <path d="M5.5 8h13" />
        </svg>
    );

    const CocktailSVG = ({ className = "w-14 h-14 text-slate-400 dark:text-slate-800" }) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="m2 2 20 0" />
            <path d="m11 15 0 7" />
            <path d="m8 22 8 0" />
            <path d="m2 2 10 13 10-13" />
        </svg>
    );

    const BeerSVG = ({ className = "w-14 h-14 text-slate-500 dark:text-slate-800/80" }) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M17 11h1a3 3 0 0 1 0 6h-1" />
            <path d="M9 12v6" />
            <path d="M13 12v6" />
            <path d="M14 7.5c-1 0-1.44.5-3 .5s-2-.5-3-.5-1.72.5-2.5.5a2.5 2.5 0 0 1 5-2.5 2.5 2.5 0 0 1 5 2.5c-.78 0-1.5-.5-2.5-.5Z" />
            <path d="M5 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8" />
        </svg>
    );

    const WhiskeySVG = ({ className = "w-12 h-12 text-slate-400 dark:text-slate-800" }) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M4 2L6 22H18L20 2Z" />
            <path d="M7 10l3-3 4 4 3-3" />
        </svg>
    );

    const CoffeeSVG = ({ className = "w-14 h-14 text-slate-500 dark:text-slate-800/80" }) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
            <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
            <line x1="6" y1="2" x2="6" y2="4" />
            <line x1="10" y1="2" x2="10" y2="4" />
            <line x1="14" y1="2" x2="14" y2="4" />
        </svg>
    );

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 transition-colors duration-500">
            <div className="node-a"><BottleSVG className="w-20 h-20 text-slate-400 dark:text-slate-800" /></div>
            <div className="node-b"><BeerSVG className="w-16 h-16 text-slate-500 dark:text-slate-800/80" /></div>
            <div className="node-c"><CocktailSVG /></div>
            <div className="node-d"><WhiskeySVG /></div>
            <div className="node-e"><WineSVG className="w-16 h-16 text-slate-400 dark:text-slate-800" /></div>
            <div className="node-f"><CoffeeSVG /></div>
            <div className="node-g"><BottleSVG /></div>
            <div className="node-h"><BeerSVG /></div>
            <div className="node-i"><CocktailSVG className="w-12 h-12 text-slate-500 dark:text-slate-800/80" /></div>
            <div className="node-j"><WhiskeySVG className="w-16 h-16 text-slate-400 dark:text-slate-800" /></div>

            <div className="node-k"><WineSVG className="w-14 h-14 text-slate-500 dark:text-slate-800/80" /></div>
            <div className="node-l"><CoffeeSVG className="w-16 h-16 text-slate-400 dark:text-slate-800" /></div>
            <div className="node-m"><BottleSVG className="w-12 h-12 text-slate-500 dark:text-slate-800/80" /></div>
            <div className="node-n"><BeerSVG className="w-20 h-20 text-slate-400 dark:text-slate-800" /></div>
            <div className="node-o"><CocktailSVG /></div>
            <div className="node-p"><WhiskeySVG className="w-14 h-14 text-slate-500 dark:text-slate-800/80" /></div>
            <div className="node-q"><WineSVG /></div>
            <div className="node-r"><BottleSVG className="w-14 h-14 text-slate-400 dark:text-slate-800" /></div>
            <div className="node-s"><BeerSVG className="w-12 h-12 text-slate-500 dark:text-slate-800/80" /></div>
            <div className="node-t"><CoffeeSVG className="w-14 h-14 text-slate-400 dark:text-slate-800" /></div>
        </div>
    );
};

export default function Balcao() {
    const [activeOrders, setActiveOrders] = useState<OrderProps[]>([]);
    const [search, setSearch] = useState('');

    const [modalVisible, setModalVisible] = useState(false);
    const [modalTable, setModalTable] = useState<string | null>(null);
    const [modalOrders, setModalOrders] = useState<OrderProps[]>([]);

    const [modalNewVisible, setModalNewVisible] = useState(false);
    const [newTableNumber, setNewTableNumber] = useState<string | null>(null);

    useEffect(() => {
        async function loadOrders() {
            try {
                const response = await api.get('/orders');
                setActiveOrders(response.data);
            } catch (err) {
                console.log("Erro ao carregar as mesas", err);
            }
        }
        loadOrders();
    }, []);

    function handleOpenDetails(tableId: string | null, orders: OrderProps[]) {
        if (orders.length === 0) {
            setNewTableNumber(tableId);
            setModalNewVisible(true);
            return;
        }
        setModalTable(tableId);
        setModalOrders(orders);
        setModalVisible(true);
    }

    function handleOpenNewAvulsa() {
        setNewTableNumber(null);
        setModalNewVisible(true);
    }

    function handleCloseModal() {
        setModalVisible(false);
    }

    async function refreshOrders() {
        try {
            const response = await api.get('/orders');
            setActiveOrders(response.data);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        const socket = io('http://localhost:3333');
        socket.on('orders_updated', () => {
            refreshOrders();
        });
        return () => {
            socket.disconnect();
        };
    }, []);

    const searchLower = search.toLowerCase();

    const mesasFiltradas = useMemo(() => {
        return MESAS_TOTAIS.filter(numeroMesa => {
            if (!search) return true;
            if (numeroMesa.includes(searchLower)) return true;
            const clientesNaMesa = activeOrders.filter(order => {
                if (!order.table) return false;
                return String(order.table.number) === numeroMesa || String(order.table.name) === numeroMesa;
            });
            return clientesNaMesa.some(cliente => cliente.name?.toLowerCase().includes(searchLower));
        });
    }, [searchLower, activeOrders]);

    const comandasAvulsas = useMemo(() => {
        return activeOrders.filter(order => {
            if (!order.tableId || !order.table) return true;
            const identificadorMesa = String(order.table.number || order.table.name);
            if (!MESAS_TOTAIS.includes(identificadorMesa)) return true;
            return false;
        }).filter(order => {
            if (!search) return true;
            return order.name?.toLowerCase().includes(searchLower);
        });
    }, [searchLower, activeOrders]);

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 relative transition-colors duration-300">
            <FloatingBottles />

            <div className="relative z-10">
                <Header />

                <main className="max-w-[1400px] mx-auto px-4 py-8 md:px-8">

                    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors">Frente de Caixa</h1>
                            <p className="text-slate-600 dark:text-slate-400 mt-1 font-medium transition-colors">Gerenciamento de mesas e comandas</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-400 px-5 py-2.5 rounded-full border border-emerald-300 dark:border-emerald-800 shadow-sm backdrop-blur-sm transition-colors">
                                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-500/50"></div>
                                <span className="text-sm font-bold tracking-wide uppercase">Caixa Aberto</span>
                            </div>
                        </div>
                    </header>

                    <div className="flex flex-col md:flex-row gap-4 mb-8">
                        <div className="relative flex-1 group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FiSearch className="h-6 w-6 text-orange-500 dark:text-orange-400 transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar comanda por cliente ou mesa..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full h-full min-h-[64px] pl-14 pr-4 py-4 bg-white/95 dark:bg-slate-900/80 backdrop-blur-md border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors duration-200 text-lg font-medium"
                            />
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-200/80 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-md backdrop-blur-sm hidden sm:block">Ctrl + K</span>
                            </div>
                        </div>

                        <button
                            onClick={handleOpenNewAvulsa}
                            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white min-h-[64px] px-8 rounded-2xl font-bold text-lg shadow-lg shadow-blue-600/30 dark:shadow-blue-500/20 flex items-center justify-center gap-3 transition-all duration-200 hover:-translate-y-1 outline-none focus:ring-4 focus:ring-blue-500/50 whitespace-nowrap"
                        >
                            <FiPlus className="w-6 h-6" />
                            Nova Comanda
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        <section className="lg:col-span-8 bg-white/85 dark:bg-slate-900/70 backdrop-blur-lg p-6 rounded-3xl shadow-md border border-white/50 dark:border-slate-700/50 transition-colors">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors">Mapa de Mesas</h2>
                                <span className="text-sm font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
                                    {mesasFiltradas.length} mesas
                                </span>
                            </div>

                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                {mesasFiltradas.length === 0 && (
                                    <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400 flex flex-col items-center font-medium">
                                        <FiSearch className="w-12 h-12 mb-3 opacity-50 text-slate-400 dark:text-slate-500" />
                                        <p className="text-lg">Nenhuma mesa encontrada.</p>
                                    </div>
                                )}

                                {mesasFiltradas.map(numeroMesa => {
                                    const clientesNaMesa = activeOrders.filter(order => order.table && String(order.table.number) === numeroMesa);
                                    const isOcupada = clientesNaMesa.length > 0;

                                    return (
                                        <button
                                            key={numeroMesa}
                                            onClick={() => handleOpenDetails(numeroMesa, clientesNaMesa)}
                                            className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-200 border-2 outline-none focus:ring-4 focus:ring-blue-500/30 ${isOcupada
                                                    ? 'bg-blue-600 dark:bg-blue-500 border-blue-600 dark:border-blue-500 shadow-lg shadow-blue-600/30 dark:shadow-blue-500/20 hover:bg-blue-700 dark:hover:bg-blue-600 hover:-translate-y-1'
                                                    : 'bg-white/95 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-orange-500 dark:hover:border-orange-400 hover:text-orange-600 dark:hover:text-orange-400 hover:shadow-md hover:-translate-y-0.5'
                                                }`}
                                        >
                                            <span className={`text-3xl font-black ${isOcupada ? 'text-white' : 'text-inherit'}`}>
                                                {numeroMesa}
                                            </span>

                                            {isOcupada && (
                                                <div className="absolute -top-3 -right-3 bg-orange-500 dark:bg-orange-600 text-white text-xs font-black px-2.5 py-1.5 rounded-full flex items-center gap-1 shadow-md border-2 border-white dark:border-slate-800 transition-colors">
                                                    <FiUsers className="w-3.5 h-3.5" />
                                                    <span>{clientesNaMesa.length}</span>
                                                </div>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        </section>

                        <section className="lg:col-span-4 bg-white/85 dark:bg-slate-900/70 backdrop-blur-lg p-6 rounded-3xl shadow-md border border-white/50 dark:border-slate-700/50 flex flex-col h-[700px] transition-colors">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors">Balcão (Avulsas)</h2>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                                {comandasAvulsas.length === 0 && (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 font-medium">
                                        <p className="text-center">{search ? "Nenhum cliente encontrado." : "Balcão livre no momento."}</p>
                                    </div>
                                )}

                                {comandasAvulsas.map(order => (
                                    <button
                                        key={order.id}
                                        onClick={() => handleOpenDetails(null, [order])}
                                        className="w-full text-left bg-white/95 dark:bg-slate-800/90 border-2 border-slate-100 dark:border-slate-700 p-4 rounded-2xl flex justify-between items-center group hover:bg-blue-50 dark:hover:bg-slate-700/80 hover:border-blue-300 dark:hover:border-slate-600 hover:shadow-md transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <div className="bg-orange-100 dark:bg-orange-500/20 p-2 rounded-lg text-orange-600 dark:text-orange-400 group-hover:bg-orange-500 dark:group-hover:bg-orange-500 group-hover:text-white transition-colors shadow-sm">
                                                    <FiUser className="w-4.5 h-4.5" />
                                                </div>
                                                <span className="font-bold text-slate-800 dark:text-slate-100 text-lg group-hover:text-blue-800 dark:group-hover:text-blue-300 transition-colors">
                                                    {order.name || 'Cliente'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs ml-11 font-medium transition-colors">
                                                <FiClock className="w-3 h-3" />
                                                <span>Aberto agora</span>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <span className="block text-xl font-black text-slate-900 dark:text-white group-hover:text-blue-900 dark:group-hover:text-blue-300 transition-colors">
                                                {order.total ? `R$ ${Number(order.total).toFixed(2).replace('.', ',')}` : 'R$ 0,00'}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </section>

                    </div>

                    {modalVisible && (
                        <ModalOrder
                            isOpen={modalVisible}
                            onRequestClose={handleCloseModal}
                            tableId={modalTable}
                            orders={modalOrders}
                        />
                    )}

                    {modalNewVisible && (
                        <ModalNewOrder
                            isOpen={modalNewVisible}
                            onRequestClose={() => setModalNewVisible(false)}
                            tableNumber={newTableNumber}
                            onSuccess={refreshOrders}
                        />
                    )}

                </main>
            </div>
        </div>
    );
}