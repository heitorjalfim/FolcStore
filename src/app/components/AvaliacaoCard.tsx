

type Avaliacao = {
  nota: number;
  comentario: string;
  data: string;
};

export default function AvaliacaoCard({ avaliacao }: { avaliacao: Avaliacao }) {
  return (
    <div>
      <p>Nota: {avaliacao.nota} / 5</p>
      <p>{avaliacao.comentario}</p>
      <p>{avaliacao.data}</p>
    </div>
  );
}