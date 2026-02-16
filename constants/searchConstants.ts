// Lista de cidades brasileiras
export const BRAZILIAN_CITIES = [
  'São Paulo',
  'Rio de Janeiro',
  'Brasília',
  'Salvador',
  'Fortaleza',
  'Belo Horizonte',
  'Manaus',
  'Curitiba',
  'Recife',
  'Porto Alegre',
  'Belém',
  'Goiânia',
  'Guarulhos',
  'Campinas',
  'São Luís',
  'São Gonçalo',
  'Maceió',
  'Duque de Caxias',
  'Natal',
  'Santo André',
  'Osasco',
  'Niterói',
  'Ribeirão Preto',
  'Sorocaba',
  'Santos',
  'Uberlândia',
  'Contagem',
  'Jaboatão dos Guararapes',
  'Feira de Santana',
  'Vila Velha',
  'Caxias do Sul',
  'Mesa',
  'Joinville',
  'Campina Grande',
  'Aracaju',
  'Aparecida de Goiânia',
  'Manaus',
  'Paulista',
  'Cascavel',
  'Anápolis',
];

// Lista de serviços disponíveis no site
export const AVAILABLE_SERVICES = [
  'Limpeza',
  'Encanamento',
  'Eletricidade',
  'Pintura',
  'Carpintaria',
  'Alvenaria',
  'Jardinagem',
  'Hidráulica',
  'Ar-condicionado',
  'Serralheria',
  'Vidraçaria',
  'Marmoaria',
  'Impermeabilização',
  'Reboco',
  'Azulejaria',
];

// Função para filtrar cidades por input
export const filterCities = (input: string): string[] => {
  const normalizedInput = input.toLowerCase();
  return BRAZILIAN_CITIES.filter(city =>
    city.toLowerCase().includes(normalizedInput)
  ).slice(0, 10); // Retorna apenas os 10 primeiros
};
