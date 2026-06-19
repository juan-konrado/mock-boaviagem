import { useState } from 'react';
import { FiPlus, FiSearch, FiEdit2, FiAlertCircle } from 'react-icons/fi';
import './Inventory.css';

export type InsumoProps = {
    id: string;
    name: string;
    unit: 'UN' | 'KG' | 'L' | 'G' | 'ML';
    currentStock: number;
    minStock: number;
    costPrice: number;
}

const MOCK_INSUMOS: InsumoProps[] = [
    { id: 'i1', name: 'Pão de Hambúrguer Brioche', unit: 'UN', currentStock: 120, minStock: 50, costPrice: 1.20 },
    { id: 'i2', name: 'Carne Bovina (Blend)', unit: 'KG', currentStock: 8.5, minStock: 10, costPrice: 35.00 },
    { id: 'i3', name: 'Coca-Cola Lata 350ml', unit: 'UN', currentStock: 24, minStock: 48, costPrice: 2.50 },
    { id: 'i4', name: 'Queijo Cheddar Fatiado', unit: 'KG', currentStock: 1.2, minStock: 2, costPrice: 42.00 },
];

export default function Inventory() {
    const [insumos, setInsumos] = useState<InsumoProps[]>(MOCK_INSUMOS);
    const [search, setSearch] = useState('');

    const filteredInsumos = insumos.filter(ins =>
        ins.name.toLowerCase().includes(search.toLowerCase())
    );

    function getStockStatus(current: number, min: number) {
        if (current <= min * 0.5) return 'stock-critical'; // Menos da metade do mínimo
        if (current <= min) return 'stock-warning'; // Abaixo ou igual ao mínimo
        return 'stock-good';
    }

    return (
        <div className="inventory-container">
            <main className="inventory-main">

                <header className="inventory-header">
                    <div>
                        <h1 className="inventory-title">Estoque e Insumos</h1>
                        <p className="inventory-subtitle">Gerencie ingredientes e produtos de revenda direta</p>
                    </div>
                    <button className="btn-primary" style={{ backgroundColor: 'var(--brand-emerald)' }}>
                        <FiPlus size={20} /> Novo Insumo
                    </button>
                </header>

                <div className="inventory-actions">
                    <div className="search-wrapper" style={{ flex: 1 }}>
                        <FiSearch className="search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar insumo..."
                            className="search-input"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="inventory-list-wrapper">
                    <div className="inventory-list-header">
                        <div>Nome do Insumo</div>
                        <div>Estoque Atual</div>
                        <div>Estoque Mínimo</div>
                        <div>Custo Médio</div>
                        <div>Ações</div>
                    </div>

                    {filteredInsumos.map(insumo => {
                        const statusClass = getStockStatus(insumo.currentStock, insumo.minStock);

                        return (
                            <div key={insumo.id} className="inventory-item-row">
                                <div className="insumo-name-box">
                                    <span className="insumo-name">{insumo.name}</span>
                                    <span className="insumo-unit">Vendido por: {insumo.unit}</span>
                                </div>

                                <div className={`insumo-stock ${statusClass}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {insumo.currentStock} {insumo.unit}
                                    {statusClass !== 'stock-good' && <FiAlertCircle size={16} />}
                                </div>

                                <div style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>
                                    {insumo.minStock} {insumo.unit}
                                </div>

                                <div className="insumo-cost">
                                    R$ {insumo.costPrice.toFixed(2).replace('.', ',')} / {insumo.unit}
                                </div>

                                <div>
                                    <button className="btn-icon" title="Ajustar/Editar">
                                        <FiEdit2 size={18} />
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>

            </main>
        </div>
    );
}