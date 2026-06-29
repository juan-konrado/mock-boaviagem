import { useState } from 'react';
import Modal from 'react-modal';
import { FiX, FiCheckSquare, FiUser } from 'react-icons/fi';
import './ModalNewOrder.css';

interface ModalNewOrderProps {
    isOpen: boolean;
    onRequestClose: () => void;
    tableNumber: string | null;
    onSuccess: (newOrder: any) => void;
}

export function ModalNewOrder({ isOpen, onRequestClose, tableNumber, onSuccess }: ModalNewOrderProps) {
    const [clientName, setClientName] = useState('');
    const [loading, setLoading] = useState(false);

    const isAvulsa = !tableNumber;

    async function handleOpenTable() {
        const finalName = clientName.trim() === ''
            ? (isAvulsa ? 'Cliente Avulso' : `Mesa ${tableNumber}`)
            : clientName;

        setLoading(true);

        // Simulando a criação no Banco
        setTimeout(() => {
            const mockNewOrder = {
                id: Math.random().toString(36).substr(2, 9),
                tableId: tableNumber,
                name: finalName,
                total: 0,
                status: 'Aberto',
                table: isAvulsa ? null : { number: tableNumber }
            };

            setClientName('');
            setLoading(false);

            onSuccess(mockNewOrder);
            onRequestClose();
        }, 600);
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter') {
            handleOpenTable();
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="modal-box-new-order"
            overlayClassName="modal-overlay"
        >
            {/* 🟢 CABEÇALHO DO MODAL */}
            <div className="modal-header-new-order">
                <div>
                    <h2 className="modal-title">
                        {isAvulsa ? 'Nova Comanda Avulsa' : `Abrir Mesa ${tableNumber}`}
                    </h2>
                    <p className="modal-subtitle">
                        {isAvulsa ? 'Iniciando atendimento no balcão' : 'Iniciando uma nova comanda'}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onRequestClose}
                    className="modal-close-btn"
                    title="Fechar"
                >
                    <FiX size={24} />
                </button>
            </div>

            {/* 🟢 CORPO DO MODAL */}
            <div className="input-group">
                <label className="input-label">
                    Nome do Cliente / Responsável
                </label>
                <div className="input-wrapper">
                    <FiUser className="input-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Ex: João Silva"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="form-input-order"
                    />
                    <span className="enter-hint">Enter ↵</span>
                </div>
            </div>

            {/* 🟢 RODAPÉ DO MODAL */}
            <button
                onClick={handleOpenTable}
                disabled={loading}
                className="btn-submit-order"
            >
                <FiCheckSquare size={22} />
                {loading ? 'Abrindo...' : 'Confirmar Abertura'}
            </button>
        </Modal>
    );
}