import React, { createContext, useState, useEffect } from 'react';

export const ItemContext = createContext();

const URL_FIREBASEPRODUTOS = 'https://firestore.googleapis.com/v1/projects/produtos-9f36d/databases/(default)/documents/produtos';

export const ItemProvider = ({ children }) => {
  const [itens, setItens] = useState([]);

  const excluirDoBancoDeDados = async (id) => {
    try{
      const url = `${URL_FIREBASEPRODUTOS}/${id}`;
      const response = await fetch(url, {method: 'DELETE'});

      if(response.ok){
        console.log('Produto excluído com sucesso!');
        setItens((prevItens) => prevItens.filter((item) => item.id !== id));
      } else {
        const erro = await response.text();
        console.log('Erro ao excluir produto!', response.status, erro);
      }
    } catch (error) {
      console.error('Erro de conexão com banco de dados!', error);
    } 
  };

  const carregarProdutos = async () => {
    try {
      const response = await fetch(URL_FIREBASEPRODUTOS);
      const data = await response.json();

      if(data.documents) {
        const produtos = data.documents.map((doc) => ({
          id: doc.name.split('/').pop(),
          nome: doc.fields.nome?.stringValue || '',
          preco: doc.fields.preco?.doubleValue || parseFloat(doc.fields.preco?.stringValue || 0),
          imagem: doc.fields.imagem?.stringValue || '',
          status: doc.fields.status?.stringValue || 'Disponível',
          quantidade: Number(doc.fields.quantidade?.integerValue) || parseInt(doc.fields.quantidade?.stringValue || 0),
        }));

        setItens(produtos);
        console.log('Produtos carregados do firestore', produtos);
      } else {
        console.log('Nenhum produto encontrado no firestore');
        setItens([]);
      }
    } catch(error) {
      console.log('Erro ao carregar os produtos', error);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const editarItens = async (id, novosDados) => {
    try {
      const camposParaAtualizar = ['nome', 'preco', 'imagem']
      .map(campo => `updateMask.fieldPaths=${campo}`)
      .join('&');

      const url = `${URL_FIREBASEPRODUTOS}/${id}?${camposParaAtualizar}`;

      const body = {
        fields: {
          nome: { stringValue: novosDados.nome },
          preco: { doubleValue: parseFloat(novosDados.preco) }, 
          imagem: { stringValue: novosDados.imagem},
        },
      };
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body),
      });

      if(response.ok) {
        console.log('Produto atualizado com sucesso!');
        setItens((prev) =>
          prev.map((item) =>
            item.id === id ? {...item, ...novosDados } : item
          )
        );
      } else {
        const erro = await response.text();
        console.error('Erro ao atualizar produto', response.status, erro);
      }
    } catch(error) {
      console.log('Erro de conexão com o banco de dados', error);
    }
  };

  const atualizarStatus = (id, novoStatus) => {
    setItens((prevItens) =>
      prevItens.map((item) =>
        item.id === id ? {...item, status: novoStatus } : item
      )
    );
  };

  const atualizarQuantidade = (id, novaQuantidade) => {
    setItens((prevItens) =>
      prevItens.map((item) =>
        item.id === id ? {...item, quantidade: novaQuantidade } : item
      )
    );
  };

  return (
    <ItemContext.Provider value={{ itens, setItens, atualizarStatus, atualizarQuantidade, carregarProdutos, editarItens, excluirDoBancoDeDados }}>
      {children}
    </ItemContext.Provider>
  );
};
