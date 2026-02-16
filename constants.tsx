
import { Professional, TrustLevel, Notification } from './types';

export const MOCK_PROFESSIONALS: Professional[] = [
  {
    id: '1',
    name: 'Ana Silva',
    category: 'Diarista Profissional',
    rating: 5.0,
    reviewCount: 142,
    location: 'Moema, SP',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAlIm9jss_7KEJ3xqc6GyxX-sFqNhWxpTSsOGVAyR5iYJkqZ-B31DlX1AO0_wIRw0PZOXQsiK6Ukgwi85vdiGMmOWj7bJFGoP6YceMFS9f9Ig0FKDSIH0MHsqPY_Ot0W0h4VD5qUoCeA8N8zdIDwcn91F8Rc-6RoIJd1RJ1SrQw9XFHD8YhiJdIBLh4UqNKNIrnP_Gwo_WOmmkAkKz3xO75v5u2R7Csfb8TCMnfdK-iIj-1KxmMnnHe5q8r3guMR0cfqfCazFwi3IH',
    trustLevel: TrustLevel.ELITE,
    responseTime: '5 min',
    online: true,
    about: 'Especialista em limpeza residencial e comercial de alto padrão com mais de 8 anos de experiência.',
    tags: ['Limpeza', 'Organização', 'Elite'],
    trustScore: 98,
    recommendationRate: 99
  },
  {
    id: '2',
    name: 'Ricardo Silva',
    category: 'Mestre de Obras & Empreiteiro',
    rating: 4.9,
    reviewCount: 84,
    location: 'São Paulo, SP',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-AgPFeD6MpdSfInJ5RO2CVv40Xb6WT1rl6wIdbefqYlxYPjoaUxOezf86ME9PV--0GsaETN1UGokbuJMUe0GYGdqPBGko15yBl_MOGT-tqYvsBqAVwBxMz0Nl47yA7ZZFUx9gyKz-8fmJ1QC9ofHdYp4GFjqWJGj8qXMo0ZotzdYCvXatns9PWcdnFr1MjhTLkvIy7jJACYJT8z4DjX0LvsRyvQWIn0FOk8ZGmyoWBuZaniA6zH0HPvSD79DjT9KQpbgLgsdpzYng',
    trustLevel: TrustLevel.GOLD,
    responseTime: '15 min',
    online: true,
    about: 'Especialista em reformas residenciais e comerciais de alto padrão com mais de 12 anos de experiência.',
    tags: ['Elétrica', 'Hidráulica', 'Pintura', 'Gesso'],
    trustScore: 95,
    recommendationRate: 97
  },
  {
    id: '3',
    name: 'Mariana Lima',
    category: 'Passadeira',
    rating: 4.8,
    reviewCount: 12,
    location: 'Pinheiros, SP',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQzu21QlFCavByaOH3AHPXGvpJ9zkiKolczgKl9uQ7uQKUE9-jmZIQd7HNsYjpM985ieZS8Qb3uaUR8049d3Mu-yfIuaC8HQiClSDQYwEMvm1IsBBrYkJZBemhmEUezo4N2W4m4SEevC6rwivZYouzwvXLonIlP9x1NN5H6LlKP9UhWfRtgeKftY0gq4FE2tQeY4MJtuK_Lxf_x1ulFUZPkHHFCuNQMs2Fc4GnLJY1HbF8EzJuaEqqelDhalgY8Gmv2i4RIrBDLiWU',
    trustLevel: TrustLevel.VERIFIED,
    responseTime: '1 hora',
    online: false
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'review',
    title: 'Nova Avaliação',
    content: 'Maria S. avaliou seu serviço com 5 estrelas. "Excelente trabalho!"',
    time: '15 min',
    unread: true,
    rating: 5
  },
  {
    id: '2',
    type: 'verification',
    title: 'Verificação Pendente',
    content: 'Seu documento de identidade precisa ser reenviado para manter o selo Verificado.',
    time: '2h atrás',
    unread: false
  },
  {
    id: '3',
    type: 'ranking',
    title: 'Mudança de Ranking',
    content: 'Você subiu para o Top 10% dos profissionais na sua região.',
    time: '2 dias atrás',
    unread: false
  }
];
