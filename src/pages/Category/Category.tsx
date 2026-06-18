import { useState, useEffect, type FormEvent } from 'react';
import { api } from '../../services/api';
import { FiTrash2 } from 'react-icons/fi';
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

    // Impede o cadastro de strings vazias ou só com espaços
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
    const confirmDelete = window.confirm(`Tem a certeza absoluta que deseja eliminar a categoria "${categoryName}"?`);

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
        <h1 className="category-title">Registrar Categoria</h1>

        <form onSubmit={handleRegister} className="category-form">
          <input
            type="text"
            placeholder="Digite o nome da categoria"
            className="category-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" className="category-button">
            Registrar
          </button>
        </form>

        {categories.length > 0 && (
          <>
            <h2 className="category-subtitle">Categorias Registradas</h2>

            <div className="category-list">
              {categories.map(item => (
                <div key={item.id} className="category-list-item">
                  <span className="category-item-text">{item.name}</span>

                  <button
                    onClick={() => handleDeleteCategory(item.id, item.name)}
                    className="category-delete-btn"
                    title="Eliminar categoria"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}