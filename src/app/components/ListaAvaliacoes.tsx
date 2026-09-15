import AvaliacaoCard from "./AvaliacaoCard";

type Avaliacao = {
  nota: number;
  comentario: string;
  data: string;
};

type ListaAvaliacoesProps = {
  avaliacoes: Avaliacao[];
  mostrarMedia?: boolean;
};

export default function ListaAvaliacoes({ avaliacoes, mostrarMedia }: ListaAvaliacoesProps) {
  if (avaliacoes.length === 0) {
    return <p>Ainda não há avaliações para esse vendedor.</p>;
  }

  let media;
  if (mostrarMedia) {
    const soma = avaliacoes.reduce((total, avaliacao) => total + avaliacao.nota, 0);
    media = <p>Nota média: {(soma / avaliacoes.length).toFixed(1)} / 5</p>;
  } else {
    media = null;
  }

  return (
    <div>
      {media}
      {avaliacoes.map((avaliacao, index) => (
        <AvaliacaoCard key={index} avaliacao={avaliacao} />
      ))}
    </div>
  );
}