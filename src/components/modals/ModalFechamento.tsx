import Modal from 'react-modal';
import { FiX, FiLock, FiDollarSign, FiCreditCard, FiSmartphone } from 'react-icons/fi';
import './ModalFechamento.css';

interface ModalFechamentoProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onConfirmClose: () => void;
}

export function ModalFechamento({ isOpen, onRequestClose, onConfirmClose }: ModalFechamentoProps) {
    // 🟢 MOCK DE DADOS DO FECHAMENTO DO DIA
    const resumoDoDia = {
        totalVendas: 42,
        faturamentoTotal: 3450.00,
        pix: 1850.00,
        credito: 1200.00,
        dinheiro: 400.00,
        horarioAbertura: '17:30',
        horarioFechamento: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    function formatMoney(value: number) {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="modal-box-fechamento"
            overlayClassName="modal-overlay"
        >
            <div className="modal-header-fechamento">
                <div>
                    <h2 className="modal-title">Fechamento de Caixa</h2>
                    <p className="modal-subtitle">Confira os valores antes de encerrar o turno.</p>
                </div>
                <button type="button" onClick={onRequestClose} className="modal-close-btn" title="Cancelar">
                    <FiX size={24} />
                </button>
            </div>

            <div className="fechamento-content">
                <div className="fechamento-hero">
                    <span className="fechamento-label">Faturamento Total Bruto</span>
                    <strong className="fechamento-total">{formatMoney(resumoDoDia.faturamentoTotal)}</strong>
                    <div className="fechamento-badges">
                        <span className="badge-info">{resumoDoDia.totalVendas} Comandas</span>
                        <span className="badge-info">Abertura: {resumoDoDia.horarioAbertura}</span>
                    </div>
                </div>

                <div className="fechamento-breakdown">
                    <h3 className="breakdown-title">Resumo por Pagamento</h3>

                    <div className="breakdown-row">
                        <div className="breakdown-item">
                            <FiSmartphone size={18} />
                            <span>PIX</span>
                        </div>
                        <strong>{formatMoney(resumoDoDia.pix)}</strong>
                    </div>

                    <div className="breakdown-row">
                        <div className="breakdown-item">
                            <FiCreditCard size={18} />
                            <span>Cartões (Débito/Crédito)</span>
                        </div>
                        <strong>{formatMoney(resumoDoDia.credito)}</strong>
                    </div>

                    <div className="breakdown-row highlight-row">
                        <div className="breakdown-item">
                            <FiDollarSign size={18} />
                            <span>Dinheiro (Gaveta)</span>
                        </div>
                        <strong>{formatMoney(resumoDoDia.dinheiro)}</strong>
                    </div>
                </div>
            </div>

            <div className="fechamento-footer">
                <button type="button" className="btn-cancel" onClick={onRequestClose}>
                    Voltar
                </button>
                <button type="button" className="btn-confirm-fechamento" onClick={onConfirmClose}>
                    <FiLock size={20} /> Encerrar Turno
                </button>
            </div>
        </Modal>
    );
}