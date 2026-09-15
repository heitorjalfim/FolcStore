"use client";

import AvaliacaoCard from "../components/AvaliacaoCard";

// TODO: substituir esse mock pela lista de avaliações reais desse artesão,
// buscada do backend, quando a API estiver pronta.
export default function PaginaArtesao() {
  const avaliacoes = [
    { nota: 5, comentario: "Peça linda, chegou rápido!", data: "10/09/2026" },
    { nota: 4, comentario: "Muito bonita, só demorou um pouco.", data: "05/09/2026" },
    { nota: 5, comentario: "Superou minhas expectativas.", data: "01/09/2026" },
  ];

  let conteudo;
  if (avaliacoes.length === 0) {
    conteudo = <p>Ainda não há avaliações para esse vendedor.</p>;
  } else {
    const soma = avaliacoes.reduce((total, avaliacao) => total + avaliacao.nota, 0);
    const media = soma / avaliacoes.length;

    conteudo = (
      <div>
        <p>Nota média: {media.toFixed(1)} / 5</p>
        {avaliacoes.map((avaliacao, index) => (
          <AvaliacaoCard key={index} avaliacao={avaliacao} />
        ))}
      </div>
    );
  }

  return (
    <div>
      <h1>Avaliações do artesão</h1>
      {conteudo}
    </div>
  );
}