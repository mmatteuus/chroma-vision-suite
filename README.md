# Chroma Vision Suite

Sistema web para gestão de óticas, com dashboards, estoque, vendas, financeiro e CRM leve. Construído com Vite, React 18, TypeScript, Tailwind e componentes shadcn.

## Scripts

- `npm install` — instala dependências  
- `npm run dev` — inicia ambiente de desenvolvimento  
- `npm run build` — build de produção  
- `npm run preview` — serve o build para revisão  
- `npm run lint` — lint do projeto

## Estrutura

- `src/pages` — telas principais (Dashboard, Estoque, Vendas, Financeiro, Clientes, Configurações)  
- `src/components` — layout, UI (shadcn) e blocos comuns (cards, tabelas, gráficos)  
- `src/hooks` — hooks de suporte (detecção mobile, mock de dados com React Query)  
- `src/lib` — utilitários (ex.: `cn`)

## Desenvolvimento

1. Clone o repositório e instale as dependências com `npm install`.
2. Rode `npm run dev` e acesse o endereço indicado pelo Vite.
3. Ajuste tokens de tema em `src/index.css` e utilitários Tailwind em `tailwind.config.ts` se precisar de personalização visual.
4. Utilize `src/hooks/useMockQuery.ts` para dados simulados enquanto a API não está conectada.

## Notas

- Tema claro/escuro já preparado via tokens CSS; adicione um toggle global se necessário.
- Componentes de gráfico usam Recharts e leem cores do tema para manter contraste.
- Não há dependências de serviços externos. Tudo roda localmente.
