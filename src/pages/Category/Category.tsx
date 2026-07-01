import { useState, useEffect, type FormEvent } from 'react';
import { api } from '../../services/api';
import { FiTrash2, FiPlus, FiTag, FiFolder } from 'react-icons/fi';
import './Category.css';

type CategoryProps = {
  id: string;
  name: string;
}

export default function Category() {
  const [name, setName] = useState('');
  const [categories, setCategories] = useState<CategoryProps[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const response = await api.get('/category');
      setCategories(response.data);
    } catch (err) {
      console.error("Erro ao carregar categorias", err);
    }
  }

  async function handleRegister(event: FormEvent) {
    event.preventDefault();

    if (name.trim() === '') return;

    try {
      await api.post('/category', { name: name });
      alert('Categoria registrada com sucesso!');
      setName('');
      loadCategories();
    } catch (err) {
      console.error(err);
      alert('Erro ao registrar a categoria.');
    }
  }

  async function handleDeleteCategory(id: string, categoryName: string) {
    const confirmDelete = window.confirm(`Tem certeza que deseja excluir a categoria "${categoryName}"?`);

    if (confirmDelete) {
      try {
        await api.delete('/category', {
          params: { category_id: id }
        });

        alert('Categoria eliminada com sucesso!');
        loadCategories();

      } catch (err) {
        console.error(err);
        alert('Erro ao eliminar!');
      }
    }
  }

  return (
    <div className="category-container">
      <main className="category-main">

        <header className="category-header">
          <h1 className="category-title">Gestão de Categorias</h1>
          <p className="category-subtitle">Organize os grupos do seu cardápio e estoque.</p>
        </header>

        <div className="category-grid">

          {/* LADO ESQUERDO: FORMULÁRIO */}
          <section className="category-card form-section">
            <div className="card-header">
              <FiPlus className="card-icon" />
              <h2>Nova Categoria</h2>
            </div>

            <form onSubmit={handleRegister} className="category-form">
              <div className="input-group">
                <label>Nome da Categoria</label>
                <div className="input-wrapper">
                  <FiTag className="input-icon" />
                  <input
                    type="text"
                    placeholder="Ex: Bebidas, Sobremesas..."
                    className="category-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <button type="submit" className="category-button" disabled={!name.trim()}>
                Cadastrar
              </button>
            </form>
          </section>

          {/* LADO DIREITO: LISTA */}
          <section className="category-card list-section">
            <div className="card-header">
              <FiFolder className="card-icon" />
              <h2>Categorias Registradas</h2>
              <span className="badge-count">{categories.length}</span>
            </div>

            <div className="category-list-wrapper custom-scrollbar">
              {categories.length === 0 ? (
                <div className="empty-state">
                  <FiFolder size={48} />
                  <p>Nenhuma categoria cadastrada ainda.</p>
                </div>
              ) : (
                <div className="category-list">
                  {categories.map(item => (
                    <div key={item.id} className="category-list-item">
                      <div className="item-info">
                        <div className="item-icon-box">
                          <FiTag size={16} />
                        </div>
                        <span className="category-item-text">{item.name}</span>
                      </div>

                      <button
                        onClick={() => handleDeleteCategory(item.id, item.name)}
                        className="category-delete-btn"
                        title="Eliminar categoria"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}