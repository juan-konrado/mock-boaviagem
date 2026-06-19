import { useState } from 'react';
import Modal from 'react-modal';
import { FiX, FiCheckSquare, FiUser } from 'react-icons/fi';
import './ModalNewOrder.css';

interface ModalNewOrderProps {
    isOpen: boolean;
    onRequestClose: () => void;
    tableNumber: string | null;
    // 🟢 O onSuccess agora recebe o novo cliente gerado pelo frontend
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

        // ==========================================
        // 🟢 MOCK FRONTEND: Simulando a criação no Banco
        // ==========================================
        setTimeout(() => {
            const mockNewOrder = {
                id: Math.random().toString(36).substr(2, 9), // Gera um ID aleatório único
                tableId: tableNumber,
                name: finalName,
                total: 0,
                status: 'Aberto',
                table: isAvulsa ? null : { number: tableNumber }
            };

            setClientName('');
            setLoading(false);

            // Avisa o Balcão que a comanda foi criada e manda os dados dela
            onSuccess(mockNewOrder);
            onRequestClose();

        }, 600); // Delay de 600ms para dar a sensação de processamento
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
            className="modal-box"
            overlayClassName="modal-overlay"
        >
            <button
                type="button"
                onClick={onRequestClose}
                className="modal-close-btn"
                title="Fechar (Esc)"
            >
                <FiX size={24} />
            </button>

            <h2 className="modal-title">
                {isAvulsa ? 'Nova Comanda Avulsa' : `Abrir Mesa ${tableNumber}`}
            </h2>
            <p className="modal-subtitle">
                {isAvulsa ? 'Iniciando atendimento no balcão' : 'Iniciando uma nova comanda'}
            </p>

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