const fs = require('fs');
const path = require('path');

// 1. Polos e Referências Regionais
const polos = [
  { regiao: 'Alto do Moura (Caruaru)', categoria: 'Decoração' },
  { regiao: 'Tracunhaém', categoria: 'Utilitários' },
  { regiao: 'Bezerros', categoria: 'Quadros e Gravuras' },
  { regiao: 'Pesqueira e Poção', categoria: 'Moda e Acessórios' },
  { regiao: 'Vale do São Francisco (Petrolina)', categoria: 'Esculturas' },
  { regiao: 'Olinda e Zona da Mata', categoria: 'Colecionáveis' },
  { regiao: 'Agreste e Sertão Tradicional', categoria: 'Cama e Mesa' }
];

const nomesBase = [
  'Mestre Vitalino Neto', 'Maria de Tracunhaém', 'J. Borges Filho', 'Dona Dida da Renascença',
  'Severino do Barro', 'Lia de Olinda', 'Mestre Nicola', 'Família Ana das Carrancas',
  'Zé Caboclo Tradição', 'Tereza dos Bonecos', 'Manuel Eudócio Linha', 'Cícero da Xilo',
  'Dona Roxinha', 'Mestre Nuca Leões', 'Luiz Gonzaga do Entalhe', 'Socorro Rendeira',
  'Chico Pintor Naif', 'Marta da Argila', 'Beto das Máscaras', 'Inácio da Madeira',
  'Quitéria Trançados', 'Evaldo Esculturas', 'Fátima do Bordado', 'Tiago da Ribeira',
  'Luzia do Fuxico', 'Antônio de Bezerros', 'Conceição do Maracatu', 'Geraldo do Couro',
  'Graça Cerâmicas', 'Valdir da Xilogravura'
];

// 2. Acervo de Imagens Reais de Artesanato e Artes Visuais (Unsplash)
const galeriaImagens = {
  ceramicaFigurativa: [
    'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1532372576444-dda954194ad0?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1493106641515-59563845097a?auto=format&fit=crop&w=600&q=80'
  ],
  olariaUtilitaria: [
    'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1528892952291-52c73a24a1c2?auto=format&fit=crop&w=600&q=80'
  ],
  xilogravura: [
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80'
  ],
  rendaTextil: [
    'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=600&q=80'
  ],
  madeiraCarranca: [
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1569172122301-bc500f309134?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1554188248-986adbb73be4?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1528129550655-5123a0cd0c4e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1502768040783-423da5fd5fa0?auto=format&fit=crop&w=600&q=80'
  ],
  carnavalFibras: [
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1484589065579-248aad0d8b13?auto=format&fit=crop&w=600&q=80'
  ]
};

// 3. Catálogo Cultural Fenearte: 180 Peças Únicas e Descritivas
const acervoFenearte = [
  // --- ALTO DO MOURA (CARUARU): Cerâmica Figurativa (Itens 1 a 30)
  { t: "Banda de Pífanos Tradicional em Terracota", cat: "Decoração", m: "Argila Queimada", tec: "Modelagem Figurativa", reg: "Alto do Moura (Caruaru)", gal: "ceramicaFigurativa", d: "Conjunto escultural em barro cru retratando os tocadores de pífano tradicionais do Agreste." },
  { t: "Os Retirantes do Sertão em Argila Modelada", cat: "Decoração", m: "Barro Cozido", tec: "Modelagem Manual", reg: "Alto do Moura (Caruaru)", gal: "ceramicaFigurativa", d: "Representação comovente da migração sertaneja inspirada na linhagem de Mestre Vitalino." },
  { t: "Trio Nordestino com Sanfona, Zabumba e Triângulo", cat: "Decoração", m: "Argila Vermelha", tec: "Modelagem Figurativa", reg: "Alto do Moura (Caruaru)", gal: "ceramicaFigurativa", d: "Peça autoral homenageando o tradicional forró pé de serra das noites de São João." },
  { t: "Batalhão de Bacamarteiros em Barro Cozido", cat: "Decoração", m: "Barro Tradicional", tec: "Pintura Mineral", reg: "Alto do Moura (Caruaru)", gal: "ceramicaFigurativa", d: "Homenagem aos atiradores de bacamarte das festividades juninas do Agreste Central." },
  { t: "Casal Sertanejo no Cavalo Selado", cat: "Decoração", m: "Argila Natural", tec: "Modelagem Manual", reg: "Alto do Moura (Caruaru)", gal: "ceramicaFigurativa", d: "Cena clássica do cotidiano rural pernambucano, modelada e seca ao sol." },
  { t: "Vendedora de Macaxeira da Feira de Caruaru", cat: "Decoração", m: "Barro Cru", tec: "Modelagem Popular", reg: "Alto do Moura (Caruaru)", gal: "ceramicaFigurativa", d: "Figura típica da maior feira ao ar livre do mundo, com riqueza de detalhes anatômicos." },
  { t: "O Boi e o Vaqueiro Aboiador em Cerâmica", cat: "Decoração", m: "Argila Escura", tec: "Modelagem Figurativa", reg: "Alto do Moura (Caruaru)", gal: "ceramicaFigurativa", d: "Escultura expressando o canto do aboio e a faina do sertanejo na Caatinga." },
  { t: "Parteira Sertaneja com Recém-Nascido nos Braços", cat: "Decoração", m: "Barro Cozido", tec: "Modelagem Manual", reg: "Alto do Moura (Caruaru)", gal: "ceramicaFigurativa", d: "Símbolo de devoção e solidariedade das comunidades tradicionais do interior." },
  { t: "Roda de Capoeira Regional em Miniatura de Argila", cat: "Decoração", m: "Argila Modelada", tec: "Escultura Popular", reg: "Alto do Moura (Caruaru)", gal: "ceramicaFigurativa", d: "Dinâmica e movimento capturados na terra com os berimbaus e capoeiristas." },
  { t: "O Circo Mambembe do Agreste em Terracota", cat: "Decoração", m: "Barro Queimado", tec: "Modelagem Figurativa", reg: "Alto do Moura (Caruaru)", gal: "ceramicaFigurativa", d: "Palhaços, acrobatas e animais em composição rica e colorida." },
  { t: "Carro de Boi Carregado de Espigas de Milho", cat: "Decoração", m: "Argila e Madeira", tec: "Modelagem Manual", reg: "Alto do Moura (Caruaru)", gal: "ceramicaFigurativa", d: "A colheita junina retratada com juntas de bois emparelhados." },
  { t: "Agricultor com Enxada e Feijão Guandu", cat: "Decoração", m: "Argila Vermelha", tec: "Escultura Rústica", reg: "Alto do Moura (Caruaru)", gal: "ceramicaFigurativa", d: "A labuta da terra traduzida na simplicidade expressiva do barro." },
  { t: "Procissão dos Romeiros do Padre Cícero", cat: "Decoração", m: "Barro Cozido", tec: "Pintura Tradicional", reg: "Alto do Moura (Caruaru)", gal: "ceramicaFigurativa", d: "Fiel reprodução da fé popular com andores e peregrinos do Agreste." },
  { t: "Jogadores de Dominó na Praça Pública", cat: "Decoração", m: "Argila Natural", tec: "Modelagem Figurativa", reg: "Alto do Moura (Caruaru)", gal: "ceramicaFigurativa", d: "O lazer dominical das pequenas cidades retratado em detalhes rústicos." },
  { t: "O Sanfoneiro Cego e seu Guia Menino", cat: "Decoração", m: "Barro Cru", tec: "Modelagem Manual", reg: "Alto do Moura (Caruaru)", gal: "ceramicaFigurativa", d: "Peça poética e histórica sobre a tradição dos músicos itinerantes." },
  { t: "Vaquejada do Sertão: A Pega do Boi no Mato", cat: "Decoração", m: "Barro Queimado", tec: "Modelagem de Ação", reg: "Alto do Moura (Caruaru)", gal: "ceramicaFigurativa", d: "Cena de adrenalina e perícia do vaqueiro encourado entre galhos secos." },
  { t: "Família à Mesa Compartilhando Cuscuz e Café", cat: "Decoração", m: "Argila Vermelha", tec: "Modelagem Afetiva", reg: "Alto do Moura (Caruaru)", gal: "ceramicaFigurativa", d: "Celebração da mesa farta sertaneja com bule e xícaras de barro." },
  { t: "Noivos a Cavalo Rumo à Igreja Matriz", cat: "Decoração", m: "Barro Cozido", tec: "Pintura Manual", reg: "Alto do Moura (Caruaru)", gal: "ceramicaFigurativa", d: "O casamento matuto com a noiva na garupa e flores de laranjeira." },
  { t: "O Caçador e a Onça Pintada da Caatinga", cat: "Decoração", m: "Argila Rústica", tec: "Escultura Popular", reg: "Alto do Moura (Caruaru)", gal: "ceramicaFigurativa", d: "Fábula sertaneja esculpida com traços fortes e expressivos." },
  { t: "Pescador do Rio Ipojuca com Tarrafa Armada", cat: "Decoração", m: "Barro Natural", tec: "Modelagem Manual", reg: "Alto do Moura (Caruaru)", gal: "ceramicaFigurativa", d: "O movimento de arremesso da rede reproduzido com delicadeza na argila." },
  { t: "Mulheres Fiandeiras de Algodão no Tear", cat: "Decoração", m: "Barro Cozido", tec: "Modelagem Histórica", reg: "Alto do Moura (Caruaru)", gal: "ceramicaFigurativa", d: "O ofício ancestral da fiação rural eternizado na cerâmica figurativa." },
  { t: "Ferreiro da Vila Moldando Ferraduras no Fogo", cat: "Decoração", m: "Argila Escura", tec: "Pintura Rústica", reg: "Alto do Moura (Caruaru)", gal: "ceramicaFigurativa", d: "Oficina tradicional de ferreiro com bigorna e fole esculpidos à mão." },
  { t: "Cortejo do Cavalo Marinho com Arlequim e Bastião", cat: "Decoração", m: "Barro Cozido", tec: "Cultura Popular", reg: "Alto do Moura (Caruaru)", gal: "ceramicaFigurativa", d: "Figuras cênicas do auto popular do Cavalo Marinho pernambucano." },
  { t: "Pastoril Religioso: Jornada Encarnada e Azul", cat: "Decoração", m: "Argila Pintada", tec: "Modelagem Figurativa", reg: "Alto do Moura (Caruaru)", gal: "ceramicaFigurativa", d: "Pastorinhas com pandeiros celebrando o ciclo natalino nordestino." },
  { t: "Busto Tradicional em Homenagem a Zé Caboclo", cat: "Decoração", m: "Barro Queimado", tec: "Escultura Autoral", reg: "Alto do Moura (Caruaru)", gal: "ceramicaFigurativa", d: "Tributo aos mestres pioneiros que transformaram o Alto do Moura em polo internacional." },
  { t: "O Enterro na Roça sob o Cruzeiro da Serra", cat: "Decoração", m: "Argila Cinzenta", tec: "Modelagem Solene", reg: "Alto do Moura (Caruaru)", gal: "ceramicaFigurativa", d: "Cena dramática e solene do ciclo de vida no Sertão profundo." },
  { t: "Vendedor de Pirulitos de Vidro com Tabuleiro", cat: "Decoração", m: "Barro Cozido", tec: "Modelagem Popular", reg: "Alto do Moura (Caruaru)", gal: "ceramicaFigurativa", d: "Doçura nostálgica das feiras e praças do interior de Pernambuco." },
  { t: "O Doutor e o Camponês em Diálogo na Venda", cat: "Decoração", m: "Argila Vermelha", tec: "Crítica Social em Barro", reg: "Alto do Moura (Caruaru)", gal: "ceramicaFigurativa", d: "A sátira social tradicional reproduzida com fino humor pelo artesão." },
  { t: "Trio de Forró com Sanfona de Oito Baixos", cat: "Decoração", m: "Barro Queimado", tec: "Modelagem Figurativa", reg: "Alto do Moura (Caruaru)", gal: "ceramicaFigurativa", d: "Instrumento autêntico da tradição de Luiz Gonzaga modelado no barro." },
  { t: "Músicos da Rua da Moeda Tocando Frevo", cat: "Decoração", m: "Barro Cozido", tec: "Modelagem Urbana", reg: "Alto do Moura (Caruaru)", gal: "ceramicaFigurativa", d: "Trompetes e trombones de frevo adaptados à escultura em argila." },

  // --- TRACUNHAÉM: Olaria e Cerâmica Sacra (Itens 31 a 60)
  { t: "Leão de Tracunhaém com Juba Cacheada Mestre Nuca", cat: "Utilitários", m: "Barro Queimado", tec: "Cerâmica Escultórica", reg: "Tracunhaém", gal: "olariaUtilitaria", d: "A mais emblemática obra da Zona da Mata Norte, com os caracóis da juba moldados um a um." },
  { t: "São Francisco das Chagas com Pássaros Silvestres", cat: "Utilitários", m: "Cerâmica Vitrificada", tec: "Escultura Sacra", reg: "Tracunhaém", gal: "olariaUtilitaria", d: "Imagem devocional do protetor da natureza com acabamento polido tradicional." },
  { t: "Santo Antônio Casamenteiro em Barro Cru", cat: "Utilitários", m: "Barro Vermelho", tec: "Modelagem Sacra", reg: "Tracunhaém", gal: "olariaUtilitaria", d: "Peça sacra com o Menino Jesus no colo, esculpida para devoção e decoração." },
  { t: "Santa Luzia Protetora dos Olhos em Argila Vitrificada", cat: "Utilitários", m: "Cerâmica Queimada", tec: "Modelagem Sacra", reg: "Tracunhaém", gal: "olariaUtilitaria", d: "Tradição das santeiras de Tracunhaém expressa em linhas barrocas suaves." },
  { t: "Prato de Parede Floral em Barro Vermelho Queimado", cat: "Utilitários", m: "Argila Esmaltada", tec: "Baixo-Relevo", reg: "Tracunhaém", gal: "olariaUtilitaria", d: "Prato cerâmico decorativo com entalhes de folhas de cana e flores nativas." },
  { t: "Moringa Bojuda de Barro com Copo Protetor", cat: "Utilitários", m: "Argila Porosa", tec: "Olaria Tradicional", reg: "Tracunhaém", gal: "olariaUtilitaria", d: "Mantém a água naturalmente fresca pela transpiração térmica da argila porosa." },
  { t: "Quartinha Cerâmica Tradicional com Alças e Tampa", cat: "Utilitários", m: "Barro Vermelho", tec: "Torno Manual", reg: "Tracunhaém", gal: "olariaUtilitaria", d: "Recipiente litúrgico e decorativo moldado no torno com acabamento acetinado." },
  { t: "Panela de Barro com Tampa Dupla e Alças Reforçadas", cat: "Utilitários", m: "Argila Mineral", tec: "Olaria Refratária", reg: "Tracunhaém", gal: "olariaUtilitaria", d: "Resistente ao fogo direto, ideal para moquecas e cozidos da culinária regional." },
  { t: "Fruteira de Mesa com Borda Rendada em Cerâmica", cat: "Utilitários", m: "Barro Cozido", tec: "Recorte Manual", reg: "Tracunhaém", gal: "olariaUtilitaria", d: "Vazados geométricos que ventilam as frutas e trazem leveza à peça rústica." },
  { t: "Travessa Terracota Oval para Cozidos e Caldos", cat: "Utilitários", m: "Cerâmica Vermelha", tec: "Olaria Utilitária", reg: "Tracunhaém", gal: "olariaUtilitaria", d: "Peça versátil para servir à mesa com rusticidade e elegância rústica." },
  { t: "Vaso Ânfora Colonial com Textura Escovada", cat: "Utilitários", m: "Argila Rústica", tec: "Texturização Manual", reg: "Tracunhaém", gal: "olariaUtilitaria", d: "Inspirado nos recipientes coloniais dos antigos engenhos de açúcar pernambucanos." },
  { t: "Jarra Rústica com Bico Dosador para Sucos Naturais", cat: "Utilitários", m: "Cerâmica Queimada", tec: "Torno Mecânico Manual", reg: "Tracunhaém", gal: "olariaUtilitaria", d: "Beleza funcional para mesas que valorizam o design artesanal brasileiro." },
  { t: "Candelabro Triplo Barroco em Barro Esmaltado", cat: "Utilitários", m: "Argila Vitrificada", tec: "Modelagem Manual", reg: "Tracunhaém", gal: "olariaUtilitaria", d: "Peça imponente para três velas, perfeita para iluminar ambientes coloniais." },
  { t: "Leão Alado Guardião em Terracota Tracunhaense", cat: "Utilitários", m: "Barro Cozido", tec: "Escultura Cerâmica", reg: "Tracunhaém", gal: "olariaUtilitaria", d: "Variação heráldica do tradicional leão de Nuca, símbolo de proteção do lar." },
  { t: "Pote Bojudo com Tampa e Pintura Mineral Geométrica", cat: "Utilitários", m: "Argila Porosa", tec: "Pintura a Frio", reg: "Tracunhaém", gal: "olariaUtilitaria", d: "Guarda mantimentos com estilo e homenageia a cerâmica pré-cabralina." },
  { t: "Baleiro de Balcão em Cerâmica com Enfeite de Pássaro", cat: "Utilitários", m: "Barro Vermelho", tec: "Modelagem Fina", reg: "Tracunhaém", gal: "olariaUtilitaria", d: "Tampa adornada com sabiá do canavial, delicadeza para bancadas." },
  { t: "Centro de Mesa Folha de Bananeira em Cerâmica", cat: "Utilitários", m: "Argila Esmaltada", tec: "Moldagem Direta", reg: "Tracunhaém", gal: "olariaUtilitaria", d: "Molde feito com folhas reais da Zona da Mata revelando nervuras perfeitas." },
  { t: "Vaso de Parede com Motivos do Canavial", cat: "Utilitários", m: "Barro Queimado", tec: "Baixo-Relevo", reg: "Tracunhaém", gal: "olariaUtilitaria", d: "Arandela decorativa para folhagens pendentes como samambaias e jiboias." },
  { t: "São Jorge Guerreiro Montado em Cavalo Branco", cat: "Utilitários", m: "Argila Policromada", tec: "Modelagem Sacra", reg: "Tracunhaém", gal: "olariaUtilitaria", d: "O dragão vencido pela lança de Jorge em peça de forte sincretismo religioso." },
  { t: "Nossa Senhora da Conceição Padroeira do Morro", cat: "Utilitários", m: "Cerâmica Vitrificada", tec: "Escultura Religiosa", reg: "Tracunhaém", gal: "olariaUtilitaria", d: "Manto azul fluído com acabamento polido de alta sofisticação cerâmica." },
  { t: "Tigela Bowl Rústica para Ensopados e Cuscuz", cat: "Utilitários", m: "Barro Queimado", tec: "Olaria de Mesa", reg: "Tracunhaém", gal: "olariaUtilitaria", d: "Conserva o calor da comida nordestina por muito mais tempo." },
  { t: "Moringa Dupla Namoradeira com Dois Copos", cat: "Utilitários", m: "Argila Natural", tec: "Torno Manual", reg: "Tracunhaém", gal: "olariaUtilitaria", d: "Design tradicional para cabeceira de casal em noites quentes." },
  { t: "Anjo Querubim em Relevo com Asas Espalmadas", cat: "Utilitários", m: "Barro Vermelho", tec: "Aplique de Parede", reg: "Tracunhaém", gal: "olariaUtilitaria", d: "Inspiração nas igrejas barrocas de Olinda e Igarassu para compor altares." },
  { t: "Cumbuca para Caldinho de Feijão Preto com Alça", cat: "Utilitários", m: "Cerâmica Rústica", tec: "Olaria de Boteco", reg: "Tracunhaém", gal: "olariaUtilitaria", d: "Típica dos bares pernambucanos, perfeita para petiscos à beira-mar." },
  { t: "Escultura Beija-Flor Sugando Flor de Hibisco", cat: "Utilitários", m: "Argila Esmaltada", tec: "Modelagem Delicada", reg: "Tracunhaém", gal: "olariaUtilitaria", d: "Peça decorativa para jardins de inverno e varandas coloniais." },
  { t: "Busto de Caboclo Velho em Barro Queimado", cat: "Utilitários", m: "Barro Escuro", tec: "Escultura Expressiva", reg: "Tracunhaém", gal: "olariaUtilitaria", d: "Rugas e feições marcadas pelo sol implacável da colheita da cana-de-açúcar." },
  { t: "Vaso Bojudo com Acabamento em Argila Branca", cat: "Utilitários", m: "Argila Mista", tec: "Engobe Natural", reg: "Tracunhaém", gal: "olariaUtilitaria", d: "Técnica milenar de engobe sem adição de esmaltes químicos industriais." },
  { t: "Placa Decorativa com Oração de São Francisco", cat: "Utilitários", m: "Barro em Relevo", tec: "Tipografia Artesanal", reg: "Tracunhaém", gal: "olariaUtilitaria", d: "Letras modeladas à mão e queimadas em forno a lenha tradicional." },
  { t: "Floreira Suspensa com Correntes de Sisal", cat: "Utilitários", m: "Argila e Fibras", tec: "Olaria Suspensa", reg: "Tracunhaém", gal: "olariaUtilitaria", d: "Une a rusticidade do barro vermelho com a sustentabilidade do sisal." },
  { t: "Leoa com Três Filhotes em Repouso no Barro", cat: "Utilitários", m: "Barro Vermelho", tec: "Modelagem Coletiva", reg: "Tracunhaém", gal: "olariaUtilitaria", d: "A ternura maternal da fauna retratada na olaria clássica de Tracunhaém." },

  // --- BEZERROS: Xilogravura e Cordel (Itens 61 a 90)
  { t: "Matriz de Xilogravura: O Pavão Misterioso", cat: "Quadros e Gravuras", m: "Madeira Umburana", tec: "Entalhe em Matriz", reg: "Bezerros", gal: "xilogravura", d: "Matriz original esculpida na madeira pelo herdeiro do mestre J. Borges." },
  { t: "Xilogravura Original: A Chegada de Lampião no Inferno", cat: "Quadros e Gravuras", m: "Tinta Gráfica e Papel", tec: "Impressão Manual", reg: "Bezerros", gal: "xilogravura", d: "Estampa lendária do cordel brasileiro tirada à mão na prensa de rolo." },
  { t: "Estampa em Madeira: O Monstro das Sete Cabeças", cat: "Quadros e Gravuras", m: "Papel Kraft Especial", tec: "Xilogravura Autoral", reg: "Bezerros", gal: "xilogravura", d: "Imaginação fantástica do Agreste com criaturas do imaginário popular." },
  { t: "Painel Xilográfico: O Casamento da Donzela com o Diabo", cat: "Quadros e Gravuras", m: "Papel Canson 200g", tec: "Impressão Tipográfica", reg: "Bezerros", gal: "xilogravura", d: "Clássico da literatura de cordel com sátira e moralidade do Sertão." },
  { t: "Xilogravura Polifônica: A Grande Feira de Caruaru", cat: "Quadros e Gravuras", m: "Tintas Policromáticas", tec: "Xilo em Cores", reg: "Bezerros", gal: "xilogravura", d: "Três matrizes sobrepostas criando uma cena colorida e vibrante da feira." },
  { t: "Gravura em Matriz: A Dança dos Caboclos na Mata", cat: "Quadros e Gravuras", m: "Papel Algodão Puro", tec: "Entalhe Fino", reg: "Bezerros", gal: "xilogravura", d: "Força espiritual dos povos originários e dos caboclinhos da Zona da Mata." },
  { t: "Xilo Tradicional: O Romance do Pavão com a Onça", cat: "Quadros e Gravuras", m: "Madeira e Tinta Preta", tec: "Xilogravura Popular", reg: "Bezerros", gal: "xilogravura", d: "Fábula nordestina sobre astúcia, coragem e o amor impossível." },
  { t: "Coleção com 3 Folhetos de Cordel com Xilo Autêntica", cat: "Quadros e Gravuras", m: "Papel Jornal Rústico", tec: "Tipografia Manual", reg: "Bezerros", gal: "xilogravura", d: "Cordéis rimados em sextilhas e septilhas com xilogravuras de capa exclusivas." },
  { t: "Gravura em Papel Kraft: O Vaqueiro e o Boi Misterioso", cat: "Quadros e Gravuras", m: "Papel Kraft Envelhecido", tec: "Impressão a Frio", reg: "Bezerros", gal: "xilogravura", d: "A lenda do boi encantado que desafiava os maiores coronéis do Sertão." },
  { t: "Xilogravura em Madeira: O Sol e a Asa Branca", cat: "Quadros e Gravuras", m: "Papel Fibra de Arroz", tec: "Xilogravura Lírica", reg: "Bezerros", gal: "xilogravura", d: "A partida da ave migratória sob o sol inclemente cantada por Gonzagão." },
  { t: "Matriz Entalhada: Lampião e Maria Bonita no Cangaço", cat: "Quadros e Gravuras", m: "Prancha de Cedro", tec: "Escultura em Matriz", reg: "Bezerros", gal: "xilogravura", d: "Prancha de matriz pronta para impressão ou para decoração direta na parede." },
  { t: "Xilo Tradicional: O Sanfoneiro e o Baile na Roça", cat: "Quadros e Gravuras", m: "Papel Gravura 180g", tec: "Impressão Tradicional", reg: "Bezerros", gal: "xilogravura", d: "Casais dançando coladinhos ao redor da fogueira de São Pedro." },
  { t: "Painel em Xilogravura: Os Bichos Encantados do Agreste", cat: "Quadros e Gravuras", m: "Papel Algodão Francês", tec: "Série Numerada", reg: "Bezerros", gal: "xilogravura", d: "Tatu, tejo, cascavel e coruja compondo um bestiário mágico pernambucano." },
  { t: "Estampa Artística: A Chegada da Chuva no Semiárido", cat: "Quadros e Gravuras", m: "Papel Monotipo", tec: "Xilogravura Monocromática", reg: "Bezerros", gal: "xilogravura", d: "A esperança renovada com as nuvens carregadas sobre a vegetação cinzenta." },
  { t: "Xilogravura Coletiva: O Cortejo do Bicho da Fortaleza", cat: "Quadros e Gravuras", m: "Papel Kraft Nobre", tec: "Impressão Manual", reg: "Bezerros", gal: "xilogravura", d: "Folclore de Bezerros retratando os personagens misteriosos das serras." },
  { t: "Gravura em Madeira Nobre: O Pescador e a Iara do Rio", cat: "Quadros e Gravuras", m: "Papel Vergê Artesanal", tec: "Entalhe em Umburana", reg: "Bezerros", gal: "xilogravura", d: "O canto da sereia das águas doces seduzindo a canoa do pescador." },
  { t: "Xilo Colorida: Festa de São João com Balão e Fogueira", cat: "Quadros e Gravuras", m: "Tintas Especiais", tec: "Policromia Nordestina", reg: "Bezerros", gal: "xilogravura", d: "Cores primárias vibrantes celebrando a alegria do ciclo junino." },
  { t: "Matriz de Xilogravura: O Diabo Coxo no Sertão", cat: "Quadros e Gravuras", m: "Madeira Entalhada", tec: "Escultura Gráfica", reg: "Bezerros", gal: "xilogravura", d: "Figura picaresca dos contos populares que desafia a inteligência dos matutos." },
  { t: "Xilogravura Rústica: Os Aboiadores da Serra Negra", cat: "Quadros e Gravuras", m: "Papel Kraft Rústico", tec: "Impressão Monotípica", reg: "Bezerros", gal: "xilogravura", d: "Dois vaqueiros no cume da serra entoando o canto ancestral do gado." },
  { t: "Gravura em Papel Algodão: O Galo Cantor da Alvorada", cat: "Quadros e Gravuras", m: "Papel Artesanal 250g", tec: "Tiragem Limitada", reg: "Bezerros", gal: "xilogravura", d: "O despertar matinal da roça representado pelo galo de crista altiva." },
  { t: "Matriz Entalhada: Padre Cícero Abençoando os Romeiros", cat: "Quadros e Gravuras", m: "Prancha de Madeira", tec: "Entalhe em Baixo-Relevo", reg: "Bezerros", gal: "xilogravura", d: "Fé profunda do homem do campo talhada com goiva em madeira maciça." },
  { t: "Xilo Monocromática: A Procissão das Almas Penadas", cat: "Quadros e Gravuras", m: "Papel Cartão Rústico", tec: "Contraste Preto e Branco", reg: "Bezerros", gal: "xilogravura", d: "Mistério das noites escuras de quaresma nas estradas de terra batida." },
  { t: "Gravura Popular: O Boi Tatá e o Fogo Fátuo", cat: "Quadros e Gravuras", m: "Papel Gravado", tec: "Impressão Manual", reg: "Bezerros", gal: "xilogravura", d: "A serpente de fogo protegendo os campos contra invasores da mata." },
  { t: "Painel Xilográfico: Dança do Maracatu de Baque Solto", cat: "Quadros e Gravuras", m: "Papel Canson", tec: "Xilo com Textura", reg: "Bezerros", gal: "xilogravura", d: "A lança do caboclo cruzando a gravura em corte seco e dramático." },
  { t: "Xilogravura: O Cangaceiro Corisco e Dadá", cat: "Quadros e Gravuras", m: "Papel Envelhecido", tec: "Xilo Histórica", reg: "Bezerros", gal: "xilogravura", d: "Trajes bordados com moedas e estrelas estilizados na matriz de madeira." },
  { t: "Gravura em Umburana: O Voo da Arara Vermelha", cat: "Quadros e Gravuras", m: "Tinta Gráfica", tec: "Entalhe Orgânico", reg: "Bezerros", gal: "xilogravura", d: "As asas abertas da ave sertaneja cobrindo a serra com elegância." },
  { t: "Matriz de Xilogravura: A Mulher Que Virou Cachorra", cat: "Quadros e Gravuras", m: "Madeira Umburana", tec: "Conto Fantástico", reg: "Bezerros", gal: "xilogravura", d: "História de assombração sertaneja contada pelos velhos contadores de causos." },
  { t: "Xilo Tradicional: A Feira de Bezerros nos Dias de Festa", cat: "Quadros e Gravuras", m: "Papel Kraft", tec: "Impressão Coletiva", reg: "Bezerros", gal: "xilogravura", d: "Movimento dos feirantes vendendo queijo de coalho, fumo de rolo e chapéus." },
  { t: "Gravura em Matriz Rústica: O Monstro do Olho de Fogo", cat: "Quadros e Gravuras", m: "Papel Algodão", tec: "Xilogravura Rara", reg: "Bezerros", gal: "xilogravura", d: "Lenda transmitida oralmente entre as gerações da Serra do Giz." },
  { t: "Xilogravura Autoral: As Três Graças da Caatinga", cat: "Quadros e Gravuras", m: "Papel Vergê 220g", tec: "Arte Contemporânea", reg: "Bezerros", gal: "xilogravura", d: "Três mulheres sertanejas carregando potes de água na cabeça com dignidade." },

  // --- PESQUEIRA E POÇÃO: Renda Renascença e Moda (Itens 91 a 120)
  { t: "Caminho de Mesa em Renda Renascença Ponto Abacaxi", cat: "Moda e Acessórios", m: "Linha de Algodão", tec: "Renda Renascença", reg: "Pesqueira e Poção", gal: "rendaTextil", d: "Trabalho manual paciente que consome semanas de dedicação das artesãs do Agreste." },
  { t: "Gola Avulsa em Ponto Palito e Ponto Cocada", cat: "Moda e Acessórios", m: "Linha Pura 100%", tec: "Renascença Fina", reg: "Pesqueira e Poção", gal: "rendaTextil", d: "Acessório versátil para vestidos e camisas que resgata a elegância atemporal." },
  { t: "Toalha de Lavabo com Barrado em Renascença Pura", cat: "Moda e Acessórios", m: "Linho e Algodão", tec: "Bordado e Renda", reg: "Pesqueira e Poção", gal: "rendaTextil", d: "Toalha de puro linho encorpado finalizada com bico nobre de renda renascença." },
  { t: "Xale Triangular em Fio de Algodão Cru Artesanal", cat: "Moda e Acessórios", m: "Fio Orgânico", tec: "Ponto Traça e Pipoca", reg: "Pesqueira e Poção", gal: "rendaTextil", d: "Conforto e sofisticação para noites amenas no planalto da Borborema." },
  { t: "Centro de Mesa Redondo em Ponto Aranha", cat: "Moda e Acessórios", m: "Linha Especial Mercerizada", tec: "Padrão Circular", reg: "Pesqueira e Poção", gal: "rendaTextil", d: "Trama circular intrincada inspirada nas teias de aranha da serra." },
  { t: "Blusa Autoral em Renda Renascença Branca Feita à Mão", cat: "Moda e Acessórios", m: "Linha 100% Algodão", tec: "Alta Costura Manual", reg: "Pesqueira e Poção", gal: "rendaTextil", d: "Peça de vestuário nobre desfilada nas passarelas da Fenearte com acabamento impecável." },
  { t: "Jogo Americano Quádruplo em Linho e Renda", cat: "Moda e Acessórios", m: "Linho Rústico e Lacê", tec: "Montagem em Almofada", reg: "Pesqueira e Poção", gal: "rendaTextil", d: "Composto por 4 lugares americanos de alta durabilidade e requinte." },
  { t: "Porta-Copos Rendados em Ponto Pipoca (Conjunto com 6)", cat: "Moda e Acessórios", m: "Linha Branca Fina", tec: "Renascença Clássica", reg: "Pesqueira e Poção", gal: "rendaTextil", d: "Delicadeza para compor cafés da tarde e ocasiões especiais." },
  { t: "Toalha de Bandeja em Cambraia com Renda Periférica", cat: "Moda e Acessórios", m: "Cambraia de Linho", tec: "Ponto Palito", reg: "Pesqueira e Poção", gal: "rendaTextil", d: "Design clássico do Nordeste colonial para servir visitantes com requinte." },
  { t: "Almofada Rendada em Richelieu e Renascença Delicada", cat: "Moda e Acessórios", m: "Algodão e Enchimento", tec: "Bordado Misto", reg: "Pesqueira e Poção", gal: "rendaTextil", d: "Enchimento antialérgico envolto por uma capa rendada totalmente manual." },
  { t: "Marcador de Página Rendado com Fita de Cetim", cat: "Moda e Acessórios", m: "Linha Fina e Cetim", tec: "Ponto Aranha Miniatura", reg: "Pesqueira e Poção", gal: "rendaTextil", d: "Mimo refinado para apreciadores de literatura e objetos delicados." },
  { t: "Tiara Artesanal Revestida em Renda Renascença", cat: "Moda e Acessórios", m: "Aro Metálico e Renda", tec: "Revestimento Manual", reg: "Pesqueira e Poção", gal: "rendaTextil", d: "Acessório para noivas e eventos formais que valorizam o feito à mão." },
  { t: "Guardanapo de Linho Puro com Bico em Ponto Crivo", cat: "Moda e Acessórios", m: "Linho Europeu", tec: "Ponto Crivo e Palito", reg: "Pesqueira e Poção", gal: "rendaTextil", d: "Desfiado manual do tecido que cria desenhos geométricos vazados." },
  { t: "Caminho de Mesa Floral em Renascença Bege Natural", cat: "Moda e Acessórios", m: "Algodão Cru", tec: "Padrão Botânico", reg: "Pesqueira e Poção", gal: "rendaTextil", d: "Tons terrosos e naturais que combinam com mesas de madeira maciça." },
  { t: "Véu Curto Bordado Manualmente com Flores Renascença", cat: "Moda e Acessórios", m: "Tule Francês e Lacê", tec: "Bordado sobre Tule", reg: "Pesqueira e Poção", gal: "rendaTextil", d: "Sonho de noivas contemporâneas com raiz no artesanato pernambucano." },
  { t: "Lenço de Bolso em Cambraia e Renda Renascença", cat: "Moda e Acessórios", m: "Fio de Seda e Linho", tec: "Acabamento Manual", reg: "Pesqueira e Poção", gal: "rendaTextil", d: "Sutileza e tradição que atravessam gerações de famílias rendadas." },
  { t: "Manta para Bebê com Barra em Renda e Ponto Pipoca", cat: "Moda e Acessórios", m: "Algodão Pima Macio", tec: "Renascença Suave", reg: "Pesqueira e Poção", gal: "rendaTextil", d: "Toque extremamente macio para proteger a pele sensível dos recém-nascidos." },
  { t: "Painel Têxtil de Parede com Tramas de Renda", cat: "Moda e Acessórios", m: "Linha e Galho de Madeira", tec: "Tapeçaria e Renda", reg: "Pesqueira e Poção", gal: "rendaTextil", d: "Arte contemporânea suspensa em galho de goiabeira da serra de Pesqueira." },
  { t: "Capa de Almofada em Ponto Cocada com Fecho Oculto", cat: "Moda e Acessórios", m: "Linho e Lacê", tec: "Trabalho em Almofada", reg: "Pesqueira e Poção", gal: "rendaTextil", d: "Geometria perfeita construída com agulha e dedal em dias de fiação." },
  { t: "Colete Curto Autoral em Renda Renascença Preta", cat: "Moda e Acessórios", m: "Linha Preta Mercerizada", tec: "Alfaiataria Rendada", reg: "Pesqueira e Poção", gal: "rendaTextil", d: "Design de vanguarda que une a tradição sertaneja à moda urbana." },
  { t: "Pano de Copa com Barrado Amplo em Ponto Pipoca", cat: "Moda e Acessórios", m: "Algodão de Alta Absorção", tec: "Ponto Vazado", reg: "Pesqueira e Poção", gal: "rendaTextil", d: "Traz a atmosfera acolhedora das cozinhas coloniais pernambucanas." },
  { t: "Saia Evasê com Detalhes Geométricos em Renascença", cat: "Moda e Acessórios", m: "Linha Pura e Forro", tec: "Montagem Têxtil", reg: "Pesqueira e Poção", gal: "rendaTextil", d: "Peça autoral com caimento fluido e acabamento minucioso." },
  { t: "Faixa de Cabelo Boho Chic em Renda e Linho", cat: "Moda e Acessórios", m: "Elástico e Algodão", tec: "Renda Elástica", reg: "Pesqueira e Poção", gal: "rendaTextil", d: "Praticidade e elegância para os dias quentes do litoral ou agreste." },
  { t: "Toalha de Mesa Nobre Quadrada para 8 Lugares", cat: "Moda e Acessórios", m: "Linho Puro e Renda", tec: "Composição Imperial", reg: "Pesqueira e Poção", gal: "rendaTextil", d: "Uma obra-prima da tecelagem manual que pode ser guardada por séculos." },
  { t: "Colar Têxtil com Rosáceas de Renda Renascença", cat: "Moda e Acessórios", m: "Linha e Fecho Banhado", tec: "Biojoia Têxtil", reg: "Pesqueira e Poção", gal: "rendaTextil", d: "Joia artesanal leve e impactante para destacar qualquer produção." },
  { t: "Luvas Curtas sem Dedos em Renda Renascença Fina", cat: "Moda e Acessórios", m: "Linha Especial", tec: "Trama Anatômica", reg: "Pesqueira e Poção", gal: "rendaTextil", d: "Estilo vintage e romântico confeccionado em ponto aranha delicado." },
  { t: "Centro de Mesa Oval com Motivos de Folhagem da Serra", cat: "Moda e Acessórios", m: "Linha Crua", tec: "Ponto Folha", reg: "Pesqueira e Poção", gal: "rendaTextil", d: "Curvas inspiradas nas bromélias do Parque Nacional do Catimbau." },
  { t: "Máscara Têxtil de Coleção com Aplicações de Renda", cat: "Moda e Acessórios", m: "Tecido Duplo e Lacê", tec: "Costura de Precisão", reg: "Pesqueira e Poção", gal: "rendaTextil", d: "Item decorativo e comemorativo que valoriza o ofício das rendeiras." },
  { t: "Xale Retangular com Franjas em Fio de Seda Nordestina", cat: "Moda e Acessórios", m: "Seda e Algodão", tec: "Ponto Rendado Suave", reg: "Pesqueira e Poção", gal: "rendaTextil", d: "Brilho acetinado e fluidez incomparável para eventos festivos." },
  { t: "Conjunto com 6 Porta-Guardanapos Rendados com Aro de Madeira", cat: "Moda e Acessórios", m: "Madeira e Linha", tec: "Artesanato Combinado", reg: "Pesqueira e Poção", gal: "rendaTextil", d: "O encontro harmonioso da madeira torneada com a delicadeza da renda." },

  // --- VALE DO SÃO FRANCISCO: Carrancas e Madeiras (Itens 121 a 150)
  { t: "Carranca Tradicional do Velho Chico com Juba Flamejante", cat: "Esculturas", m: "Madeira Umburana", tec: "Entalhe Manual", reg: "Vale do São Francisco (Petrolina)", gal: "madeiraCarranca", d: "Expressão feroz talhada pelos mestres carranqueiros para afugentar os maus espíritos do rio." },
  { t: "Carranca Cerâmica com Olhos Vazados estilo Ana das Carrancas", cat: "Esculturas", m: "Argila Ribeirinha", tec: "Modelagem Cega", reg: "Vale do São Francisco (Petrolina)", gal: "madeiraCarranca", d: "Homenagem à grande mestra de Petrolina, com os olhos vazados simbolizando os cegos do sertão." },
  { t: "Carranca de Proa Pequena para Parede em Madeira Maciça", cat: "Esculturas", m: "Tronco de Jatobá", tec: "Entalhe com Formão", reg: "Vale do São Francisco (Petrolina)", gal: "madeiraCarranca", d: "Réplica das antigas esculturas fixadas nas barcaças de madeira que singravam o São Francisco." },
  { t: "Escultura Passista de Frevo com Sombrinha em Cedro", cat: "Esculturas", m: "Madeira de Cedro", tec: "Escultura Tridimensional", reg: "Vale do São Francisco (Petrolina)", gal: "madeiraCarranca", d: "Passo tesoura e dobradiça congelados na beleza das fibras douradas do cedro." },
  { t: "Totem Protetor das Águas em Tronco Reaproveitado", cat: "Esculturas", m: "Madeira Fluvial", tec: "Escultura Orgânica", reg: "Vale do São Francisco (Petrolina)", gal: "madeiraCarranca", d: "Madeira resgatada do leito do rio, trabalhada respeitando suas formas e curvas naturais." },
  { t: "Busto de Caboclo D'Água Entalhado em Umburana de Cheiro", cat: "Esculturas", m: "Umburana Aromática", tec: "Entalhe Mitológico", reg: "Vale do São Francisco (Petrolina)", gal: "madeiraCarranca", d: "Figura lendária do folclore são-franciscano que vira barcos e assusta pescadores." },
  { t: "Peixe Surubim do Rio São Francisco Esculpido em Madeira", cat: "Esculturas", m: "Madeira Nobre", tec: "Escultura Ictiológica", reg: "Vale do São Francisco (Petrolina)", gal: "madeiraCarranca", d: "Peixe gigante das águas doces esculpido com escamas detalhadas e pintura rústica." },
  { t: "Painel em Alto-Relevo: A Barcaça no Vapor do Rio", cat: "Esculturas", m: "Prancha de Peroba", tec: "Entalhe em Painel", reg: "Vale do São Francisco (Petrolina)", gal: "madeiraCarranca", d: "O vapor Benjamim Guimarães navegando com passageiros e mercadorias pelo Velho Chico." },
  { t: "Carranca de Parede com Dentes Pontiagudos e Língua Vermelha", cat: "Esculturas", m: "Madeira e Pigmentos", tec: "Pintura Tradicional", reg: "Vale do São Francisco (Petrolina)", gal: "madeiraCarranca", d: "Cores primárias fortes que intensificam a expressão protetora na entrada da casa." },
  { t: "Caboclo de Lança e a Flor de Cravo em Madeira Esculpida", cat: "Esculturas", m: "Madeira Maciça", tec: "Entalhe Folclórico", reg: "Vale do São Francisco (Petrolina)", gal: "madeiraCarranca", d: "A imponência guerreira do maracatu traduzida na solidez da madeira pernambucana." },
  { t: "Pássaro Ribeirinho Esculpido em Raiz de Jaqueira", cat: "Esculturas", m: "Raiz Nativa", tec: "Escultura em Raiz", reg: "Vale do São Francisco (Petrolina)", gal: "madeiraCarranca", d: "O formato original da raiz sugere as penas e asas do martim-pescador das margens do rio." },
  { t: "Busto de Maria Bonita com Chapéu Estrelado", cat: "Esculturas", m: "Madeira de Lei", tec: "Escultura Histórica", reg: "Vale do São Francisco (Petrolina)", gal: "madeiraCarranca", d: "A bravura da rainha do Cangaço talhada com firmeza e detalhes de jóias sertanejas." },
  { t: "Onça Pintada do Sertão em Tronco de Umburana", cat: "Esculturas", m: "Madeira e Fogo", tec: "Pirografia e Entalhe", reg: "Vale do São Francisco (Petrolina)", gal: "madeiraCarranca", d: "Manchas do couro obtidas com a queima controlada da madeira com ferro em brasa." },
  { t: "São Pedro Pescador com Rede de Pesca em Madeira e Sisal", cat: "Esculturas", m: "Cedro e Corda", tec: "Arte Sacra Ribeirinha", reg: "Vale do São Francisco (Petrolina)", gal: "madeiraCarranca", d: "O santo padroeiro dos barqueiros e pescadores de Petrolina e Juazeiro." },
  { t: "Carranca Miniatura Colecionável com Base de Granito", cat: "Esculturas", m: "Madeira e Pedra", tec: "Escultura em Miniatura", reg: "Vale do São Francisco (Petrolina)", gal: "madeiraCarranca", d: "Perfeita para mesas de escritório e estantes, trazendo o simbolismo da proteção." },
  { t: "Escultura Abstrata: O Vento na Caatinga", cat: "Esculturas", m: "Madeira Retorcida", tec: "Arte Contemporânea", reg: "Vale do São Francisco (Petrolina)", gal: "madeiraCarranca", d: "Curvas dinâmicas que homenageiam a resistência da flora semiárida brasileira." },
  { t: "Anjo Protetor dos Navegantes em Madeira Policromada", cat: "Esculturas", m: "Madeira e Tinta Acrílica", tec: "Barroco Ribeirinho", reg: "Vale do São Francisco (Petrolina)", gal: "madeiraCarranca", d: "Estilo herdado dos artífices que decoravam as capelas ao longo do rio." },
  { t: "Barqueiro Remando sob o Sol Poente em Madeira", cat: "Esculturas", m: "Madeira Escura", tec: "Escultura de Silhueta", reg: "Vale do São Francisco (Petrolina)", gal: "madeiraCarranca", d: "A solidão pacífica do trabalhador das águas retratada em linhas puras." },
  { t: "Carranca Leão Alado com Chifres em Madeira Rústica", cat: "Esculturas", m: "Tronco de Angico", tec: "Entalhe Primitivo", reg: "Vale do São Francisco (Petrolina)", gal: "madeiraCarranca", d: "Mistura sincrética da fera terrestre com mitos aquáticos das lendas do rio." },
  { t: "Painel em Baixo-Relevo: Fauna e Mandacaru", cat: "Esculturas", m: "Prancha de Sucupira", tec: "Escultura de Parede", reg: "Vale do São Francisco (Petrolina)", gal: "madeiraCarranca", d: "Tatupeba, asa branca e o mandacaru florido gravados na madeira maciça." },
  { t: "Peixe Dourado Saltando com Escamas em Pirografia", cat: "Esculturas", m: "Madeira de Pinheiro Bravo", tec: "Pirogravura", reg: "Vale do São Francisco (Petrolina)", gal: "madeiraCarranca", d: "O vigor do peixe mais veloz das corredeiras do submédio São Francisco." },
  { t: "Figura Alada dos Pescadores em Tronco Maciço", cat: "Esculturas", m: "Tronco Inteiriço", tec: "Entalhe Monumental", reg: "Vale do São Francisco (Petrolina)", gal: "madeiraCarranca", d: "Obra de destaque visual para halls e salas amplas, esculpida a machado e formão." },
  { t: "São Francisco Ecológico com Frutos e Pássaros da Caatinga", cat: "Esculturas", m: "Madeira Polida", tec: "Escultura Figurativa", reg: "Vale do São Francisco (Petrolina)", gal: "madeiraCarranca", d: "Umbu, juá e mandacaru aos pés do santo protetor de toda a criação." },
  { t: "Busto de Luiz Gonzaga com Sanfona no Peito", cat: "Esculturas", m: "Madeira de Lei", tec: "Retrato Escultórico", reg: "Vale do São Francisco (Petrolina)", gal: "madeiraCarranca", d: "O Rei do Baião esculpido com o clássico chapéu de couro de abas viradas." },
  { t: "Bicho Folclórico da Mata Ribeirinha em Galho Rústico", cat: "Esculturas", m: "Galhos Secos", tec: "Bioarte", reg: "Vale do São Francisco (Petrolina)", gal: "madeiraCarranca", d: "Criatura misteriosa montada aproveitando nós e bifurcações naturais da árvore." },
  { t: "Carranca com Coroa Real em Madeira Entalhada e Dourada", cat: "Esculturas", m: "Madeira e Folha de Ouro", tec: "Acabamento Nobre", reg: "Vale do São Francisco (Petrolina)", gal: "madeiraCarranca", d: "A união da arte popular dos ribeirinhos com detalhes refinados de douramento." },
  { t: "Totem Guerreiro Fulni-ô em Madeira Escavada", cat: "Esculturas", m: "Tronco Rústico", tec: "Grafismo Indígena", reg: "Vale do São Francisco (Petrolina)", gal: "madeiraCarranca", d: "Inspirado na memória ancestral dos povos originários das margens do Velho Chico." },
  { t: "Vaqueiro Montado a Galope em Cavalo Sertanejo", cat: "Esculturas", m: "Madeira de Cedro", tec: "Escultura Dinâmica", reg: "Vale do São Francisco (Petrolina)", gal: "madeiraCarranca", d: "A velocidade e o equilíbrio do encourado descritos em madeira maciça polida." },
  { t: "Painel Geométrico Esculpido em Madeira de Demolição", cat: "Esculturas", m: "Madeira Reciclada", tec: "Mosaico em Relevo", reg: "Vale do São Francisco (Petrolina)", gal: "madeiraCarranca", d: "Sustentabilidade e sofisticação unidas em tábuas de antigas casas de taipa." },
  { t: "Máscara de Madeira Rústica do Bicho do Rio com Fibras", cat: "Esculturas", m: "Madeira e Palha de Buriti", tec: "Máscara Tradicional", reg: "Vale do São Francisco (Petrolina)", gal: "madeiraCarranca", d: "Utilizada nas comemorações ribeirinhas de agradecimento pelas cheias do rio." },

  // --- CARNAVAL, MARACATU E COURO: Olinda, Nazaré da Mata, Triunfo (Itens 151 a 180)
  { t: "Gola de Caboclo de Lança Bordada em Vidrilhos e Lantejoulas", cat: "Colecionáveis", m: "Veludo, Vidrilho e Paetê", tec: "Bordado de Maracatu", reg: "Olinda e Zona da Mata", gal: "carnavalFibras", d: "A joia do Maracatu Rural de Nazaré da Mata pesando mais de 10kg de brilho e história." },
  { t: "Réplica em Miniatura do Homem da Meia-Noite de Olinda", cat: "Colecionáveis", m: "Papel Machê e Tecido", tec: "Boneco Gigante Mini", reg: "Olinda e Zona da Mata", gal: "carnavalFibras", d: "O calunga mais famoso do Carnaval de Pernambuco com seu fraque verde e cartola preta." },
  { t: "Máscara dos Caretas de Triunfo Pintada a Óleo", cat: "Colecionáveis", m: "Papel Machê e Chita", tec: "Pintura Manual", reg: "Olinda e Zona da Mata", gal: "carnavalFibras", d: "Tradição carnavalesca do Sertão do Pajeú com as caras pintadas e chocalhos festivos." },
  { t: "Máscara Tradicional dos Papangus de Bezerros", cat: "Colecionáveis", m: "Papel Machê e Gesso", tec: "Modelagem Carnavalesca", reg: "Olinda e Zona da Mata", gal: "carnavalFibras", d: "O disfarce tradicional para saborear a canjica e o angu sem ser reconhecido na folia." },
  { t: "Chapéu de Caboclo de Lança com Fitas Coloridas e Espelhos", cat: "Colecionáveis", m: "Palha, Fitas e Vidro", tec: "Adereço Tradicional", reg: "Olinda e Zona da Mata", gal: "carnavalFibras", d: "Armação imponente com fitas que dançam no ar durante a evolução do guerreiro." },
  { t: "Sombrinha de Frevo Autêntica com Cabo de Madeira Torneada", cat: "Colecionáveis", m: "Tecido Acetinado e Madeira", tec: "Sombrinha Manual", reg: "Olinda e Zona da Mata", gal: "carnavalFibras", d: "Cores vivas do frevo (amarelo, azul, vermelho e verde) pronta para o passo de rua." },
  { t: "Estandarte Festivo Bordado com Fios Dourados e Flores", cat: "Colecionáveis", m: "Cetim, Franjas e Metal", tec: "Bordado de Estandarte", reg: "Olinda e Zona da Mata", gal: "carnavalFibras", d: "Abre-alas dos blocos líricos e troças carnavalescas do Recife Antigo e Olinda." },
  { t: "Boneco de Mamulengo Tradicional: O Professor Tiridá", cat: "Colecionáveis", m: "Madeira Mulungu e Tecido", tec: "Teatro de Bonecos", reg: "Olinda e Zona da Mata", gal: "carnavalFibras", d: "Personagem clássico da dramaturgia popular de Glória do Goitá com boca articulada." },
  { t: "Boneco de Mamulengo Articulado: O Cabra Valentão", cat: "Colecionáveis", m: "Madeira e Chita", tec: "Entalhe e Costura", reg: "Olinda e Zona da Mata", gal: "carnavalFibras", d: "Com cassetete e bigodes salientes, animador dos folguedos infantis e praças." },
  { t: "Máscara Carnavalesca de La Ursa em Papel Machê e Pelúcia", cat: "Colecionáveis", m: "Papel Machê e Fibras", tec: "Adereço de Rua", reg: "Olinda e Zona da Mata", gal: "carnavalFibras", d: "O urso mais querido do carnaval que pede uma moedinha para o domador." },
  { t: "Mamulengo Benedito com Traje Típico de Chita Estampada", cat: "Colecionáveis", m: "Madeira e Algodão", tec: "Mamulengo Autêntico", reg: "Olinda e Zona da Mata", gal: "carnavalFibras", d: "O herói trapaceiro e divertido das brincadeiras de boneco do interior." },
  { t: "Painel em Pintura Naif: Ladeira da Misericórdia em Olinda", cat: "Colecionáveis", m: "Acrílica sobre Tela", tec: "Pintura Naif", reg: "Olinda e Zona da Mata", gal: "carnavalFibras", d: "Cores vibrantes, sobrados coloridos e a Igreja da Sé recortada contra o mar azul." },
  { t: "Quadro Naif Original: Noite de Lua Cheia no Alto da Sé", cat: "Colecionáveis", m: "Óleo sobre Painel", tec: "Arte Primitivista", reg: "Olinda e Zona da Mata", gal: "carnavalFibras", d: "Casais dançando ciranda sob a lua pernambucana e o cheiro de tapioca fresca." },
  { t: "Estandarte Infantil do Galo da Madrugada em Veludo", cat: "Colecionáveis", m: "Veludo e Lantejoulas", tec: "Bordado Manual", reg: "Olinda e Zona da Mata", gal: "carnavalFibras", d: "O maior bloco do planeta homenageado em estandarte de parede para colecionadores." },
  { t: "Máscara Barroca Veneziana Olindense com Folha de Ouro", cat: "Colecionáveis", m: "Papel Machê e Ouro", tec: "Pintura Barroca", reg: "Olinda e Zona da Mata", gal: "carnavalFibras", d: "Herança dos carnavais aristocráticos portugueses reinterpretada pelos mestres de Olinda." },
  { t: "Boneca Gigante Mulher do Dia em Escultura Miniatura", cat: "Colecionáveis", m: "Resina e Tecido Nobre", tec: "Miniatura Histórica", reg: "Olinda e Zona da Mata", gal: "carnavalFibras", d: "A companheira do Homem da Meia-Noite que desfila sob o sol escaldante do domingo de carnaval." },
  { t: "Chapéu de Couro de Abas Viradas Estilo Luiz Gonzaga", cat: "Cama e Mesa", m: "Couro Bovino Natural", tec: "Trabalho em Couro", reg: "Agreste e Sertão Tradicional", gal: "carnavalFibras", d: "Ícone máximo da identidade sertaneja, cosido com barbicacho e pespontos firmes." },
  { t: "Gibão de Couro de Bode Pespontado à Mão com Forro", cat: "Cama e Mesa", m: "Couro Caprino Curtido", tec: "Alfaiataria Sertaneja", reg: "Agreste e Sertão Tradicional", gal: "carnavalFibras", d: "Armadura do vaqueiro nordestino que o protege dos espinhos secos do juremal." },
  { t: "Sandália Xô Boi Tradicional em Couro Bovino Trançado", cat: "Cama e Mesa", m: "Couro Cru e Borracha", tec: "Calçado Rústico", reg: "Agreste e Sertão Tradicional", gal: "carnavalFibras", d: "Solado resistente e tiras confortáveis para andar nas pedras e ruas históricas." },
  { t: "Bolsa Tiracolo Rústica em Couro Cru com Fivela Antiga", cat: "Cama e Mesa", m: "Couro Legítimo Curtido", tec: "Couro Lavrado", reg: "Agreste e Sertão Tradicional", gal: "carnavalFibras", d: "Durabilidade eterna com compartimento amplo e costura em linha encerada." },
  { t: "Cesto Trançado com Alças em Fibra de Carnaúba do Sertão", cat: "Cama e Mesa", m: "Palha de Carnaúba", tec: "Cestaria Manual", reg: "Agreste e Sertão Tradicional", gal: "carnavalFibras", d: "Organizador multiuso ecológico colhido e trançado pelas artesãs do Vale do Pajeú." },
  { t: "Luminária Pendente em Palha de Ouricuri Trançada à Mão", cat: "Cama e Mesa", m: "Fibra de Ouricuri", tec: "Design Natural", reg: "Agreste e Sertão Tradicional", gal: "carnavalFibras", d: "Projeta sombras geométricas envolventes no teto criando um clima acolhedor." },
  { t: "Conjunto com 4 Sousplats em Fibra de Bananeira Pura", cat: "Cama e Mesa", m: "Tronco de Bananeira", tec: "Tear de Palha", reg: "Agreste e Sertão Tradicional", gal: "carnavalFibras", d: "Reaproveitamento nobre da fibra agrícola transformado em alta decoração de mesa." },
  { t: "Fruteira Orgânica Escultural em Raiz de Carnaubeira", cat: "Cama e Mesa", m: "Raiz e Palha Trançada", tec: "Trançado Orgânico", reg: "Agreste e Sertão Tradicional", gal: "carnavalFibras", d: "Linhas sinuosas que valorizam a beleza crua dos elementos da natureza nordestina." },
  { t: "Alforge Tradicional de Montaria para Cavalo em Couro", cat: "Cama e Mesa", m: "Couro Maciço Pespontado", tec: "Selaria Tradicional", reg: "Agreste e Sertão Tradicional", gal: "carnavalFibras", d: "Bolsas duplas que repousam na garupa da sela para transporte de mantimentos." },
  { t: "Cinto Sertanejo Lavrado com Fivela de Metal Envelhecido", cat: "Cama e Mesa", m: "Couro e Latão", tec: "Couro Lavrado a Fogo", reg: "Agreste e Sertão Tradicional", gal: "carnavalFibras", d: "Motivos florais talhados no couro com acabamento oleado impermeabilizante." },
  { t: "Esteira Rústica para Sala em Fibra de Taboa Trançada", cat: "Cama e Mesa", m: "Fibra de Taboa", tec: "Esteiraria Manual", reg: "Agreste e Sertão Tradicional", gal: "carnavalFibras", d: "Sensação térmica refrescante para o chão em dias quentes de verão tropical." },
  { t: "Baú Guardião em Madeira Maciça Revestido de Couro Cru", cat: "Cama e Mesa", m: "Madeira e Couro Pespontado", tec: "Marcenaria e Selaria", reg: "Agreste e Sertão Tradicional", gal: "carnavalFibras", d: "Cravado com tachas de metal para guardar lembranças e documentos da família." },
  { t: "Bolsa de Praia em Palha com Pompom de Lã Colorido", cat: "Cama e Mesa", m: "Palha e Lã Nordestina", tec: "Cestaria Urbana", reg: "Agreste e Sertão Tradicional", gal: "carnavalFibras", d: "Leveza caribenha com sotaque pernambucano para desfrutar o litoral sul de Porto de Galinhas." },
  { t: "Miniatura Autêntica de Alfaia de Maracatu em Madeira e Couro", cat: "Colecionáveis", m: "Madeira, Corda e Couro", tec: "Instrumento Musical Mini", reg: "Olinda e Zona da Mata", gal: "carnavalFibras", d: "O tambor que faz tremer o chão de Pernambuco afinado com cordas e cunhas de madeira." }
];

console.log('🔄 Gerando base massiva e autêntica de dados Fenearte...');

// 4. Gerar 30 Artesãos
const artesaos = nomesBase.map((nome, index) => {
  const polo = polos[index % polos.length];
  return {
    id: `art-${String(index + 1).padStart(3, '0')}`,
    nome,
    email: `artesao${index + 1}@folcstore.com.br`,
    senha: 'senha',
    telefone: `(81) 988${Math.floor(10000 + Math.random() * 90000)}`,
    regiaoProducao: polo.regiao,
    biografia: `Mestre artesão com tradição reconhecida no polo de ${polo.regiao}. Produção autoral focada em materiais sustentáveis e cultura viva de Pernambuco.`,
    reputacao: 4.9,
    totalVendas: 0,
    dataCadastro: new Date(Date.UTC(2026, 4, (index % 25) + 1, 10, 0)).toISOString()
  };
});

// 5. Gerar 100 Clientes (80 compradores ativos + 20 inativos para simular conversão de leads)
const cidadesPE = ['Recife', 'Olinda', 'Caruaru', 'Jaboatão dos Guararapes', 'Paulista', 'Petrolina', 'Garanhuns'];
const customers = [];

for (let i = 1; i <= 100; i++) {
  const cidade = cidadesPE[i % cidadesPE.length];
  customers.push({
    id: `cust-${String(i).padStart(3, '0')}`,
    nome: `Cliente ${i} Folc`,
    email: i === 1 ? 'comprador@gmail.com' : `cliente${i}@gmail.com`,
    senha: 'senha',
    telefone: `(81) 997${Math.floor(10000 + Math.random() * 90000)}`,
    dataCadastro: new Date(Date.UTC(2026, 4 + Math.floor(i / 35), (i % 26) + 1, 14, 0)).toISOString(),
    enderecos: [
      {
        id: `end-${i}`,
        cep: `50000-${String(i).padStart(3, '0')}`,
        rua: `Rua das Flores, ${i * 10}`,
        bairro: 'Centro Histórico',
        cidade,
        estado: 'PE'
      }
    ]
  });
}

// 6. Gerar os 180 Produtos sem Repetições de Títulos e com Fotos Contextuais
const products = acervoFenearte.map((peca, idx) => {
  const i = idx + 1;
  const artesao = artesaos[idx % artesaos.length];
  const isPecaUnica = i % 3 === 0; // 1/3 peças únicas, 2/3 lotes
  const preco = isPecaUnica 
    ? Math.floor(Math.random() * (620 - 210 + 1)) + 210 
    : Math.floor(Math.random() * (150 - 40 + 1)) + 40;

  // Seleciona a imagem da galeria temática correspondente
  const imagensPool = galeriaImagens[peca.gal];
  const imagemEscolhida = imagensPool[idx % imagensPool.length];

  return {
    id: `prod-${String(i).padStart(3, '0')}`,
    sku: `${isPecaUnica ? 'UNI' : 'LOT'}-${3000 + i}`,
    titulo: peca.t,
    descricao: peca.d,
    materiaPrima: peca.m,
    tecnica: peca.tec,
    regiaoProducao: peca.reg,
    categoria: peca.cat,
    preco,
    tipo: isPecaUnica ? 'peca_unica' : 'lote',
    quantidadeEstoque: isPecaUnica ? 1 : Math.floor(Math.random() * 20) + 4,
    prazoProducao: isPecaUnica ? 0 : Math.floor(Math.random() * 10) + 2,
    idArtesao: artesao.id,
    nomeArtesao: artesao.nome,
    linkImagens: [imagemEscolhida],
    ativo: true,
    dataCadastro: new Date(Date.UTC(2026, 4, (i % 25) + 1, 11, 30)).toISOString()
  };
});

// 7. Gerar Pedidos (Orders) - Sazonalidade (Pico no São João de Junho de 2026)
const orders = [];
const avaliacoes = [];
const compradoresAtivos = customers.slice(0, 80); // 80 compradores ativos, 20 sem compras

let orderCounter = 1;

compradoresAtivos.forEach((cliente, idx) => {
  const totalPedidosCliente = (idx % 3) + 1; // 1 a 3 pedidos por comprador

  for (let k = 0; k < totalPedidosCliente; k++) {
    const produto = products[Math.floor(Math.random() * products.length)];
    
    // Distribuição sazonal dos pedidos (Pico forte em Junho/2026 - Mês 5)
    const pesoSazonal = Math.random();
    let mesPedido = 5; // Junho (Pico de São João)
    if (pesoSazonal < 0.15) mesPedido = 4; // Maio (Início)
    else if (pesoSazonal < 0.65) mesPedido = 5; // Junho (Pico)
    else if (pesoSazonal < 0.80) mesPedido = 6; // Julho (Ressaca pós-festa)
    else if (pesoSazonal < 0.92) mesPedido = 7; // Agosto (Retomada)
    else mesPedido = 8; // Setembro (Recentes e pendentes)

    const dataCompra = new Date(Date.UTC(2026, mesPedido, Math.floor(Math.random() * 26) + 1, 15, 30)).toISOString();
    
    let situacaoEntrega = 'Entregue';
    let codigoPostagem = `BR${200000000 + orderCounter}PE`;
    let status = 'Pago';

    // Pedidos de setembro de 2026 simulando entregas pendentes
    if (mesPedido === 8) {
      situacaoEntrega = orderCounter % 2 === 0 ? 'aguardadoEnvio' : 'Enviado';
      if (situacaoEntrega === 'aguardadoEnvio') codigoPostagem = null;
    }

    const orderId = `ord-${String(orderCounter).padStart(4, '0')}`;
    const temAvaliacao = situacaoEntrega === 'Entregue' && (orderCounter % 2 === 0);

    orders.push({
      id: orderId,
      idArtesao: produto.idArtesao,
      idComprador: cliente.id,
      nomeComprador: cliente.nome,
      idProduto: produto.id,
      tituloProduto: produto.titulo,
      quantidade: 1,
      precoUnitario: produto.preco,
      status,
      dataCompra,
      enderecoEntrega: cliente.enderecos[0],
      pagamento: {
        metodo: orderCounter % 2 === 0 ? 'pix' : 'cartao_credito',
        status: 'aprovado'
      },
      situacaoEntrega,
      codigoPostagem,
      avaliado: temAvaliacao
    });

    // 8. Gerar Avaliações com Textos e Notas Coerentes
    if (temAvaliacao) {
      const notas = [9, 10, 10, 8, 10, 9];
      const comentarios = [
        'Peça com acabamento primoroso. Dá orgulho ver o artesanato pernambucano com esse nível!',
        'Chegou perfeitamente embalada. Muito mais bonita pessoalmente do que nas fotos.',
        'Autêntica e cheia de história. O ateliê está de parabéns pela entrega e atenção.',
        'Comprei para presentear e fez o maior sucesso. Recomendo a todos!',
        'Trabalho impecável em cada detalhe. Valoriza qualquer ambiente.',
        'Entrega rápida e produto exatamente como descrito. Comprarei mais vezes!'
      ];

      avaliacoes.push({
        id: `aval-${String(avaliacoes.length + 1).padStart(4, '0')}`,
        idPedido: orderId,
        idProduto: produto.id,
        idArtesao: produto.idArtesao,
        nomeComprador: cliente.nome,
        nota: notas[orderCounter % notas.length],
        comentario: comentarios[orderCounter % comentarios.length],
        data: new Date(new Date(dataCompra).getTime() + (3 * 24 * 60 * 60 * 1000)).toISOString()
      });
    }

    orderCounter++;
  }
});

// Administrador
const admins = [
  {
    id: 'adm-001',
    nome: 'Gestor FolcStore',
    email: 'admin@gmail.com',
    senha: 'senha',
    role: 'ADMIN'
  }
];

// 9. Montagem do Objeto do Banco e Gravação
const database = {
  artesaos,
  customers,
  products,
  orders,
  avaliacoes,
  admins
};

const destino = path.join(__dirname, 'base-db.json');
fs.writeFileSync(destino, JSON.stringify(database, null, 2), 'utf-8');

console.log(`\n🎉 Banco base-db.json gerado com sucesso!`);
console.log(`👨‍🎨 Artesãos: ${artesaos.length}`);
console.log(`👥 Clientes: ${customers.length} (80 ativos, 20 sem pedidos para métricas de conversão)`);
console.log(`🏺 Produtos Autênticos Fenearte: ${products.length} (100% únicos)`);
console.log(`📦 Pedidos Criados: ${orders.length} (Pico concentrado no São João/Junho de 2026)`);
console.log(`⭐ Avaliações Reais: ${avaliacoes.length}`);