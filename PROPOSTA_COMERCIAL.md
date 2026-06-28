# Proposta Comercial — Marketplace de Luxo Global

**Preparado para:** [Nome do Cliente]  
**Preparado por:** [Nome da Agência]  
**Data:** Junho de 2026  
**Versão:** 1.0  

---

## 1. Sumário Executivo

Apresentamos esta proposta para desenvolvimento de um **marketplace de e-commerce de luxo global**, construído sobre uma arquitetura de alta performance, segurança e escalabilidade. A solução foi projetada para atender mercados premium com experiência de compra sofisticada, suporte multi-região e conformidade com regulamentações internacionais.

O sistema é baseado em **Next.js 15** (App Router), **Shopify Storefront API**, **Redis distribuído** e uma camada robusta de segurança, observabilidade e feature flags — tudo pronto para produção desde o primeiro deploy.

---

## 2. Escopo do Projeto

### 2.1 Funcionalidades Principais

| Módulo | Descrição |
|--------|-----------|
| **Catálogo de Produtos** | Páginas de coleção e detalhe de produto com metafields de luxo (certificado blockchain, materiais, edição limitada, vídeo 360°) |
| **Carrinho de Compras** | Server Actions com invalidação atômica de cache, isolamento por `cartId`, e integração direta com Shopify Cart API |
| **Checkout** | Redirect seguro para Shopify Checkout com tracking de eventos (Klaviyo) |
| **Autenticação OAuth PKCE** | Login de clientes via Shopify Customer Account API com refresh token lock distribuído |
| **Busca de Produtos** | Endpoint com proteção contra bots (Arcjet), cache com proteção contra stampede |
| **Recomendações** | Sistema de recomendações de produtos com cache de 1 hora |
| **Wishlist** | Lista de desejos persistente com Redis e Server Actions |
| **Consent & Compliance** | Banner de consentimento GDPR/LGPD/CCPA com ledger criptográfico imutável |
| **PWA** | Service Worker, fila de sincronização offline, prompt de instalação e banner de atualização |

### 2.2 Funcionalidades Avançadas

- **Multi-Região Dinâmica**: 4 regiões (US, EU, BR, APAC) com moeda, impostos e loja Shopify independentes
- **Feature Flags**: LaunchDarkly via OpenFeature + Vercel Edge Config para kill switches e rollout gradual
- **Circuit Breaker**: Proteção contra falhas em cascata na Shopify e Redis (Cockatiel)
- **Cache Distribuído**: Redlock para locks distribuídos, stale-while-revalidate, proteção contra stampede
- **Webhooks Seguros**: Validação HMAC-SHA256, proteção contra replay (janela de 5 min), idempotência via Redis
- **Observabilidade**: OpenTelemetry traces, Sentry error capture, logs JSON estruturados com correlação de requests

---

## 3. Arquitetura Técnica

### 3.1 Stack Tecnológica

| Camada | Tecnologia |
|--------|------------|
| Framework | Next.js 15.5 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS 4, Motion |
| Backend API | Shopify Storefront GraphQL API (2026-04) |
| Cache | Upstash Redis (HTTP) / ioredis (TCP) |
| Autenticação | Shopify Customer Account API (OAuth PKCE) |
| Segurança | CSP nonces, HMAC-SHA256, Arcjet bot protection, Rate limiting |
| Observabilidade | OpenTelemetry, Sentry, logs JSON estruturados |
| Feature Flags | OpenFeature + LaunchDarkly, Vercel Edge Config |
| Marketing | Klaviyo (event tracking) |
| Compliance | Ledger de consentimento Redis, GDPR/LGPD/CCPA |
| Testes | Vitest (unit/integration), Playwright (E2E) |
| CI/CD | GitHub Actions |
| Deploy | Vercel (recomendado) |

### 3.2 Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                       Cliente (Browser)                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ Produto  │  │ Carrinho │  │  Busca   │  │ Conta    │        │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘        │
└───────┼─────────────┼─────────────┼──────────────┼──────────────┘
        │             │             │              │
┌───────▼─────────────▼─────────────▼──────────────▼──────────────┐
│                    Next.js 15 (Middleware)                        │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────┐       │
│  │ CSP +   │ │   Bot    │ │  Rate    │ │    Locale     │       │
│  │ Nonce   │ │ Protect  │ │  Limit   │ │   Routing     │       │
│  └─────────┘ └──────────┘ └──────────┘ └───────────────┘       │
└───────┬─────────────┬─────────────┬──────────────┬──────────────┘
        │             │             │              │
┌───────▼─────┐ ┌─────▼─────┐ ┌────▼─────┐ ┌──────▼──────────────┐
│   Shopify   │ │  Upstash  │ │ Feature  │ │    Compliance       │
│ Storefront  │ │   Redis   │ │  Flags   │ │    Ledger           │
│   API (×4)  │ │  (Cache)  │ │ (LD/EC)  │ │    (GDPR)           │
│ US/EU/BR/APAC│ │  + Locks  │ │          │ │                     │
└─────────────┘ └───────────┘ └──────────┘ └─────────────────────┘
```

### 3.3 Fluxo de uma Requisição

1. **Middleware** → resolve região, gera nonce CSP, aplica rate limit, verifica bots
2. **Layout** → injeta providers (Auth, Cart, Wishlist, Edge Config)
3. **Página (Server Component)** → busca dados via Shopify → cache Redis → fallback gracefully
4. **Server Actions** → validação Zod, rate limit, mutação → invalidação atômica (Redis + revalidateTag)
5. **Webhooks** → valida HMAC + timestamp → processa evento → revalida caches

---

## 4. Segurança

| Camada | Implementação |
|--------|---------------|
| **Content Security Policy** | Nonce único por request, `strict-dynamic`, domínios aprovados |
| **Webhook Validation** | HMAC-SHA256 com timing-safe comparison, janela temporal de 5 min |
| **Bot Protection** | Arcjet em rotas públicas, detecção de user-agent, rate limiting IP |
| **Autenticação** | OAuth PKCE (sem client secret no browser), refresh token lock distribuído |
| **Rate Limiting** | Redis fixed-window, 100 req/min por IP, fail-open em caso de falha |
| **Input Validation** | Zod schemas em todas as Server Actions e API Routes |
| **Headers de Segurança** | HSTS, X-Frame-Options, X-Content-Type-Options, Permissions-Policy, COOP, COEP |

---

## 5. Performance & Escalabilidade

| Métrica | Estratégia |
|---------|------------|
| **LCP < 1.2s** | `next/image` com AVIF/WebP automático, CDN Shopify, priority loading |
| **CLS = 0** | Layout estático com dimensões explícitas, `blur` placeholder |
| **Cache Hit Rate > 90%** | Stale-while-revalidate, TTLs configuráveis (5min busca, 1h recomendações) |
| **Stampede Protection** | Redlock distributed locks, single-flight pattern |
| **Graceful Degradation** | Circuit breaker abre após 3 falhas, fallback para cache Redis |
| **Serverless Ready** | Singleton Redis, pooling de conexões, `@upstash/redis` recomendado |
| **ISR** | Revalidação incremental a cada 3600s com `revalidateTag` para invalidação manual |

---

## 6. Conformidade & LGPD/GDPR/CCPA

- **Consent Ledger**: Registro imutável e append-only de consentimentos no Redis
- **Banner de Consentimento**: Componente React com aceite/recusa e persistência
- **Exportação de Dados**: Endpoint `/api/compliance/export` que coleta todo o dado do usuário
- **Direito ao Esquecimento**: Endpoint `/api/compliance/delete` com TTL de 30 dias para confirmação
- **Auditoria**: Eventos logados (consent, export, deletion, login, logout) com timestamp e IP

---

## 7. Testes & Qualidade

| Tipo | Ferramenta | Cobertura Atual |
|------|------------|-----------------|
| Unitários | Vitest | 12 arquivos |
| Integração | Vitest | 8 arquivos |
| E2E | Playwright | 5 spec files |
| Lint | ESLint + TypeScript | Strict mode |
| Build | Next.js build | CI pipeline completo |

**Métricas de Cobertura:**
- Lines: ≥ 55%
- Functions: ≥ 55%
- Branches: ≥ 50%

**CI Pipeline (GitHub Actions):**
1. ESLint
2. TypeScript type check
3. Vitest com cobertura
4. Playwright E2E smoke tests
5. Production build

---

## 8. Estrutura do Projeto

```
src/
├── app/                          # Rotas e páginas
│   ├── [locale]/                 # Internacionalização
│   │   ├── page.tsx             # Homepage (ISR)
│   │   ├── collections/         # Páginas de coleção
│   │   ├── products/            # Detalhe de produto
│   │   ├── cart/                # Carrinho
│   │   ├── search/              # Busca
│   │   ├── account/             # Conta do cliente
│   │   └── api/                 # API Routes
│   │       ├── auth/            # OAuth PKCE
│   │       ├── webhooks/        # Shopify webhooks
│   │       ├── compliance/      # GDPR/LGPD
│   │       └── search/          # Busca protegida
├── actions/                      # Server Actions
│   ├── cart.ts                  # Mutações do carrinho
│   ├── wishlist.ts              # Wishlist
│   └── auth.ts                  # Logout
├── components/
│   ├── providers/               # React Contexts
│   ├── luxury/                  # Componentes premium
│   ├── ui/                      # Componentes reutilizáveis
│   └── shared/                  # Componentes compartilhados
├── hooks/                       # Custom React hooks
├── lib/
│   ├── shopify/                 # Integração Shopify
│   ├── cache/                   # Cache distribuído
│   ├── redis/                   # Cliente Redis
│   ├── security/                # Bot protection, CSP
│   ├── compliance/              # Consent, audit
│   └── observability/           # Sentry, logs
└── __tests__/                   # Testes
    ├── unit/
    ├── integration/
    └── e2e/
```

---

## 9. Cronograma de Entrega

| Fase | Descrição | Duração |
|------|-----------|---------|
| **Fase 1** | Configuração do ambiente, Shopify stores, Redis, CI/CD | 1 semana |
| **Fase 2** | Core commerce (catálogo, produto, carrinho, checkout) | 2 semanas |
| **Fase 3** | Autenticação OAuth, conta do cliente, wishlist | 1 semana |
| **Fase 4** | Segurança (CSP, webhooks, bot protection, rate limiting) | 1 semana |
| **Fase 5** | Cache, circuit breaker, observabilidade, feature flags | 1 semana |
| **Fase 6** | Compliance (LGPD/GDPR), consent banner, auditoria | 1 semana |
| **Fase 7** | PWA, testes E2E, otimização de performance | 1 semana |
| **Fase 8** | UAT, ajustes finais, deploy em produção | 1 semana |
| **Total** | | **8 semanas** |

---

## 10. Investimento

| Item | Valor (R$) |
|------|------------|
| Desenvolvimento do Marketplace (Fases 1-7) | [INSERIR VALOR] |
| Deploy e Configuração em Produção (Fase 8) | [INSERIR VALOR] |
| Treinamento da Equipe (8h) | [INSERIR VALOR] |
| Suporte Pós-Lançamento (30 dias) | [INSERIR VALOR] |
| **Total** | **[INSERIR VALOR]** |

### Custos Recorrentes (responsabilidade do cliente)

| Serviço | Custo Estimado/mês |
|---------|-------------------|
| Vercel Pro | ~US$ 20 |
| Upstash Redis | ~US$ 10-50 |
| Sentry | US$ 0 (free tier) |
| LaunchDarkly | ~US$ 120+ |
| Shopify Plan | Conforme plano contratado |
| Klaviyo | Conforme volume |

---

## 11. Próximos Passos

1. **Aprovação desta proposta** e assinatura do contrato
2. **Kickoff meeting** alinhamento de escopo e timeline
3. **Configuração** de contas Shopify, Redis, Vercel, GitHub
4. **Desenvolvimento** seguindo as fases definidas
5. **Sprints semanais** com demonstração de progresso
6. **UAT** com a equipe do cliente
7. **Deploy** em produção
8. **Suporte** pós-lançamento

---

## 12. Sobre a Agência

[Nome da Agência] é uma agência boutique especializada em desenvolvimento de sistemas de alta performance. Nosso foco é entregar soluções robustas, seguras e escaláveis para clientes que exigem excelência técnica.

**Diferenciais:**
- Arquitetura enterprise-grade desde o primeiro dia
- Segurança como prioridade (não como feature depois)
- Testes automatizados e CI/CD completo
- Código limpo, tipado e documentado
- Suporte e manutenção contínua

---

**Contato:**  
[Nome]  
[Email]  
[Telefone]  
[Site]
