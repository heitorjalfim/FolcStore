"use client";

import { useState } from "react";
import FormularioAvaliacao from "./components/FormularioAvaliacao";
import ListaAvaliacoes from "./components/ListaAvaliacoes";

type Avaliacao = {
  nota: number;
  comentario: string;
  data: string;
};

export default function Home() {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([
    { nota: 5, comentario: "Peça linda, chegou rápido!", data: "10/09/2026" },
    { nota: 4, comentario: "Muito bonita, só demorou um pouco.", data: "05/09/2026" },
    { nota: 5, comentario: "Superou minhas expectativas.", data: "01/09/2026" },
  ]);

  function adicionarAvaliacao(novaAvaliacao: Avaliacao) {
    setAvaliacoes([...avaliacoes, novaAvaliacao]);
  }

  return (
    <div>
      <h1>Avaliações do produto</h1>
      <ListaAvaliacoes avaliacoes={avaliacoes} />
      <FormularioAvaliacao onEnviar={adicionarAvaliacao} />
    </div>
  );
}
