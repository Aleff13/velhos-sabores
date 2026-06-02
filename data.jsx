// data.jsx — Velhos Sabores: catálogo de produtos + comparativo artesanal × industrializado

const VS_PRODUCTS = [
  {
    id: 'canela',
    img: 'https://images.unsplash.com/photo-1746333372850-2eaa2dc31bed?w=700&q=80&auto=format&fit=crop',
    nome: 'Pão de Canela',
    tagline: 'Doce de tarde de domingo',
    descricao:
      'Massa macia perfumada com canela em rama moída na hora e um toque de mel. Assado lentamente até a casca caramelizar.',
    label: 'foto · pão de canela fatiado',
    selo: 'Fermentação lenta',
    ingredientes: ['Farinha de trigo', 'Fermento natural', 'Canela em rama', 'Mel', 'Manteiga', 'Sal marinho'],
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
      'Farinha integral moída em pedra, sem refino. Encorpado, com sabor de trigo de verdade e aquela casca rústica.',
    label: 'foto · pão integral inteiro',
    selo: 'Farinha moída em pedra',
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
      'Linhaça, aveia, girassol e gergelim com passas suculentas. Cada fatia tem textura, doçura natural e crocância.',
    label: 'foto · fatia com grãos e passas',
    selo: 'Grãos e sementes inteiros',
    ingredientes: ['Farinha integral', 'Linhaça', 'Aveia', 'Girassol', 'Gergelim', 'Passas', 'Fermento natural'],
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
      'O pão da casa: miolo fofo, casca dourada e cheiro que toma a cozinha. Como o da sua avó fazia — porque é assim que se faz.',
    label: 'foto · pão caseiro dourado',
    selo: 'Receita de família',
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
