import "../../css/Details.css";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

function DetalhesProduto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Carrega os dados do produto
  useEffect(() => {
    const carregarProduto = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`http://localhost:8080/produtos/${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error("Produto não encontrado");
        }
        
        const data = await response.json();
        setProduto(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    carregarProduto();
  }, [id]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:8080/produtos/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir produto");
      }

      alert("Produto excluído com sucesso!");
      navigate("/produtos");
    } catch (error) {
      alert("Erro: " + error.message);
      setConfirmDelete(false);
    }
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  if (error) {
    return <div className="error">Erro: {error}</div>;
  }

  if (!produto) {
    return <div className="error">Produto não encontrado</div>;
  }

  return (
    <div className="details-wrapper">
      <div className="details-container">
        <div className="details-header">
          <h2>Detalhes do Produto</h2>
          <div className="details-actions">
            <Link to={`/editar-produto/${produto.id}`} className="btn-editar">
              Editar
            </Link>
            <button 
              className="btn-excluir"
              onClick={() => setConfirmDelete(true)}
            >
              Excluir
            </button>
          </div>
        </div>

        <div className="details-content">
          <div className="details-row">
            <span className="details-label">ID:</span>
            <span className="details-value">{produto.id}</span>
          </div>
          
          <div className="details-row">
            <span className="details-label">Nome:</span>
            <span className="details-value">{produto.nome}</span>
          </div>
          
          <div className="details-row">
            <span className="details-label">Descrição:</span>
            <span className="details-value details-text">{produto.descricao || "Nenhuma descrição"}</span>
          </div>
          
          <div className="details-row">
            <span className="details-label">Preço:</span>
            <span className="details-value">
              {new Intl.NumberFormat('pt-BR', { 
                style: 'currency', 
                currency: 'BRL' 
              }).format(produto.preco)}
            </span>
          </div>
          
          <div className="details-row">
            <span className="details-label">Estoque:</span>
            <span className="details-value">{produto.quantidadeEstoque} unidades</span>
          </div>
          
          <div className="details-row">
            <span className="details-label">Status:</span>
            <span className="details-value">
              {produto.isAtivo ? (
                <span className="status-ativo">Ativo</span>
              ) : (
                <span className="status-inativo">Inativo</span>
              )}
            </span>
          </div>
          
          <div className="details-row">
            <span className="details-label">Categoria:</span>
            <span className="details-value">
              {produto.categoria?.nome || "Nenhuma categoria"}
            </span>
          </div>
          
          <div className="details-row">
            <span className="details-label">Data de Criação:</span>
            <span className="details-value">
              {new Date(produto.dataCriacao).toLocaleDateString('pt-BR')}
            </span>
          </div>
          
          {produto.dataAtualizacao && (
            <div className="details-row">
              <span className="details-label">Última Atualização:</span>
              <span className="details-value">
                {new Date(produto.dataAtualizacao).toLocaleDateString('pt-BR')}
              </span>
            </div>
          )}
        </div>

        {confirmDelete && (
          <div className="confirmation-overlay">
            <div className="modal-content">
              <h3>Confirmar Exclusão</h3>
              <p>Tem certeza que deseja excluir o produto "{produto.nome}"?</p>
              <div className="modal-actions">
                <button 
                  className="btn-confirm"
                  onClick={handleDelete}
                >
                  Confirmar
                </button>
                <button 
                  className="btn-cancel"
                  onClick={() => setConfirmDelete(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DetalhesProduto;