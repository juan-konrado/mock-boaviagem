import { useState, useEffect, useMemo } from 'react';
import { FiUsers, FiUser, FiSearch, FiClock, FiPlus } from 'react-icons/fi';
import Modal from 'react-modal';
import { io } from 'socket.io-client';

// Componentes Reutilizáveis
import { ModalOrder } from '../../components/modals/ModalOrder';
import { ModalNewOrder } from '../../components/modals/ModalNewOrder';

// Estilos Nativos e API
import './Balcao.css';
import { api } from '../../services/api';

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
                console.error("Erro ao carregar as mesas", err);
            }
        }
        loadOrders();
    }, []);

    useEffect(() => {
        const socket = io('http://localhost:3333');
        socket.on('orders_updated', handleNewOrderCreated);
        return () => { socket.disconnect(); };
    }, []);

    // 🟢 NOVA LÓGICA NO BALCAO.TSX
    function handleNewOrderCreated(newOrder: OrderProps) {
        // 1. Adiciona a nova comanda à tela na mesma hora
        const updatedOrders = [...activeOrders, newOrder];
        setActiveOrders(updatedOrders);

        // 2. Filtra quem está na mesa criada para jogar dentro do Modal de Detalhes
        const clientesNaMesa = updatedOrders.filter(order => order.tableId === newOrder.tableId);

        // 3. Abre o Modal Principal (ModalOrder) com a mesa e os clientes atrelados
        setModalTable(newOrder.tableId);
        setModalOrders(clientesNaMesa);
        setModalVisible(true); // <--- Isso aqui abre o modal principal automaticamente!
    }

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

    function handleOrderFinished(orderId: string) {
        // Filtra e remove a comanda paga da tela
        const updatedOrders = activeOrders.filter(order => order.id !== orderId);
        setActiveOrders(updatedOrders);

        // Se o modal estiver aberto, atualiza a lista de clientes dele em tempo real
        const remainingOrdersInTable = modalOrders.filter(order => order.id !== orderId);
        setModalOrders(remainingOrdersInTable);
    }

    const searchLower = search.toLowerCase();

    const mesasFiltradas = useMemo(() => {
        return MESAS_TOTAIS.filter(numeroMesa => {
            if (!search) return true;
            if (numeroMesa.includes(searchLower)) return true;
            const clientesNaMesa = activeOrders.filter(order => order.table && String(order.table.number) === numeroMesa);
            return clientesNaMesa.some(cliente => cliente.name?.toLowerCase().includes(searchLower));
        });
    }, [searchLower, activeOrders]);

    const comandasAvulsas = useMemo(() => {
        return activeOrders.filter(order => {
            if (!order.tableId || !order.table) return true;
            const identificadorMesa = String(order.table.number || order.table.name);
            return !MESAS_TOTAIS.includes(identificadorMesa);
        }).filter(order => {
            if (!search) return true;
            return order.name?.toLowerCase().includes(searchLower);
        });
    }, [searchLower, activeOrders]);


    function handleAddClientToTable(clientName: string, tableId: string) {
        const isAvulsa = !tableId; // Se tableId for vazio, significa que é um cliente de balcão.

        const newOrder: OrderProps = {
            id: Math.random().toString(36).substr(2, 9),
            tableId: isAvulsa ? null : tableId,
            name: clientName,
            total: 0,
            status: 'Aberto',
            table: isAvulsa ? undefined : { number: tableId }
        };

        // 1. Adiciona o cliente na memória global da tela
        const updatedOrders = [...activeOrders, newOrder];
        setActiveOrders(updatedOrders);

        // 2. Atualiza os clientes que estão sendo visualizados AGORA no Modal aberto
        const clientesNestaMesa = updatedOrders.filter(order => order.tableId === tableId);
        setModalOrders(clientesNestaMesa);
    }

    return (
        <div className="balcao-layout">

            <div className="balcao-container">

                {/* CABEÇALHO */}
                <header className="balcao-header">
                    <div>
                        <h1 className="balcao-title">Frente de Caixa</h1>
                        <p className="balcao-subtitle">Gerenciamento de mesas e comandas</p>
                    </div>
                    <div className="status-badge">
                        <div className="status-dot"></div>
                        <span className="status-text">Caixa Aberto</span>
                    </div>
                </header>

                {/* BARRA DE AÇÕES */}
                <div className="action-bar">
                    <div className="search-wrapper">
                        <FiSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar comanda por cliente ou mesa..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <button onClick={handleOpenNewAvulsa} className="btn-new-order">
                        <FiPlus size={24} />
                        Nova Comanda
                    </button>
                </div>

                {/* GRID PRINCIPAL */}
                <div className="main-grid">

                    {/* MAPA DE MESAS */}
                    <section className="section-panel">
                        <div className="panel-header">
                            <h2 className="panel-title">Mapa de Mesas</h2>
                            <span className="badge-count">{mesasFiltradas.length} mesas</span>
                        </div>

                        <div className="tables-grid">
                            {mesasFiltradas.map(numeroMesa => {
                                const clientesNaMesa = activeOrders.filter(order => order.table && String(order.table.number) === numeroMesa);
                                const isOcupada = clientesNaMesa.length > 0;

                                return (
                                    <button
                                        key={numeroMesa}
                                        onClick={() => handleOpenDetails(numeroMesa, clientesNaMesa)}
                                        className={`table-card ${isOcupada ? 'table-occupied' : 'table-free'}`}
                                    >
                                        <span className="table-number">{numeroMesa}</span>
                                        {isOcupada && (
                                            <div className="table-users-badge">
                                                <FiUsers size={14} />
                                                <span>{clientesNaMesa.length}</span>
                                            </div>
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </section>

                    {/* BALCÃO AVULSO */}
                    <section className="section-panel section-panel-tall">
                        <h2 className="panel-title" style={{ marginBottom: '24px' }}>Balcão (Avulsas)</h2>

                        <div className="avulsas-list">
                            {comandasAvulsas.map(order => (
                                <button
                                    key={order.id}
                                    onClick={() => handleOpenDetails(null, [order])}
                                    className="avulsa-card"
                                >
                                    <div className="avulsa-info">
                                        <div className="avulsa-client-row">
                                            <div className="avulsa-icon">
                                                <FiUser size={18} />
                                            </div>
                                            <span className="avulsa-name">{order.name || 'Cliente'}</span>
                                        </div>
                                        <div className="avulsa-time">
                                            <FiClock size={14} />
                                            <span>Aberto agora</span>
                                        </div>
                                    </div>
                                    <span className="avulsa-price">
                                        {order.total ? `R$ ${Number(order.total).toFixed(2).replace('.', ',')}` : 'R$ 0,00'}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </section>
                </div>

                {/* MODAIS */}
                {modalVisible && (
                    <ModalOrder
                        isOpen={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                        tableId={modalTable}
                        orders={modalOrders}
                        onFinishOrder={handleOrderFinished}
                        onAddClientToTable={handleAddClientToTable}
                    />
                )}

                {modalNewVisible && (
                    <ModalNewOrder
                        isOpen={modalNewVisible}
                        onRequestClose={() => setModalNewVisible(false)}
                        tableNumber={newTableNumber}
                        onSuccess={handleNewOrderCreated}
                    />
                )}
            </div>
        </div>
    );
}