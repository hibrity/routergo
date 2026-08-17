# RouterGo - Sistema de Roteirização e Gestão de Entregas

## Visão Geral

RouterGo é uma aplicação full-stack para gestão de entregas e roteirização, construída com React, TypeScript, Vite e Supabase.

## Estrutura do Projeto

```
/workspace
├── src/
│   ├── App.tsx                 # Componente raiz da aplicação
│   ├── main.tsx                # Ponto de entrada da aplicação
│   ├── styles.css              # Estilos globais
│   │
│   ├── types/                  # Definições de tipos TypeScript
│   │   └── index.ts            # Tipos compartilhados
│   │
│   ├── utils/                  # Funções utilitárias
│   │   ├── index.ts            # Utils gerais (sleep, formatDate, etc.)
│   │   └── address.ts          # Validação e formatação de endereços
│   │
│   ├── hooks/                  # Hooks personalizados React
│   │   └── useAuth.ts          # Hook de autenticação e perfil
│   │
│   ├── services/               # Camada de serviços e lógica de negócio
│   │   ├── index.ts            # Exportações dos serviços
│   │   ├── order.ts            # Serviço de gestão de pedidos
│   │   ├── routerGo.ts         # Integração com API RouterGo
│   │   ├── companySettings.ts  # Configurações da empresa
│   │   ├── dispatch.ts         # Dispatch automático de rotas
│   │   └── routing.ts          # Geração e otimização de rotas
│   │
│   ├── lib/                    # Bibliotecas e configurações base
│   │   └── supabase.ts         # Cliente Supabase configurado
│   │
│   ├── backend/                # Backend API (Express)
│   │   └── api/
│   │       └── index.ts        # Servidor Express
│   │
│   ├── components/             # Componentes React reutilizáveis
│   │   └── AddressScanner.tsx  # Componente de leitura de endereços
│   │
│   └── pages/                  # Páginas da aplicação
│       ├── Login.tsx           # Login admin/empresa
│       ├── DriverLogin.tsx     # Login entregador
│       ├── Dashboard.tsx       # Dashboard admin
│       ├── DriverApp.tsx       # App do entregador
│       ├── RouteMapbox.tsx     # Mapa de rotas
│       ├── Routes.tsx          # Gestão de rotas
│       ├── Deliveries.tsx      # Gestão de entregas
│       └── DriversAdmin.tsx    # Admin de motoristas
│
├── public/                     # Arquivos estáticos públicos
├── package.json                # Dependências e scripts
├── vite.config.ts              # Configuração Vite
└── README.md                   # Este arquivo
```

## Arquitetura

### Frontend
- **React 18** com TypeScript
- **Vite** como bundler
- **React Router DOM** para navegação
- **Mapbox GL** para mapas e rotas
- **Supabase** para autenticação e banco de dados

### Backend
- **Express** para API REST
- **Supabase** como banco de dados
- **Integração RouterGo** para roteirização externa

### Organização do Código

#### Tipos (`src/types/`)
Todos os tipos TypeScript são centralizados em um único arquivo para facilitar a manutenção e reutilização.

#### Utils (`src/utils/`)
Funções puras e utilitárias que não dependem de estado ou contexto:
- Validação e formatação de endereços
- Funções de data/hora
- Cálculos geográficos (Haversine)

#### Hooks (`src/hooks/`)
Hooks personalizados para lógica de estado e efeitos colaterais:
- `useAuth`: Gerencia autenticação e perfil do usuário
- `useOrders`: Fetch e gerenciamento de pedidos

#### Services (`src/services/`)
Camada de serviço que encapsula toda a lógica de negócio e comunicação com APIs:
- `OrderService`: CRUD de pedidos
- `RouterGoService`: Integração com API externa
- `CompanySettingsService`: Configurações da empresa
- `DispatchService`: Dispatch automático de rotas
- `RoutingService`: Otimização de rotas

#### Lib (`src/lib/`)
Configurações e inicializações de bibliotecas externas:
- `supabase.ts`: Cliente Supabase configurado

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview
```

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ROUTERGO_API_KEY=your_routergo_api_key
VITE_ROUTERGO_URL=your_routergo_api_url
```

Para o backend:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_key
ROUTERGO_API_KEY=your_routergo_api_key
ROUTERGO_URL=your_routergo_api_url
PORT=5000
```

## Funcionalidades

### Para Empresas/Admins
- Dashboard com visão geral de entregas
- Gestão de pedidos (criar, editar, listar)
- Configurações de entrega (raio, modo de demanda)
- Administração de motoristas
- Visualização de rotas no mapa
- Dispatch automático de rotas

### Para Motoristas
- Login específico para entregadores
- Visualização de rotas atribuídas
- Atualização de status de entrega
- Navegação com mapa integrado

### Recursos Técnicos
- Autenticação com Supabase Auth
- Rotas otimizadas usando algoritmo Nearest Neighbor
- Agrupamento geográfico de entregas
- Integração com API RouterGo (opcional)
- Suporte a PWA (manifest.webmanifest)

## Melhorias de Estrutura Implementadas

1. **Separação clara de responsabilidades**: Cada diretório tem um propósito bem definido
2. **Services pattern**: Lógica de negócio isolada em serviços reutilizáveis
3. **Custom hooks**: Lógica de estado e efeitos encapsulada em hooks
4. **Tipagem centralizada**: Todos os tipos em um único local
5. **Utils puras**: Funções utilitárias testáveis e independentes
6. **Backend integrado**: Código do backend organizado junto com o frontend

## Próximos Passos Sugeridos

1. Adicionar testes unitários para services e utils
2. Implementar cache com React Query/SWR
3. Adicionar tratamento de erros global
4. Implementar offline-first com service workers
5. Adicionar logs e monitoramento

## Licença

MIT
