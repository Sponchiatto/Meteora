import { useContext, useEffect, useMemo } from "react";
import { CarrinhoContext } from "../context/CarrinhoContext";

export const useCarrinhoContext = () => {
  const {
    carrinho,
    setCarrinho,
    quantidade,
    setQuantidade,
    valorTotal,
    setValorTotal,
  } = useContext(CarrinhoContext);

  function mudarQuantidade(id, quantidade) {
    return carrinho.map((itemDoCarrinho) => {
      if (itemDoCarrinho.id === id) itemDoCarrinho.quantidade += quantidade;
      return itemDoCarrinho;
    });
  }

  function adicionarProduto(novoProduto) {
    const temOProduto = carrinho.some(
      (itemDoCarrinho) => itemDoCarrinho.id === novoProduto.id
    );
    if (!temOProduto) {
      novoProduto.quantidade = 1;
      return setCarrinho((carrinhoAnterior) => [
        ...carrinhoAnterior,
        novoProduto,
      ]);
    }
    const carrinhoAtualizado = mudarQuantidade(novoProduto.id, 1);

    setCarrinho([...carrinhoAtualizado]);
  }

  function removerProduto(id) {
    // encontra o produto em questão
    const produto = carrinho.find((itemDoCarrinho) => itemDoCarrinho.id === id);
    // verifica se a quantidade é igual a um. Isso significa que este é o último
    // produto do tipo no carrinho
    const ehOUltimo = produto.quantidade === 1;
    // Com o if faz a verificação do último produto do tipo no carrinho e atualiza o estado do carrinho
    if (ehOUltimo) {
      return setCarrinho((carrinhoAnterior) =>
        carrinhoAnterior.filter((itemDoCarrinho) => itemDoCarrinho.id !== id)
      );
    }

    const carrinhoAtualizado = mudarQuantidade(id, -1);

    setCarrinho([...carrinhoAtualizado]);
  }

  function removerProdutoCarrinho(id) {
    const produto = carrinho.filter((itemDoCarrinho) => {
      return itemDoCarrinho.id !== id;
    });
    setCarrinho(produto);
  }

  const { totalTemp, quantidadeTemp } = useMemo(() => {
    return carrinho.reduce(
      (acumulador, produto) => ({
        quantidadeTemp: acumulador.quantidadeTemp + produto.quantidade,
        totalTemp: acumulador.totalTemp + produto.quantidade * produto.preco,
      }),
      { quantidadeTemp: 0, totalTemp: 0 }
    );
  }, [carrinho]);

  useEffect(() => {
    setQuantidade(quantidadeTemp);
    setValorTotal(totalTemp);
  });

  return {
    carrinho,
    setCarrinho,
    adicionarProduto,
    removerProduto,
    removerProdutoCarrinho,
    valorTotal,
    quantidade,
  };
};
