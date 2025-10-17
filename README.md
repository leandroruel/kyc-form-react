# Aplicação Frontend KYC

Uma aplicação moderna de verificação Know Your Customer (KYC) construída com React, TypeScript e Vite. Esta aplicação fornece um formulário de múltiplas etapas para coletar e verificar informações de identidade do usuário com recursos de detecção facial em tempo real.

## Funcionalidades

- Formulário de verificação KYC em múltiplas etapas
- Detecção facial em tempo real durante a captura de selfie
- Validação de endereço e upload de comprovante
- Verificação de documento de identidade
- Design responsivo com suporte a tema escuro/claro
- Validação de formulário com React Hook Form e Zod
- Componentes UI modernos usando Radix UI e Tailwind CSS

## Stack Tecnológica

- **React 19** - Framework UI
- **TypeScript** - Segurança de tipos
- **Vite** - Ferramenta de build e servidor de desenvolvimento
- **Tailwind CSS 4** - Estilização
- **Radix UI** - Primitivos de componentes acessíveis
- **React Hook Form** - Gerenciamento de estado de formulários
- **Zod** - Validação de schema
- **TanStack Query** - Busca e cache de dados
- **React Webcam** - Integração com câmera
- **@vladmandic/human** - Detecção facial com IA
- **Framer Motion** - Animações
- **date-fns** - Utilitários de data
- **Sonner** - Notificações toast

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- Gerenciador de pacotes **npm** ou **yarn** ou **pnpm**
- Um navegador web moderno com acesso à webcam (para verificação de selfie)

## Começando

### 1. Clone o repositório

```bash
git clone <repository-url>
cd woovi-test-kyc-frontent
```

### 2. Instale as dependências

Usando npm:
```bash
npm install
```

Usando yarn:
```bash
yarn install
```

Usando pnpm:
```bash
pnpm install
```

### 3. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação iniciará em `http://localhost:5173` (ou outra porta se a 5173 estiver ocupada).

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento com hot module replacement
- `npm run build` - Compila a aplicação para produção
- `npm run preview` - Visualiza a build de produção localmente
- `npm run lint` - Executa o ESLint para verificar a qualidade do código

## Estrutura do Projeto

```
src/
├── components/
│   ├── kyc/              # Componentes das etapas do formulário KYC
│   │   ├── PersonalInfoStep.tsx
│   │   ├── AddressStep.tsx
│   │   ├── IdentityStep.tsx
│   │   ├── SelfieStep.tsx
│   │   └── ReviewStep.tsx
│   ├── ui/               # Componentes UI reutilizáveis
│   └── ...
├── hooks/                # Hooks React customizados
│   └── useFaceDetection.ts
├── lib/                  # Funções utilitárias
├── pages/                # Componentes de página
└── App.tsx               # Componente principal da aplicação
```

# Desafios e decisões
- Selfie e reconhecimento facial: queria deixar o mais próximo possível do real, encontrar uma lib js/react que faça isso sem setup complicado e código macarrônico foi um pouco difícil, pesquisei e testei diversas libs diferentes até encontrar uma que se encaixou bem neste desafio, a humanjs.

- build: o tamanho do build foi ficando cada vez maior a medida que fui evoluindo o app, chegou a ficar maior que 3mb, então tive que pesquisar técnicas para diminuir o tamanho do build final usando vite, explorei algumas configurações do vite e como separar algumas partes do build em chunks menores para melhorar o tamanho final, usei dynamic import de componentes de kyc que ajuda a otimizar o tamanho final do build, tambem usei postcss para diminuir o tamanho do css, que ajudou em uma pontuação boa no lighthouse.

- acessibilidade: não foi um desafio mas conforme testei vi que a pontuação não subia, então fiz pequenos ajustes para chegar a pontuação acima de 90.

- testes: os testes estavam sendo um desafio, então usei claude code para me ajudar a gerar boa parte deles, tomando cuidado de checar cada e ver se eles estavam testando o comportamento corretamente, um dos componentes que usam selfie foi um problema pois a lib de camera nao iria funcionar em ambiente de teste e foi necessário criar um mock.

- storybook: apesar de ser simples de configurar, eu queria que o storybook funcionasse junto com meu app em uma url /storybook ou whatever, o problema é que de primeira isso não funcionou, então fiz pesquisa no google de como fazê-lo e tive auxílio da llm para gerar os arquivos e configurações necessários para funcionar na vercel.