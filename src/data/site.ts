/*
 * CONTEÚDO DO SITE
 * Textos e listas ficam separados do layout: para editar o site, mexa aqui,
 * sem tocar nas seções. É o mesmo princípio de um CMS, só que em arquivo.
 */

export const contact = {
  whatsapp: 'https://wa.me/5511948851362',
  phone: '+55 11 94885-1362',
  email: 'falecom@studioparadoxal.com.br',
  address: ['Av. Paulista, 1471, Bela Vista', 'São Paulo, SP, 01311-200'],
  instagram: 'https://www.instagram.com/studioparadoxal/',
  linkedin: 'https://www.linkedin.com/company/studio-paradoxal/',
  labs: 'https://labs.studioparadoxal.com.br',
};

// Ativos ainda servidos pelo site atual. Trocar por arquivos em /public antes de desligar a HostGator.
export const legacyAssets = {
  logo: 'https://studioparadoxal.com.br/wp-content/uploads/2026/07/Ativo-76.svg',
  labsLogo: 'https://studioparadoxal.com.br/wp-content/uploads/2026/07/LABS-LOGO-1.svg',
  reel: 'https://studioparadoxal.com.br/wp-content/uploads/2026/07/snapinsta-1784735316439.mp4',
};

// PLACEHOLDER: nomes em texto até chegarem os logos em SVG.
export const clients = [
  'Accelera', 'Ibramec', 'Febracis', 'StartSe', 'Ideal Odonto',
  'Clab Digital', 'Sysclin', 'Samurais', 'Neuari', 'GIT',
];

export const cases = [
  {
    name: 'Clab Digital',
    href: 'https://studioparadoxal.com.br/clab-digital/',
    tags: ['Branding', 'Identidade visual'],
    tone: '#d9d9d6', // cor do placeholder até chegar a imagem
  },
  {
    name: 'Sysclin',
    href: 'https://studioparadoxal.com.br/sysclin/',
    tags: ['Development', 'Identidade visual', 'UX design', 'UI design'],
    tone: '#c9c9c5',
  },
];

export const services = [
  {
    name: 'Branding & Design',
    summary: 'Sistemas de marca fortes e memoráveis, construídos sobre estratégia, pesquisa e método de design.',
    tags: ['Identidade de marca', 'Posicionamento', 'Arquitetura de marca', 'Naming', 'Tom de voz', 'Brand guidelines', 'Aplicações institucionais'],
  },
  {
    name: 'Web Development',
    summary: 'Sites e landing pages rápidos, com interação autoral e alinhados à identidade e à estratégia do negócio.',
    tags: ['Sites institucionais', 'Landing pages', 'E-commerce', 'Headless CMS', 'Performance e SEO', 'Infraestrutura'],
  },
  {
    name: 'Apps & Produtos Digitais',
    summary: 'Plataformas intuitivas e escaláveis, do protótipo ao produto em operação.',
    tags: ['Web apps', 'Apps nativos', 'Produtos SaaS', 'MVP e prototipagem', 'Agentes de IA', 'Avaliação de UX'],
  },
  {
    name: 'Marketing & Content',
    summary: 'Estratégia, conteúdo e campanhas guiadas por dados nos canais digitais da marca.',
    tags: ['Estratégia de redes', 'Mídia online', 'Copywriting', 'E-mail marketing', 'Análise de resultados'],
  },
  {
    name: 'Extensão de Time',
    summary: 'Um squad multidisciplinar integrado ao seu negócio, com gestão de projetos sob demanda.',
    tags: ['Design', 'Dev', 'Motion', 'Copy', 'Social media', 'Backlog semanal', 'Direção estratégica', 'QA de marca'],
  },
];

export const founders = [
  {
    name: 'Pamella Romão',
    role: 'Head de Branding e Estratégia',
    instagram: 'https://www.instagram.com/pamellaromao/',
    linkedin: 'https://www.linkedin.com/in/pamella-rom%C3%A3o-972355174/',
  },
  {
    name: 'Tibério Costa',
    role: 'Head de Design e Criação',
    instagram: 'https://www.instagram.com/tiberiocosta_/',
    linkedin: 'https://www.linkedin.com/in/tiberiocosta/',
  },
];
