// data.jsx — Velhos Sabores: catálogo de produtos + comparativo artesanal × industrializado

const VS_PRODUCTS = [
  {
    id: 'canela',
    img: 'https://images.unsplash.com/photo-1746333372850-2eaa2dc31bed?w=700&q=80&auto=format&fit=crop',
    nome: 'Pão de Canela',
    tagline: 'Doce de tarde de domingo',
    descricao:
      'Uma massa doce e macia, enriquecida com uma generosa pasta de canela artesanal em seu interior. O resultado é um pão aromático, equilibrado e cheio de personalidade, transformando cada fatia em uma experiência especial.',
    label: 'foto · pão de canela fatiado',
    selo: 'Recheio artesanal de canela',
    ingredientes: ['Farinha de trigo', 'Canela em rama', 'Mel', 'Manteiga', 'Sal marinho'],
    artesanal: {
      ingredientes: '6 ingredientes que você reconhece',
      conservantes: 'Nenhum',
      sabor: 'Canela viva, miolo úmido, casca caramelizada',
      validade: '3 dias de frescor real',
    },
    industrial: {
      ingredientes: '20+ itens, vários impronunciáveis',
      conservantes: 'Propionato de cálcio, sorbato',
      sabor: 'Aroma artificial de canela, doçura uniforme',
      validade: '45 dias de prateleira',
    },
  },
  {
    id: 'integral',
    img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=700&q=80&auto=format&fit=crop',
    nome: 'Pão Integral',
    tagline: 'O de todo dia, do jeito certo',
    descricao:
      'Uma alternativa equilibrada para quem busca uma alimentação mais consciente, sem abrir mão do sabor. Produzido com 50% de farinha integral, nosso pão integral é desenvolvido para mostrar que alimentação saudável pode ser extremamente saborosa.',
    label: 'foto · pão integral inteiro',
    selo: 'Produção artesanal',
    ingredientes: ['Farinha integral', 'Fermento natural', 'Água', 'Sal marinho'],
    artesanal: {
      ingredientes: '4 ingredientes, farinha 100% integral',
      conservantes: 'Nenhum',
      sabor: 'Trigo encorpado, miolo denso, casca rústica',
      validade: '4 dias de frescor real',
    },
    industrial: {
      ingredientes: 'Farinha refinada + “fibra” adicionada',
      conservantes: 'Emulsificantes, propionato',
      sabor: 'Macio uniforme, gosto neutro de fábrica',
      validade: '60 dias de prateleira',
    },
  },
  {
    id: 'graos',
    img: 'https://images.unsplash.com/photo-1650377812669-e42ad1e88e8d?w=700&q=80&auto=format&fit=crop',
    nome: 'Integral · 4 Grãos & Passas',
    tagline: 'O mais cheio de história',
    descricao:
      'Nossa versão mais completa e nutritiva. Combina a leveza da massa integral com uma seleção especial de sementes e o toque naturalmente adocicado das uvas-passas. O resultado é um pão rico em textura, sabor e nutrientes, ideal para quem valoriza uma alimentação equilibrada.',
    label: 'foto · fatia com grãos e passas',
    selo: 'Mix de sementes selecionadas',
    ingredientes: ['Farinha integral', 'Linhaça marrom', 'Aveia', 'Girassol', 'Gergelim', 'Uvas-passas', 'Fermento natural'],
    artesanal: {
      ingredientes: 'Grãos inteiros e passas de verdade',
      conservantes: 'Nenhum',
      sabor: 'Crocante, doçura da passa, final de nozes',
      validade: '4 dias de frescor real',
    },
    industrial: {
      ingredientes: 'Grãos triturados, xarope de glicose',
      conservantes: 'Conservantes + corante caramelo',
      sabor: 'Doçura de xarope, textura padronizada',
      validade: '60 dias de prateleira',
    },
  },
  {
    id: 'caseiro',
    img: 'https://images.unsplash.com/photo-1536534028025-68598ea8af44?w=700&q=80&auto=format&fit=crop',
    nome: 'Pão Caseiro',
    tagline: 'A memória do café da manhã',
    descricao:
      'O clássico que atravessa gerações. Inspirado nas receitas transmitidas entre famílias ao longo do tempo, nosso pão caseiro representa a essência da memória afetiva. Produzido com calma, carinho e respeito ao processo artesanal, é aquele pão que traz conforto e sabor para qualquer momento do dia.',
    label: 'foto · pão caseiro dourado',
    selo: 'Receita tradicional',
    ingredientes: ['Farinha de trigo', 'Fermento natural', 'Leite', 'Ovos', 'Manteiga', 'Sal'],
    artesanal: {
      ingredientes: 'Leite, ovos e manteiga de verdade',
      conservantes: 'Nenhum',
      sabor: 'Miolo fofo, casca dourada, cheiro de forno',
      validade: '3 dias de frescor real',
    },
    industrial: {
      ingredientes: 'Gordura vegetal, aromatizantes, açúcar',
      conservantes: 'Propionato, antiumectante',
      sabor: 'Macio elástico, sabor adocicado de fábrica',
      validade: '45 dias de prateleira',
    },
  },
];

// As 4 linhas do comparativo (rótulo + ícone conceitual)
const VS_COMPARE_ROWS = [
  { key: 'ingredientes', rotulo: 'Ingredientes' },
  { key: 'conservantes', rotulo: 'Conservantes & aditivos' },
  { key: 'sabor', rotulo: 'Sabor & textura' },
  { key: 'validade', rotulo: 'Frescor' },
];

Object.assign(window, { VS_PRODUCTS, VS_COMPARE_ROWS });
