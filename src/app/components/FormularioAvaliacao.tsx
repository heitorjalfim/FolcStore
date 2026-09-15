"use client";

import { useState } from "react";

type FormularioAvaliacaoProps = {
  onEnviar: (avaliacao: { nota: number; comentario: string; data: string }) => void;
};

// TODO: substituir esse mock por um dado real vindo da API/backend
// quando a integração com o banco de dados estiver pronta.
const pedidoSimulado = {
  status: "Entregue",
  jaAvaliado: false,
};

export default function FormularioAvaliacao({ onEnviar }: FormularioAvaliacaoProps) {
  const [comentario, setComentario] = useState("");
  const [nota, setNota] = useState(5);
  const [erro, setErro] = useState("");

  function enviarAvaliacao() {
    // TODO: trocar "pedidoSimulado" pelo pedido real do usuário logado
    // (buscado da API), assim que o backend estiver disponível.
    if (pedidoSimulado.status !== "Entregue") {
      setErro("Você só pode avaliar pedidos que já foram entregues.");
      return;
    }

    if (pedidoSimulado.jaAvaliado) {
      setErro("Esse pedido já foi avaliado.");
      return;
    }

    setErro("");

    const novaAvaliacao = {
      nota: nota,
      comentario: comentario,
      data: new Date().toLocaleDateString("pt-BR"),
    };
    onEnviar(novaAvaliacao);
    setComentario("");
    setNota(5);
  }

  let mensagemErro;
  if (erro !== "") {
    mensagemErro = <p style={{ color: "red" }}>{erro}</p>;
  } else {
    mensagemErro = null;
  }

  return (
    <div>
      {mensagemErro}

      <select value={nota} onChange={(e) => setNota(Number(e.target.value))}>
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
        <option value={4}>4</option>
        <option value={5}>5</option>
      </select>

      <textarea
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        placeholder="Escreva sua avaliação..."
      />

      <button onClick={enviarAvaliacao}>Enviar</button>
    </div>
  );
}