import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FiX, FiPlus, FiCheckSquare, FiArrowLeft, FiUser, FiShoppingCart, FiDollarSign, FiUserPlus } from 'react-icons/fi';
import type { OrderItemProps, OrderProps } from '../../pages/Balcao/Balcao';
import './ModalOrder.css';

interface ModalOrderProps {
    isOpen: boolean;
    onRequestClose: () => void;
    tableId: string | null;
    orders: OrderProps[];
    // 🟢 ADICIONADO: Função para avisar o Balcão que a conta foi paga
    onFinishOrder: (orderId: string) => void;
    onAddClientToTable: (clientName: string, tableId: string) => void;
}

// 🟢 MOCK DATA PARA TESTE FRONTEND
const MOCK_CATEGORIES = [
    { id: '1', name: 'Bebidas' },
    { id: '2', name: 'Porções' }
];

const MOCK_PRODUCTS: Record<string, any[]> = {
    '1': [
        { id: 'p1', name: 'Coca Cola Lata', price: 6.00 },
        { id: 'p2', name: 'Heineken Long Neck', price: 14.00 }
    ],
    '2': [
        { id: 'p3', name: 'Fritas com Cheddar', price: 35.00 },
        { id: 'p4', name: 'Isca de Peixe', price: 42.00 }
    ]
};

export function ModalOrder({ isOpen, onRequestClose, tableId, orders, onFinishOrder, onAddClientToTable }: ModalOrderProps) {
    const [selectedOrder, setSelectedOrder] = useState<OrderProps | null>(null);
    const [items, setItems] = useState<OrderItemProps[]>([]);

    // Modos da Tela
    const [isAdding, setIsAdding] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    // 🟢 ESTADOS DO NOVO CLIENTE
    const [isAddingClient, setIsAddingClient] = useState(false);
    const [newClientName, setNewClientName] = useState('');

    // Formulário de Adicionar Produto
    const [categories, setCategories] = useState<any[]>(MOCK_CATEGORIES);
    const [products, setProducts] = useState<any[]>([]);
    const [categorySelected, setCategorySelected] = useState(MOCK_CATEGORIES[0].id);
    const [productSelected, setProductSelected] = useState('');
    const [qtdToAdd, setQtdToAdd] = useState('1');

    // Pagamento
    const [paymentMethod, setPaymentMethod] = useState('PIX');

    // ==========================================
    // SELEÇÃO DE CLIENTE E LISTAGEM
    // ==========================================
    function handleSelectClient(order: OrderProps) {
        setSelectedOrder(order);
        setIsAdding(false);
        setIsClosing(false);
        setIsAddingClient(false);

        // Mock: Carrega itens pré-existentes se a comanda já tiver (no Balcao)
    }

    // ==========================================
    // ADICIONAR CLIENTE
    // ==========================================
    function handleConfirmNewClient() {
        if (!newClientName.trim()) {
            alert('Digite o nome do cliente!');
            return;
        }

        // Envia para o Balcão criar o card e atualizar a tela
        onAddClientToTable(newClientName, tableId || '');
        setNewClientName('');
        setIsAddingClient(false);
    }

    // ==========================================
    // ADICIONAR PRODUTOS (MOCK)
    // ==========================================
    function handleOpenAddMode() {
        setIsAdding(true);
        setIsClosing(false);
        setCategorySelected(MOCK_CATEGORIES[0].id);
    }

    // Troca de Categoria -> Muda os Produtos
    useEffect(() => {
        if (!categorySelected) return;

        const prods = MOCK_PRODUCTS[categorySelected] || [];
        setProducts(prods);

        if (prods.length > 0) {
            setProductSelected(prods[0].id);
        } else {
            setProductSelected('');
        }
    }, [categorySelected]);

    function handleAddItem() {
        if (!productSelected) {
            alert("Selecione um produto válido!");
            return;
        }

        const productInfo = products.find(p => p.id === productSelected);

        const newItem: any = {
            id: Math.random().toString(), // Mock ID
            quantity: Number(qtdToAdd),
            price: productInfo.price,
            product: { name: productInfo.name }
        };

        // Adiciona na lista atual de itens
        setItems([...items, newItem]);

        // UX: Volta pra tela de itens automaticamente
        setIsAdding(false);
        setQtdToAdd('1');
    }

    // ==========================================
    // PAGAMENTO E FECHAMENTO (MOCK)
    // ==========================================
    function handleFinishOrder() {
        if (!selectedOrder) return;

        // Avisa o Balcão para remover a comanda da tela
        onFinishOrder(selectedOrder.id);

        // Verifica se ainda tem outros clientes na mesma mesa
        const remainingOrders = orders.filter(o => o.id !== selectedOrder.id);

        if (remainingOrders.length > 0) {
            // Se tem mais gente, volta pra lista de clientes
            setSelectedOrder(null);
            setIsClosing(false);
        } else {
            // Se era o último, fecha o modal (a mesa no Balcão vai ficar escura)
            onRequestClose();
        }
    }

    // ==========================================
    // CÁLCULOS (CORRIGIDOS)
    // ==========================================
    const valorFinal = items.reduce((acc, item) => acc + (Number(item) * Number(item.quantity)), 0);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="modal-box"
            overlayClassName="modal-overlay"
        >
            <button type="button" onClick={onRequestClose} className="modal-close-btn" title="Fechar (Esc)">
                <FiX size={24} />
            </button>

            {/* TELA 1: LISTA DE CLIENTES DA MESA */}
            {!selectedOrder ? (
                <>
                    <h2 className="modal-title">{tableId ? `Mesa ${tableId}` : 'Comandas Avulsas'}</h2>
                    <p className="modal-subtitle">Selecione de quem é a comanda</p>

                    <div className="clients-list custom-scrollbar">
                        {orders.map(order => (
                            <button key={order.id} className="client-btn" onClick={() => handleSelectClient(order)}>
                                <div className="client-icon-box"><FiUser size={24} /></div>
                                <span className="client-name">{order.name || 'Sem nome'}</span>
                            </button>
                        ))}

                        {/* MINI-FORMULÁRIO PARA ADICIONAR NOVO CLIENTE */}
                        {isAddingClient ? (
                            <div className="add-client-form">
                                <input
                                    type="text"
                                    placeholder="Nome do novo cliente..."
                                    className="form-input"
                                    value={newClientName}
                                    onChange={(e) => setNewClientName(e.target.value)}
                                    autoFocus
                                    onKeyDown={(e) => e.key === 'Enter' && handleConfirmNewClient()}
                                />
                                <div className="add-client-actions">
                                    <button className="btn-cancel-client" onClick={() => setIsAddingClient(false)}>Cancelar</button>
                                    <button className="btn-confirm-client" onClick={handleConfirmNewClient}>Salvar Cliente</button>
                                </div>
                            </div>
                        ) : (
                            <button className="btn-add-client" onClick={() => setIsAddingClient(true)}>
                                <FiUserPlus size={20} /> Adicionar pessoa na mesa
                            </button>
                        )}
                    </div>
                </>
            ) : (

                /* TELA 2, 3 e 4: MODO COMANDA SELECIONADA */
                <>
                    <div className="modal-header">
                        <button className="btn-back" onClick={() => {
                            if (isClosing) setIsClosing(false);
                            else if (isAdding) setIsAdding(false);
                            else setSelectedOrder(null); // Volta pra lista de clientes
                        }}>
                            <FiArrowLeft size={20} />
                        </button>
                        <h2 className="modal-title">
                            {isClosing ? 'Finalizar Pagamento' : isAdding ? 'Lançar Produto' : `Comanda: ${selectedOrder.name}`}
                        </h2>
                    </div>

                    {/* SUB-TELA: MODO PAGAMENTO */}
                    {isClosing ? (
                        <div className="form-wrapper">
                            <h3 className="total-display">Total: <span>R$ {valorFinal.toFixed(2).replace('.', ',')}</span></h3>

                            <label className="form-label">Forma de Pagamento</label>
                            <select className="form-select" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                <option value="PIX">Pix</option>
                                <option value="DEBITO">Cartão de Débito</option>
                                <option value="CREDITO">Cartão de Crédito</option>
                                <option value="DINHEIRO">Dinheiro</option>
                                <option value="FIADO">Fiado (Caderneta)</option>
                            </select>

                            <button className="btn-confirm-action" onClick={handleFinishOrder}>
                                <FiDollarSign size={20} /> Confirmar Recebimento
                            </button>
                        </div>

                        /* SUB-TELA: MODO ADICIONAR PRODUTO */
                    ) : isAdding ? (
                        <div className="form-wrapper">
                            <label className="form-label">Categoria</label>
                            <select className="form-select" value={categorySelected} onChange={(e) => setCategorySelected(e.target.value)}>
                                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>

                            <label className="form-label">Produto</label>
                            <select className="form-select" value={productSelected} onChange={(e) => setProductSelected(e.target.value)} disabled={products.length === 0}>
                                {products.length === 0 && <option>Nenhum produto nesta categoria</option>}
                                {products.map(prod => <option key={prod.id} value={prod.id}>{prod.name}</option>)}
                            </select>

                            <label className="form-label">Quantidade</label>
                            <input type="number" min="1" className="form-input" value={qtdToAdd} onChange={(e) => setQtdToAdd(e.target.value)} />

                            <button className="btn-confirm-action" onClick={handleAddItem}>
                                <FiShoppingCart size={20} /> Lançar na Comanda
                            </button>
                        </div>

                        /* SUB-TELA: LISTA DE ITENS DA COMANDA (VISÃO PADRÃO) */
                    ) : (
                        <>
                            <div className="items-list custom-scrollbar">
                                {items.length === 0 && <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px 0' }}>Comanda vazia.</p>}
                                {items.map(item => (
                                    <div key={item.id} className="item-row">
                                        <span className="item-qtd">{item.quantity}x</span>
                                        <span className="item-name">{item.product.name}</span>
                                        <span className="item-price">R$ {(Number(item) * item.quantity).toFixed(2).replace('.', ',')}</span>
                                    </div>
                                ))}
                            </div>

                            <h3 className="total-display">Total: <span>R$ {valorFinal.toFixed(2).replace('.', ',')}</span></h3>

                            <div className="actions-row">
                                <button className="btn-add-product" onClick={handleOpenAddMode}>
                                    <FiPlus size={20} /> Lançar
                                </button>
                                <button className="btn-close-account" onClick={() => setIsClosing(true)}>
                                    <FiCheckSquare size={20} /> Fechar Conta
                                </button>
                            </div>
                        </>
                    )}
                </>
            )}
        </Modal>
    );
}