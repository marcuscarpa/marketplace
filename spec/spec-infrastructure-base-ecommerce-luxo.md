---
title: Especificação de Infraestrutura Completa - E-commerce de Luxo Global (Next.js + Shopify + Upstash Redis + Observabilidade + Segurança)
version: 2.0
date_created: 2026-06-21
last_updated: 2026-06-21
owner: Sinesi Karol Marketplace Team
tags:
  - infrastructure
  - nextjs
  - shopify
  - redis
  - testing
  - eslint
  - observability
  - security
  - compliance
  - specification
---

# Introduction

This specification defines the complete infrastructure for a global luxury e-commerce platform built on Next.js, Shopify Storefront API, Upstash Redis, Arcjet bot protection, LaunchDarkly feature flags, OpenTelemetry observability, Sentry error reporting, and GDPR/LGPD/CCPA compliance. It consolidates the technical decisions, executable sprints, testing strategy, and ESLint configuration required to implement the full system described in the project boilerplate.

The specification is organized in two phases:

1. **Base Phase** (Sprints 1-6): Project setup, multi-region Shopify client, Redis caching, catalog pages, cart mutations, search, ISR, custom ESLint rules, and automated testing.
2. **Advanced Phase** (Sprints 7-12): Customer authentication OAuth PKCE, webhook security, Arcjet bot protection, observability with OpenTelemetry and Sentry, LaunchDarkly feature flags, CSP with nonce, compliance endpoints, and third-party marketing integrations.

## 1. Purpose & Scope

### Purpose

Provide a clear, actionable, and machine-readable specification for building the complete infrastructure of the luxury e-commerce platform. The goal is to enable a development team to execute the implementation in small, testable, vertically integrated sprints covering both base and advanced capabilities.

### Scope

This specification covers:

#### Base Phase

- Project bootstrap with Next.js 15+, TypeScript strict mode, Tailwind CSS, and PostCSS.
- Custom ESLint and Prettier configuration with strict TypeScript rules.
- Multi-region resolution for `US` and `BR` markets using cookies, `Accept-Language`, and Geo-IP headers.
- Shopify Storefront API client with per-region domain and token mapping.
- Upstash Redis HTTP client for distributed caching and stampede protection.
- Server Components and API Routes for homepage, collection, product, and search pages.
- Server Action for adding items to the cart with per-`cartId` cache invalidation.
- Parser for typed Shopify metafields used in luxury product detail pages.
- Unit, integration, and end-to-end test strategy with Vitest and Playwright.
- Continuous Integration pipeline running lint, type check, tests, and build.

#### Advanced Phase

- Shopify Customer Account API OAuth PKCE authentication with distributed lock refresh tokens.
- Webhook endpoint with HMAC validation, temporal validation, and replay protection.
- Arcjet bot protection on search, auth, and public API routes.
- Content Security Policy (CSP) with per-request nonce and reporting endpoint.
- OpenTelemetry instrumentation with request correlation IDs.
- Sentry error reporting integration.
- Structured logging with `AsyncLocalStorage` context propagation.
- LaunchDarkly feature flags via OpenFeature provider.
- Vercel Edge Config for kill switches and dynamic banners.
- GDPR/LGPD/CCPA compliance endpoints: consent ledger, data export, and deletion.
- Klaviyo event tracking integration (optional but documented).
- Partial Prerendering (PPR) and dynamic third-party scripts with nonce.

### Out of Scope

The following capabilities are explicitly out of scope and reserved for future specifications:

- Mobile native applications.
- Custom payment gateways outside Shopify Checkout.
- ERP, WMS, or inventory management integrations.
- Algolia search replacement (kept as optional future enhancement).
- PWA service workers and offline support.
- Chaos engineering and advanced load testing.

### Intended Audience

Software engineers, tech leads, QA engineers, security engineers, and DevOps practitioners responsible for implementing, reviewing, or maintaining the platform.

### Assumptions

- The team has access to at least two Shopify stores (US and BR) with valid Storefront Access Tokens and Customer Account API credentials.
- An Upstash Redis database is provisioned with `REDIS_URL` and `REDIS_TOKEN` credentials.
- Vercel is the primary hosting platform with Edge Config enabled.
- Accounts are provisioned for Sentry, LaunchDarkly, Arcjet, and Klaviyo.
- Node.js >= 20.x is used for local development and CI.

## 2. Definitions

| Term | Definition |
|------|------------|
| **App Router** | Next.js routing model based on the `app/` directory, supporting Server Components and Server Actions. |
| **ISR** | Incremental Static Regeneration. Next.js strategy for updating static pages after build time without full rebuilds. |
| **PPR** | Partial Prerendering. Experimental Next.js feature that pre-renders a static shell and streams dynamic content. |
| **Server Action** | Next.js function executed on the server, callable from Client Components or forms. |
| **Server Component** | React component rendered exclusively on the server in the Next.js App Router. |
| **Storefront API** | Shopify GraphQL API for building custom storefronts, including catalog, cart, and checkout. |
| **Customer Account API** | Shopify OAuth API for customer authentication, account management, and addresses. |
| **Upstash Redis** | Managed Redis service accessible via HTTP REST API, suitable for serverless environments. |
| **Cache Stampede** | Scenario where multiple concurrent requests hit a missing cache key simultaneously, causing redundant expensive operations. |
| **Redlock** | Distributed locking algorithm used to coordinate exclusive access to shared resources across instances. |
| **Circuit Breaker** | Resilience pattern that prevents cascading failures by stopping requests to a failing dependency temporarily. |
| **CSP** | Content Security Policy. HTTP header that helps mitigate XSS and data injection attacks. |
| **Nonce** | Cryptographic random value used once, required for CSP `script-src` and `style-src` directives. |
| **HMAC** | Hash-based Message Authentication Code. Cryptographic mechanism for verifying webhook integrity. |
| **Replay Attack** | Attack where a valid webhook or request is intercepted and retransmitted maliciously. |
| **OpenFeature** | Vendor-neutral standard for feature flag evaluation. |
| **OpenTelemetry** | Observability framework for traces, metrics, and logs. |
| **GDPR** | General Data Protection Regulation (EU). |
| **LGPD** | Lei Geral de Proteção de Dados (Brazil). |
| **CCPA** | California Consumer Privacy Act (USA). |
| **LCP** | Largest Contentful Paint. Core Web Vital measuring perceived load performance. |
| **CLS** | Cumulative Layout Shift. Core Web Vital measuring visual stability. |

## 3. Requirements, Constraints & Guidelines

### Functional Requirements

#### Base

- **REQ-001**: The system must resolve the user region to `US` or `BR` based on cookie, `Accept-Language` header, Geo-IP country header, or fallback to `US`.
- **REQ-002**: The system must use the Shopify store domain and Storefront Access Token corresponding to the resolved region.
- **REQ-003**: The system must cache Shopify read operations (product, collection, search, recommendations) in Upstash Redis with a configurable TTL.
- **REQ-004**: The system must prevent cache stampedes using distributed locking or single-flight patterns.
- **REQ-005**: The system must provide Server Actions to mutate the Shopify cart.
- **REQ-006**: The system must isolate cart cache by `cartId` and invalidate it atomically after mutation.
- **REQ-007**: The system must parse Shopify metafields into a typed `LuxuryMetafields` object with safe fallback for malformed values.
- **REQ-008**: The system must render homepage, collection, product, and search pages using Server Components and ISR where appropriate.
- **REQ-009**: The system must expose a search API route that returns cached product results.
- **REQ-010**: The system must format prices in the currency associated with the resolved region.

#### Advanced

- **REQ-011**: The system must authenticate customers via Shopify Customer Account API OAuth PKCE.
- **REQ-012**: The system must refresh access tokens using a distributed lock to prevent race conditions.
- **REQ-013**: The system must validate Shopify webhooks using HMAC-SHA256 and reject events older than 5 minutes.
- **REQ-014**: The system must prevent duplicate webhook processing using `X-Shopify-Webhook-Id` idempotency stored in Redis for 24 hours.
- **REQ-015**: The system must protect public API routes against automated and headless bots using Arcjet.
- **REQ-016**: The system must generate a per-request CSP nonce and inject it into middleware, layout, and dynamic scripts.
- **REQ-017**: The system must report errors to Sentry and include request correlation context.
- **REQ-018**: The system must emit OpenTelemetry traces for HTTP requests and external service calls.
- **REQ-019**: The system must expose feature flag evaluation through LaunchDarkly via OpenFeature.
- **REQ-020**: The system must support Edge Config for dynamic banners and kill switches.
- **REQ-021**: The system must record consent decisions in a tamper-evident Redis ledger.
- **REQ-022**: The system must provide endpoints for data export and deletion subject to GDPR/LGPD/CCPA.

### Non-Functional Requirements

- **REQ-023**: The production build must pass TypeScript strict type checking without errors.
- **REQ-024**: The production build must pass ESLint without errors.
- **REQ-025**: Unit and integration tests must achieve at least 80% code coverage.
- **REQ-026**: Redis cache reads must respond in less than 50ms after the first write (warm cache).
- **REQ-027**: The application must be deployable to Vercel with environment variables only; no local file secrets in the repository.
- **REQ-028**: All environment variables required at runtime must be validated at startup, failing fast with a clear error message if missing.
- **REQ-029**: Webhook validation must complete in less than 200ms.
- **REQ-030**: Feature flag evaluation must not add more than 20ms to request latency when cached.

### Security Requirements

- **SEC-001**: Storefront Access Tokens, Redis credentials, webhook secrets, OAuth client secrets, and third-party API keys must be stored exclusively in environment variables or Vercel secrets.
- **SEC-002**: Server Actions must validate input using Zod schemas before calling Shopify.
- **SEC-003**: Cart cookies must be `httpOnly`, `secure` in production, `sameSite='lax'`, and limited to the root path.
- **SEC-004**: API routes must validate query parameters and reject malformed requests with appropriate HTTP status codes.
- **SEC-005**: OAuth state and PKCE code verifier must be stored in `httpOnly` cookies and validated on callback.
- **SEC-006**: Webhook endpoints must reject requests with invalid HMAC or expired timestamps.
- **SEC-007**: CSP must restrict `script-src`, `style-src`, `connect-src`, and `img-src` to approved domains.
- **SEC-008**: Sensitive logs must not include tokens, passwords, or full credit card data.
- **SEC-009**: Rate limiting must be applied to public routes including login, register, search, and webhooks.

### Constraints

- **CON-001**: The implementation must use `@upstash/redis` HTTP client instead of TCP-based Redis clients to avoid connection pool issues in serverless environments.
- **CON-002**: The implementation must target Next.js 15+ and React 19+.
- **CON-003**: The implementation must not depend on Cloudflare or Cloudinary.
- **CON-004**: The implementation must support `US` and `BR` regions in the first phase; `EU` and `APAC` are reserved for future expansion.
- **CON-005**: The implementation must keep all services inside the Next.js monolith unless explicitly moved out in a future specification.
- **CON-006**: The implementation must use the Shopify Customer Account API for authentication, not NextAuth or custom JWT.

### Guidelines

- **GUD-001**: Prefer Server Components over Client Components for data fetching.
- **GUD-002**: Co-locate GraphQL queries with their consumers in `lib/shopify/queries.ts`.
- **GUD-003**: Use `zod` for all runtime input validation.
- **GUD-004**: Use `revalidateTag` and Redis `del` together for cache invalidation after mutations.
- **GUD-005**: Keep components in `components/` organized by `ui/`, `shared/`, and `luxury/` responsibilities.
- **GUD-006**: Write tests alongside implementation code within the same sprint.
- **GUD-007**: Instrument all Server Actions and API Routes with correlation IDs.
- **GUD-008**: Use feature flags to gate new features and kill switches for critical paths.
- **GUD-009**: Log security events (login, logout, consent, deletion) in structured format.

### Patterns

- **PAT-001**: Use a singleton pattern for the Upstash Redis client instance.
- **PAT-002**: Use a factory function `getShopifyClient(locale)` to return a region-aware Shopify client.
- **PAT-003**: Use `getCachedOrFetch` for all read-through cache operations.
- **PAT-004**: Use `withLock` or single-flight logic to prevent cache stampedes.
- **PAT-005**: Use typed metafield parsing with namespace-aware keys and defensive JSON parsing.
- **PAT-006**: Use the Circuit Breaker pattern for Shopify and Redis calls.
- **PAT-007**: Use middleware for CSP nonce generation, region resolution, and rate limiting.
- **PAT-008**: Use OpenFeature abstraction for all feature flag checks.

## 4. Interfaces & Data Contracts

### Region Contract

```ts
// src/lib/regions.ts
export interface Region {
  code: 'US' | 'BR';
  locale: string;
  currency: 'USD' | 'BRL';
  shopifyDomain: string;
  shopifyStorefrontToken: string;
  taxRate: number;
  defaultLanguage: string;
}
```

### Shopify Client Contract

```ts
// src/lib/shopify/client.ts
export interface ShopifyClient {
  execute<T>(
    query: string,
    variables?: Record<string, unknown>,
    options?: { cacheKey?: string; ttl?: number }
  ): Promise<T>;
}

export declare function getShopifyClient(locale: string): ShopifyClient;
```

### Metafields Contract

```ts
// src/lib/shopify/types.ts
export interface LuxuryMetafields {
  certificateHash?: string;
  materials?: string[];
  madeIn?: string;
  video360Url?: string;
  limitedEditionNumber?: number;
  careInstructions?: string;
  averageRating?: number;
  totalReviews?: number;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  vendor: string;
  images: { nodes: Array<{ url: string; altText: string | null }> };
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
  };
  variants: {
    nodes: Array<{ id: string; price: { amount: string } }>;
  };
  metafields: Array<{
    namespace: string;
    key: string;
    value: string;
    type: string;
  }>;
}
```

### Cart Server Action Contract

```ts
// src/actions/cart.ts
export interface CartActionState {
  success: boolean;
  message: string;
  cart?: {
    id: string;
    totalQuantity: number;
    cost?: {
      totalAmount: { amount: string; currencyCode: string };
    };
  };
}

export declare function addToCartAction(
  prevState: CartActionState,
  formData: FormData
): Promise<CartActionState>;
```

### Search API Contract

- **Endpoint**: `GET /[locale]/api/search?q={query}`
- **Success Response** (`200 OK`):
  ```json
  {
    "results": [
      {
        "id": "gid://shopify/Product/123456",
        "title": "Silk Evening Gown",
        "handle": "silk-evening-gown",
        "priceRange": {
          "minVariantPrice": { "amount": "1200.00", "currencyCode": "USD" }
        }
      }
    ]
  }
  ```
- **Error Response** (`400 Bad Request`):
  ```json
  { "error": "Query must be at least 2 characters" }
  ```

### Webhook Contract

- **Endpoint**: `POST /[locale]/api/webhooks`
- **Required Headers**:
  - `X-Shopify-Hmac-Sha256`: Base64 HMAC-SHA256 of the raw body.
  - `X-Shopify-Triggered-At`: ISO 8601 timestamp of event trigger.
  - `X-Shopify-Topic`: Event topic (e.g., `products/update`).
  - `X-Shopify-Webhook-Id`: Unique webhook identifier.
- **Success Response** (`200 OK`): `{ "received": true }`
- **Error Responses**:
  - `401 Unauthorized`: Missing or invalid HMAC.
  - `403 Forbidden`: Event expired (replay protection).
  - `409 Conflict`: Duplicate webhook ID.

### Compliance API Contracts

- **Consent Recording**: `POST /[locale]/api/compliance/consent`
  - Body: `{ "userId": string, "consent": boolean, "version": string }`
  - Response: `{ "recorded": true }`
- **Data Export**: `GET /[locale]/api/compliance/export?userId={userId}`
  - Response: `{ "data": object, "exportedAt": string }`
- **Data Deletion**: `POST /[locale]/api/compliance/delete`
  - Body: `{ "userId": string }`
  - Response: `{ "deleted": true, "requestId": string }`

### Environment Variables Contract

| Variable | Phase | Required | Description |
|----------|-------|----------|-------------|
| `SHOPIFY_STORE_DOMAIN_US` | Base | Yes | Shopify store domain for US region. |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN_US` | Base | Yes | Storefront access token for US region. |
| `SHOPIFY_STORE_DOMAIN_BR` | Base | Yes | Shopify store domain for BR region. |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN_BR` | Base | Yes | Storefront access token for BR region. |
| `REDIS_URL` | Base | Yes | Upstash Redis REST API URL. |
| `REDIS_TOKEN` | Base | Yes | Upstash Redis REST API token. |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | Base | No | Fallback locale string. Default: `en`. |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | Base | No | Google Analytics 4 measurement ID. |
| `SHOPIFY_CLIENT_ID` | Advanced | Yes | Customer Account API client ID. |
| `SHOPIFY_CLIENT_SECRET` | Advanced | Yes | Customer Account API client secret. |
| `SHOPIFY_WEBHOOK_SECRET` | Advanced | Yes | Secret for validating Shopify webhook HMAC. |
| `REDIS_PUBSUB_CHANNEL` | Advanced | No | Redis Pub/Sub channel for cache invalidation. Default: `cache:invalidate`. |
| `ARCJET_KEY` | Advanced | Yes | Arcjet API key for bot protection. |
| `SENTRY_DSN` | Advanced | Yes | Sentry project DSN. |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | Advanced | No | OpenTelemetry collector endpoint. |
| `LAUNCHDARKLY_SDK_KEY` | Advanced | Yes | LaunchDarkly server-side SDK key. |
| `EDGE_CONFIG_ID` | Advanced | No | Vercel Edge Config connection string. |
| `KLAVIYO_PUBLIC_API_KEY` | Advanced | No | Klaviyo public API key for client-side events. |

## 5. Acceptance Criteria

### Base

- **AC-001**: Given a request with no region cookie and `Accept-Language: pt-BR`, when `resolveRegion` is called, then it returns the `BR` region configuration.
- **AC-002**: Given a request with cookie `region=us`, when `resolveRegion` is called, then it returns the `US` region configuration regardless of Geo-IP.
- **AC-003**: Given a missing required environment variable, when the application starts, then it throws a clear error naming the missing variable before accepting traffic.
- **AC-004**: Given a product query with a valid `cacheKey`, when `getShopifyClient('en').execute` is called twice, then the second call returns cached data from Redis without calling Shopify.
- **AC-005**: Given a cache miss on a popular key, when 100 concurrent requests arrive, then only one request fetches data from Shopify and the remaining 99 wait and receive the cached result.
- **AC-006**: Given a valid `variantId` and `quantity`, when `addToCartAction` is executed, then a cart is created if absent, the item is added, and the Redis key `cart:{cartId}` is deleted.
- **AC-007**: Given a product with metafields `luxury.materials` as a JSON string array, when `parseLuxuryMetafields` is called, then it returns `materials` as a string array.
- **AC-008**: Given a product with metafield `luxury.materials` as a plain string, when `parseLuxuryMetafields` is called, then it returns `materials` as a single-element array.
- **AC-009**: Given the search endpoint receives a query shorter than 2 characters, when the request is processed, then it returns `400 Bad Request`.
- **AC-010**: Given a product page is rendered, when the response is inspected, then it contains the parsed `LuxuryMetafields` data and formatted regional price.
- **AC-011**: Given the test suite runs in CI, when all tests complete, then coverage is reported and must be at least 80%.
- **AC-012**: Given the CI pipeline runs, when lint, type check, tests, and build steps execute, then all steps pass without warnings treated as errors.

### Advanced

- **AC-013**: Given a customer initiates OAuth login, when the authorize route is called, then it generates a PKCE verifier and redirects to Shopify with valid state.
- **AC-014**: Given a valid OAuth callback, when the callback route processes the code, then it exchanges it for access and refresh tokens and sets secure `httpOnly` cookies.
- **AC-015**: Given an expired access token and multiple concurrent requests, when the refresh route is called, then only one request renews the token and the others receive the cached fresh token.
- **AC-016**: Given a Shopify webhook with an invalid HMAC, when it is received, then the endpoint returns `401 Unauthorized` without processing the payload.
- **AC-017**: Given a Shopify webhook triggered more than 5 minutes ago, when it is received, then the endpoint returns `403 Forbidden`.
- **AC-018**: Given a duplicate webhook ID, when it is received within 24 hours, then the endpoint returns `409 Conflict`.
- **AC-019**: Given a bot request to the search API, when Arcjet evaluates it, then the request is denied with `403 Forbidden`.
- **AC-020**: Given a request to any page, when the middleware runs, then the response includes a CSP header with a unique nonce and reporting endpoint.
- **AC-021**: Given an unhandled error in a Server Action, when it occurs, then Sentry captures the error with request context and correlation ID.
- **AC-022**: Given a feature flag check for a known key, when the application evaluates it, then it returns the value from LaunchDarkly via OpenFeature.
- **AC-023**: Given a user consents to tracking, when the consent endpoint records it, then an immutable entry is appended to the Redis ledger.
- **AC-024**: Given a valid data deletion request, when the delete endpoint processes it, then it returns a request ID and schedules deletion within 30 days.

## 6. Test Automation Strategy

### Test Levels

1. **Unit Tests**: Fast, isolated tests for pure functions and utilities.
   - Examples: `resolveRegion`, `parseLuxuryMetafields`, `getRegion`, Zod schemas, HMAC validation, consent ledger formatting.
2. **Integration Tests**: Tests that exercise external dependencies using mocks or sandbox credentials.
   - Examples: `getShopifyClient` with mocked Shopify responses, Redis cache read/write, `getCachedOrFetch` stampede behavior, Arcjet decision mocking, feature flag evaluation mocking, webhook validation.
3. **End-to-End Tests**: Playwright tests verifying critical user journeys in a real browser.
   - Examples: homepage loads, product page displays, search returns results, add-to-cart updates cart count, OAuth login redirect, consent banner interaction.

### Frameworks

- **Vitest**: Unit and integration testing framework with TypeScript support, coverage via `@vitest/coverage-v8`.
- **Playwright**: End-to-end testing framework for browser automation.
- **MSW (Mock Service Worker)**: Optional for mocking Shopify GraphQL and external HTTP requests in tests.
- **@vitest/coverage-v8**: Code coverage collection and reporting.

### Test Data Management

- Use mocked Shopify GraphQL responses stored in `__tests__/fixtures/`.
- Use a separate Upstash Redis database or isolated key prefix (`test:`) for integration tests.
- Clean up Redis keys after each integration test using `afterEach`.
- Do not use production credentials in tests; use environment-specific values or mocks.
- Mock external APIs (Arcjet, LaunchDarkly, Sentry, Klaviyo) in unit and integration tests.

### CI/CD Integration

- GitHub Actions workflow triggered on push and pull requests.
- Pipeline steps:
  1. Checkout code.
  2. Install dependencies with `npm ci`.
  3. Run ESLint.
  4. Run TypeScript type check (`tsc --noEmit`).
  5. Run Vitest with coverage (`npm run test:coverage`).
  6. Run Playwright smoke tests (`npm run test:e2e`).
  7. Build the application (`npm run build`).
- Fail the pipeline if coverage is below 80% or if any lint/type/test/build step fails.

### Coverage Requirements

- Minimum 80% line coverage across the codebase.
- Minimum 80% function coverage.
- Minimum 70% branch coverage (encouraged, not blocking).
- Coverage reports uploaded as artifacts in CI.

### Performance Testing

- Not required in the base phase.
- Future work: add Lighthouse CI or k6 load tests for homepage and product pages.

### Test File Conventions

- Unit tests: `__tests__/unit/**/*.test.ts`.
- Integration tests: `__tests__/integration/**/*.test.ts`.
- E2E tests: `__tests__/e2e/**/*.spec.ts`.
- Test utilities and fixtures: `__tests__/helpers/` and `__tests__/fixtures/`.

## 7. Rationale & Context

### Why Next.js 15+ App Router

The App Router enables Server Components to fetch data directly from Shopify and Redis without exposing credentials or increasing client bundle size. It also provides Server Actions for cart mutations with minimal client-side complexity.

### Why Upstash Redis HTTP Client

Serverless environments create and destroy function instances rapidly. TCP-based Redis clients such as `ioredis` can exhaust connection limits under load. `@upstash/redis` uses stateless HTTP requests, eliminating connection pool management and cold-start connection overhead.

### Why Multi-Region from the Start

Region resolution affects currency, pricing, tax display, and Shopify store selection. Implementing this early avoids expensive refactoring later and ensures the data layer is designed with region awareness.

### Why Cache Stampede Protection

Product detail and search pages are high-traffic. Without single-flight protection, a cache miss can trigger dozens of identical Shopify requests, increasing latency and cost. Distributed locking or in-process single-flight prevents this.

### Why Strict ESLint and TypeScript

A luxury e-commerce platform must be reliable. Strict type checking and lint rules catch common errors at build time, reduce runtime bugs, and enforce consistent code style across the team.

### Why Advanced Services Are Included

Authentication, observability, bot protection, and compliance are cross-cutting requirements for a production luxury platform. Including them in the specification ensures the architecture supports them from the start, even though they are implemented in later sprints after the base commerce loop is validated.

## 8. Dependencies & External Integrations

### External Systems

- **EXT-001: Shopify Storefront API** — Provides catalog, cart, checkout, and customer data via GraphQL. Integration type: HTTPS/GraphQL.
- **EXT-002: Shopify Customer Account API** — Provides OAuth PKCE authentication and customer data. Integration type: HTTPS/OAuth 2.0.
- **EXT-003: Upstash Redis** — Provides managed Redis over HTTP for caching, locking, sessions, and temporary storage. Integration type: HTTPS/REST.

### Third-Party Services

- **SVC-001: Vercel** — Hosting platform for Next.js with serverless functions, edge network, environment variable management, and Edge Config. Required capabilities: automatic deployments, preview environments, serverless function support, Edge Config.
- **SVC-002: Sentry** — Error tracking and performance monitoring. Required capabilities: Next.js SDK, source maps, release tracking.
- **SVC-003: LaunchDarkly** — Feature flag management. Required capabilities: server-side Node.js SDK, boolean flag evaluation.
- **SVC-004: Arcjet** — Bot protection and rate limiting. Required capabilities: Next.js SDK, bot protection rules.
- **SVC-005: Klaviyo** — Marketing automation and event tracking. Required capabilities: client-side identify and track events.

### Infrastructure Dependencies

- **INF-001: Node.js Runtime >= 20.x** — Required for modern JavaScript features and Next.js 15 compatibility.
- **INF-002: GitHub Repository** — Required for source control and CI/CD pipeline execution.
- **INF-003: GitHub Actions Runners** — Required for automated lint, test, and build workflows.

### Data Dependencies

- **DAT-001: Shopify Product Data** — Products, variants, collections, images, and metafields. Format: GraphQL. Access: Storefront Access Token.
- **DAT-002: Regional Configuration** — Static mapping of regions to domains, currencies, and tokens. Format: TypeScript constants or environment variables.
- **DAT-003: Customer Data** — Customer profiles, addresses, and orders. Format: GraphQL/OAuth. Access: Customer Account API.

### Technology Platform Dependencies

- **PLT-001: Next.js 15+** — React framework with App Router, Server Components, and Server Actions.
- **PLT-002: React 19+** — UI library.
- **PLT-003: TypeScript 5+** — Typed JavaScript with strict mode enabled.
- **PLT-004: Tailwind CSS 3.4+** — Utility-first CSS framework.
- **PLT-005: OpenTelemetry** — Observability framework for traces and metrics.
- **PLT-006: OpenFeature** — Vendor-neutral feature flag abstraction.

### Compliance Dependencies

- **COM-001: GDPR** — EU data protection regulation. Impact: consent ledger, data export, right to erasure.
- **COM-002: LGPD** — Brazilian data protection law. Impact: consent ledger, data export, right to erasure.
- **COM-003: CCPA** — California consumer privacy act. Impact: data export, right to deletion.

## 9. Examples & Edge Cases

### Region Resolution Example

```ts
// Given request headers:
// Cookie: region=br
// Accept-Language: en-US
// x-vercel-ip-country: US

const region = resolveRegion(request);
// region.code === 'BR' because cookie takes precedence.
```

### Cache Stampede Protection Example

```ts
// src/lib/cache/stampede.ts
export async function getCachedOrFetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl = 3600
): Promise<T> {
  const redis = getRedisClient();

  const cached = await redis.get<string>(key);
  if (cached) {
    const parsed = JSON.parse(cached) as { data: T; _expires: number };
    if (parsed._expires < Date.now()) {
      // Stale-while-revalidate: refresh in background
      refreshCache(key, fetchFn, ttl).catch(console.error);
    }
    return parsed.data;
  }

  return withLock(key, async () => {
    const doubleCheck = await redis.get<string>(key);
    if (doubleCheck) return JSON.parse(doubleCheck).data as T;

    const data = await fetchFn();
    await redis.set(
      key,
      JSON.stringify({ data, _expires: Date.now() + ttl * 1000 }),
      { ex: ttl }
    );
    return data;
  });
}
```

### Cart Cache Invalidation Example

```ts
// Inside addToCartAction after successful mutation
revalidateTag('cart');
const cartCacheKey = `cart:${cartId}`;
await redis.del(cartCacheKey).catch((err) => {
  logger.warn('Failed to clear cart Redis cache', { cartId, error: err });
});
```

### Metafield Parsing Edge Cases

| Input Metafield | Expected Output |
|-----------------|-----------------|
| `luxury.materials` = `["Silk", "Cashmere"]` | `materials: ["Silk", "Cashmere"]` |
| `luxury.materials` = `"Leather"` | `materials: ["Leather"]` |
| `luxury.materials` = `"["invalid json"` | `materials: ["["invalid json"]`, log warning |
| `luxury.limited_edition_number` = `"42"` | `limitedEditionNumber: 42` |
| `luxury.limited_edition_number` = `"abc"` | `limitedEditionNumber: undefined`, log warning |
| `reviews.average_rating` = `"4.7"` | `averageRating: 4.7` |
| `reviews.average_rating` = `"6.0"` | `averageRating: undefined`, log warning |

### ESLint Configuration Example

```js
// eslint.config.mjs
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

export default tseslint.config(
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: { project: './tsconfig.json' },
    },
    rules: {
      '@typescript-eslint/strict-boolean-expressions': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'no-console': ['warn', { allow: ['error'] }],
      eqeqeq: ['error', 'always'],
    },
  }
);
```

### Environment Validation Example

```ts
// src/lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  SHOPIFY_STORE_DOMAIN_US: z.string().min(1),
  SHOPIFY_STOREFRONT_ACCESS_TOKEN_US: z.string().min(1),
  SHOPIFY_STORE_DOMAIN_BR: z.string().min(1),
  SHOPIFY_STOREFRONT_ACCESS_TOKEN_BR: z.string().min(1),
  REDIS_URL: z.string().url(),
  REDIS_TOKEN: z.string().min(1),
  NEXT_PUBLIC_DEFAULT_LOCALE: z.string().default('en'),
  SHOPIFY_CLIENT_ID: z.string().min(1),
  SHOPIFY_CLIENT_SECRET: z.string().min(1),
  SHOPIFY_WEBHOOK_SECRET: z.string().min(1),
  ARCJET_KEY: z.string().min(1),
  SENTRY_DSN: z.string().min(1),
  LAUNCHDARKLY_SDK_KEY: z.string().min(1),
  EDGE_CONFIG_ID: z.string().optional(),
  KLAVIYO_PUBLIC_API_KEY: z.string().optional(),
});

export const env = envSchema.parse(process.env);
```

### Webhook Validation Example

```ts
// src/app/[locale]/api/webhooks/route.ts
const generatedHash = crypto
  .createHmac('sha256', process.env.SHOPIFY_WEBHOOK_SECRET)
  .update(rawBody, 'utf8')
  .digest('base64');

const receivedBuffer = Buffer.from(hmacHeader, 'base64');
const expectedBuffer = Buffer.from(generatedHash, 'base64');

if (
  receivedBuffer.length !== expectedBuffer.length ||
  !crypto.timingSafeEqual(receivedBuffer, expectedBuffer)
) {
  return NextResponse.json({ error: 'Invalid HMAC' }, { status: 401 });
}
```

### Feature Flag Evaluation Example

```ts
// src/lib/feature-flags.ts
import { OpenFeature } from '@openfeature/server-sdk';
import { LaunchDarklyProvider } from '@openfeature/launchdarkly-provider';

let initialized = false;

export async function initFeatureFlags() {
  if (initialized) return;
  const provider = new LaunchDarklyProvider(process.env.LAUNCHDARKLY_SDK_KEY);
  await OpenFeature.setProvider(provider);
  initialized = true;
}

export async function getFeatureFlag(
  key: string,
  context: Record<string, unknown>
) {
  if (!initialized) await initFeatureFlags();
  const client = OpenFeature.getClient();
  return client.getBooleanValue(key, false, context);
}
```

## 10. Validation Criteria

The implementation is considered compliant with this specification when:

- **VAL-001**: All files listed in the sprint table are created and committed.
- **VAL-002**: `npm run lint` executes without errors.
- **VAL-003**: `npm run typecheck` executes without errors.
- **VAL-004**: `npm run test:coverage` reports line coverage >= 80% and function coverage >= 80%.
- **VAL-005**: `npm run test:e2e` executes without failures against a local or preview deployment.
- **VAL-006**: `npm run build` produces a successful production build.
- **VAL-007**: The application resolves regions correctly for `US` and `BR`.
- **VAL-008**: The application reads from and writes to Upstash Redis successfully.
- **VAL-009**: The application creates a Shopify cart and adds a line item through the Server Action.
- **VAL-010**: The application renders product detail pages with parsed luxury metafields.
- **VAL-011**: The search API returns results and respects minimum query length.
- **VAL-012**: OAuth login redirects to Shopify and callback exchanges tokens correctly.
- **VAL-013**: Token refresh uses distributed locking and avoids duplicate token exchanges.
- **VAL-014**: Webhook endpoint rejects invalid HMAC, expired events, and duplicate IDs.
- **VAL-015**: Arcjet blocks automated/headless requests to protected routes.
- **VAL-016**: CSP header contains a unique nonce and reporting endpoint on every response.
- **VAL-017**: Sentry captures unhandled errors with correlation context.
- **VAL-018**: OpenTelemetry traces are emitted for HTTP requests and external calls.
- **VAL-019**: Feature flags evaluate correctly via OpenFeature/LaunchDarkly.
- **VAL-020**: Consent ledger records decisions immutably in Redis.
- **VAL-021**: Compliance export and deletion endpoints return valid responses.

## 11. Related Specifications / Further Reading

- [Boilerplate Sinesia Karol Marketplace (5).md](../Boilerplate%20Sinesia%20Karol%20Marketplace%20(5).md) — Source architectural manifesto for the full platform.
- [Next.js Documentation](https://nextjs.org/docs) — Framework reference.
- [Shopify Storefront API Reference](https://shopify.dev/docs/api/storefront) — GraphQL schema and operations.
- [Shopify Customer Account API Reference](https://shopify.dev/docs/api/customer) — OAuth and customer operations.
- [Upstash Redis REST API](https://upstash.com/docs/redis/features/restapi) — HTTP client documentation.
- [Vitest Documentation](https://vitest.dev/) — Testing framework reference.
- [Playwright Documentation](https://playwright.dev/) — End-to-end testing reference.
- [Arcjet Next.js Documentation](https://docs.arcjet.com/reference/nextjs) — Bot protection reference.
- [LaunchDarkly Node.js SDK](https://docs.launchdarkly.com/sdk/server-side/node-js) — Feature flag reference.
- [OpenFeature Node.js SDK](https://openfeature.dev/docs/reference/technologies/server/javascript/) — Feature flag abstraction reference.
- [Sentry Next.js Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/) — Error tracking reference.
- [OpenTelemetry Node.js Documentation](https://opentelemetry.io/docs/instrumentation/js/getting-started/nodejs/) — Observability reference.

---

# Appendices

## Appendix A — Executable Sprints Detail

### Sprint 1: Project Setup and Tooling

**Goal**: Establish the repository foundation with strict quality gates.

**Tasks**:
1. Initialize Next.js 15 project with TypeScript, Tailwind CSS, and App Router.
2. Configure `next.config.ts` with image optimization for `cdn.shopify.com`.
3. Install base dependencies:
   - Production: `@upstash/redis`, `@shopify/storefront-api-client`, `graphql`, `graphql-request`, `zod`, `motion`, `js-cookie`.
   - Development: `typescript`, `vitest`, `@vitest/coverage-v8`, `@playwright/test`, `@types/node`, `@types/react`, `@types/react-dom`, `@types/js-cookie`, `tsx`.
4. Configure ESLint with Next.js core-web-vitals, TypeScript strict rules, `import/order`, `no-console`, and `@typescript-eslint/strict-boolean-expressions`.
5. Configure Prettier and integrate with ESLint.
6. Add npm scripts: `lint`, `typecheck`, `test`, `test:coverage`, `test:e2e`, `build`.
7. Create empty test files so the initial CI passes.
8. Create GitHub Actions workflow for CI.

**Deliverables**:
- `next.config.ts`
- `package.json` with scripts and dependencies
- `eslint.config.mjs`
- `.prettierrc`
- `tsconfig.json` (strict mode)
- `.github/workflows/ci.yml`
- `__tests__/unit/example.test.ts` (passing)

**Definition of Done**:
- `npm run lint` passes.
- `npm run typecheck` passes.
- `npm run test` passes.
- CI workflow is green on the main branch.

---

### Sprint 2: Multi-Region Shopify Client and Redis Cache

**Goal**: Connect to Shopify and Redis with region awareness and caching.

**Tasks**:
1. Implement `src/lib/env.ts` with Zod validation of required base environment variables.
2. Implement `src/lib/regions.ts` with `Region` interface, region map for `US` and `BR`, and `resolveRegion` function.
3. Implement `src/lib/redis/client.ts` with singleton `@upstash/redis` client.
4. Implement `src/lib/cache/lock.ts` with distributed locking using Redis `SET NX`.
5. Implement `src/lib/cache/stampede.ts` with `getCachedOrFetch` using single-flight and stale-while-revalidate.
6. Implement `src/lib/shopify/client.ts` with `getShopifyClient(locale)` and `execute<T>` method.
7. Define `src/lib/shopify/types.ts` with `ShopifyProduct`, `LuxuryMetafields`, and related types.
8. Add base GraphQL queries in `src/lib/shopify/queries.ts` for product, collection, search, and recommendations.

**Deliverables**:
- `src/lib/env.ts`
- `src/lib/regions.ts`
- `src/lib/redis/client.ts`
- `src/lib/cache/lock.ts`
- `src/lib/cache/stampede.ts`
- `src/lib/shopify/client.ts`
- `src/lib/shopify/types.ts`
- `src/lib/shopify/queries.ts`

**Definition of Done**:
- Unit tests for `resolveRegion` and `getRegion` pass.
- Integration tests confirm Redis read/write and cache hit behavior.
- Shopify client returns mocked data and caches it in Redis.
- Coverage remains >= 80%.

---

### Sprint 3: Catalog Pages and Metafield Parsing

**Goal**: Render homepage, collection, and product pages with real Shopify data.

**Tasks**:
1. Implement `src/lib/shopify/metafields.ts` with `parseLuxuryMetafields`.
2. Implement `src/lib/shopify/loader.ts` for data fetching helpers.
3. Create `src/app/[locale]/layout.tsx` with root layout and providers.
4. Create `src/app/[locale]/page.tsx` as homepage with ISR revalidation.
5. Create `src/app/[locale]/collections/[handle]/page.tsx`.
6. Create `src/app/[locale]/products/[handle]/page.tsx` and pass enriched product to detail component.
7. Create `src/components/luxury/product-details-luxury.tsx`.
8. Create `src/components/shared/motion-next-image.tsx`.
9. Create `src/components/ui/product-card.tsx`.

**Deliverables**:
- `src/lib/shopify/metafields.ts`
- `src/lib/shopify/loader.ts`
- `src/app/[locale]/layout.tsx`
- `src/app/[locale]/page.tsx`
- `src/app/[locale]/collections/[handle]/page.tsx`
- `src/app/[locale]/products/[handle]/page.tsx`
- `src/components/luxury/product-details-luxury.tsx`
- `src/components/shared/motion-next-image.tsx`
- `src/components/ui/product-card.tsx`

**Definition of Done**:
- Product pages render with parsed metafields.
- Collection pages list products.
- Homepage displays featured collections or products.
- Metafield parser unit tests cover all edge cases.

---

### Sprint 4: Cart Server Action and Cache Isolation

**Goal**: Enable add-to-cart functionality with secure cookies and cache invalidation.

**Tasks**:
1. Implement `src/actions/cart.ts` with `addToCartAction`.
2. Validate input with Zod schema requiring valid Shopify ProductVariant GID and quantity between 1 and 99.
3. Create a new cart via `cartCreate` mutation if no `shopify_cart_id` cookie exists.
4. Add line items via `cartLinesAdd` mutation.
5. Set `shopify_cart_id` cookie with secure flags.
6. Invalidate Next.js cache tag `cart` and delete Redis key `cart:{cartId}`.
7. Create `src/components/luxury/add-to-cart-button.tsx`.
8. Create `src/components/providers/cart-provider.tsx`.

**Deliverables**:
- `src/actions/cart.ts`
- `src/components/luxury/add-to-cart-button.tsx`
- `src/components/providers/cart-provider.tsx`
- `src/app/[locale]/cart/page.tsx`

**Definition of Done**:
- Add-to-cart action creates cart and adds item successfully.
- Cart cache key is deleted after mutation.
- Cart page displays current cart contents.
- Integration tests verify cart flow with mocked Shopify responses.

---

### Sprint 5: Search, Recommendations, and ISR

**Goal**: Implement search functionality and refine caching/revalidation strategy.

**Tasks**:
1. Implement `src/lib/shopify/search.ts` using `getCachedOrFetch`.
2. Implement `src/lib/shopify/recommendations.ts` using `getCachedOrFetch`.
3. Create `src/app/[locale]/search/page.tsx`.
4. Create `src/app/[locale]/api/search/route.ts`.
5. Add `revalidateTag` helpers in `src/lib/shopify/cache.ts`.
6. Configure ISR on homepage and collection pages with `export const revalidate = 3600`.
7. Add product recommendations component on product detail page.

**Deliverables**:
- `src/lib/shopify/search.ts`
- `src/lib/shopify/recommendations.ts`
- `src/lib/shopify/cache.ts`
- `src/app/[locale]/search/page.tsx`
- `src/app/[locale]/api/search/route.ts`
- `src/components/ui/product-recommendations.tsx`
- `src/components/ui/search-bar.tsx`

**Definition of Done**:
- Search page and API return results for queries with 2+ characters.
- Recommendations appear on product pages.
- ISR pages rebuild automatically at the configured interval.
- Search has integration tests with mocked Shopify data.

---

### Sprint 6: End-to-End Tests, Coverage, and CI Polish

**Goal**: Ensure the entire base is production-ready and continuously validated.

**Tasks**:
1. Write Playwright smoke tests for homepage, product page, search, and add-to-cart.
2. Configure Playwright to run against `next dev` and Vercel preview deployments.
3. Ensure Vitest coverage reaches 80% line and function coverage.
4. Add coverage badge or report artifact in CI.
5. Validate production build with `npm run build`.
6. Review and fix any remaining ESLint warnings.
7. Document local development instructions in `README.md`.

**Deliverables**:
- `__tests__/e2e/home.spec.ts`
- `__tests__/e2e/product.spec.ts`
- `__tests__/e2e/search.spec.ts`
- `__tests__/e2e/cart.spec.ts`
- Updated `README.md`
- Finalized `.github/workflows/ci.yml`

**Definition of Done**:
- `npm run test:coverage` reports >= 80% coverage.
- `npm run test:e2e` passes locally and in CI.
- `npm run build` succeeds.
- CI is green on the main branch.
- README contains setup and run instructions.

---

### Sprint 7: Customer Authentication OAuth PKCE

**Goal**: Enable customer login and account management via Shopify Customer Account API.

**Tasks**:
1. Update `src/lib/env.ts` to validate OAuth credentials.
2. Implement `src/app/[locale]/api/auth/oauth/authorize/route.ts` to generate PKCE verifier and redirect to Shopify.
3. Implement `src/app/[locale]/api/auth/oauth/callback/route.ts` to exchange code for tokens.
4. Implement `src/app/[locale]/api/auth/refresh/route.ts` with Redlock to prevent token refresh race conditions.
5. Create `src/components/providers/auth-provider.tsx`.
6. Create `src/app/[locale]/account/page.tsx` and `src/app/[locale]/account/login/page.tsx`.
7. Store tokens in secure `httpOnly` cookies.

**Deliverables**:
- `src/app/[locale]/api/auth/oauth/authorize/route.ts`
- `src/app/[locale]/api/auth/oauth/callback/route.ts`
- `src/app/[locale]/api/auth/refresh/route.ts`
- `src/components/providers/auth-provider.tsx`
- `src/app/[locale]/account/page.tsx`
- `src/app/[locale]/account/login/page.tsx`
- `src/actions/auth.ts`

**Definition of Done**:
- Login redirects to Shopify OAuth.
- Callback exchanges code and sets cookies.
- Refresh route uses distributed lock.
- Integration tests mock OAuth flow.

---

### Sprint 8: Webhook Security and Cache Revalidation

**Goal**: Securely process Shopify webhooks and invalidate caches.

**Tasks**:
1. Implement `src/app/[locale]/api/webhooks/route.ts` with HMAC validation.
2. Add timestamp validation (`X-Shopify-Triggered-At`) with 5-minute tolerance.
3. Add idempotency check using `X-Shopify-Webhook-Id` stored in Redis for 24 hours.
4. Implement `src/lib/shopify/cache.ts` revalidation helpers (`revalidateProducts`, `revalidateCollections`).
5. Publish cache invalidation events to Redis Pub/Sub channel.
6. Write integration tests with valid and invalid webhook payloads.

**Deliverables**:
- `src/app/[locale]/api/webhooks/route.ts`
- `src/lib/shopify/cache.ts`
- Webhook test fixtures and helpers

**Definition of Done**:
- Valid webhooks are processed and trigger cache revalidation.
- Invalid HMAC, expired timestamps, and duplicate IDs are rejected.
- Integration tests cover all rejection paths.

---

### Sprint 9: Bot Protection, CSP, and Middleware Hardening

**Goal**: Protect public routes and enforce security headers.

**Tasks**:
1. Update `src/middleware.ts` to generate per-request nonce, apply CSP, and inject correlation headers.
2. Configure CSP with approved domains for scripts, styles, images, and connections.
3. Add rate limiting to public routes using Upstash or Vercel KV.
4. Integrate Arcjet into `src/app/[locale]/api/search/route.ts` and auth routes.
5. Create `src/app/[locale]/api/csp-report/route.ts` to collect CSP violations.
6. Update `src/app/[locale]/layout.tsx` to inject nonce into `head` and `body`.
7. Create `src/components/ui/dynamic-scripts.tsx` for PPR-compatible third-party scripts.

**Deliverables**:
- Updated `src/middleware.ts`
- `src/app/[locale]/api/csp-report/route.ts`
- `src/lib/rate-limit.ts`
- Arcjet-protected routes
- `src/components/ui/dynamic-scripts.tsx`

**Definition of Done**:
- Every response includes CSP with unique nonce.
- Arcjet blocks automated requests to search/auth.
- CSP report endpoint receives and logs violations.
- Middleware tests verify headers.

---

### Sprint 10: Observability with OpenTelemetry, Sentry, and Logging

**Goal**: Gain visibility into errors, traces, and structured logs.

**Tasks**:
1. Install Sentry Next.js SDK and configure `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`.
2. Install OpenTelemetry SDK and configure `instrumentation.ts`.
3. Implement `src/lib/context.ts` with `AsyncLocalStorage` for request context.
4. Implement `src/lib/logger.ts` for structured JSON logging with correlation IDs.
5. Integrate logger into Server Actions, API Routes, and middleware.
6. Add Sentry capture to error boundaries and unhandled exceptions.
7. Write tests for logger and context helpers.

**Deliverables**:
- `instrumentation.ts`
- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `sentry.edge.config.ts`
- `src/lib/context.ts`
- `src/lib/logger.ts`
- `src/lib/sentry.ts`

**Definition of Done**:
- Sentry captures errors with request context.
- OpenTelemetry traces are emitted.
- Logs include `requestId`, `traceId`, and `spanId`.
- Tests verify structured log output.

---

### Sprint 11: Feature Flags and Edge Config

**Goal**: Enable dynamic feature toggles and kill switches.

**Tasks**:
1. Install OpenFeature SDK and LaunchDarkly provider.
2. Implement `src/lib/feature-flags.ts` with initialization and evaluation helpers.
3. Implement `src/lib/edge-config.ts` for Vercel Edge Config reads.
4. Create `src/components/providers/edge-config-provider.tsx`.
5. Gate features (e.g., recommendations, video 360) behind feature flags.
6. Implement kill switch for checkout/cart if critical failure occurs.
7. Write tests mocking OpenFeature client.

**Deliverables**:
- `src/lib/feature-flags.ts`
- `src/lib/edge-config.ts`
- `src/components/providers/edge-config-provider.tsx`
- Feature flag usage examples in components

**Definition of Done**:
- Feature flags evaluate via LaunchDarkly/OpenFeature.
- Edge Config provides banner/kill switch data.
- Flag evaluation latency remains under 20ms when cached.
- Tests cover flag on/off states.

---

### Sprint 12: Compliance (GDPR/LGPD/CCPA)

**Goal**: Implement consent recording and data subject rights.

**Tasks**:
1. Implement `src/lib/compliance/consent.ts` to record consent in Redis ledger.
2. Create `src/app/[locale]/api/compliance/consent/route.ts`.
3. Create `src/app/[locale]/api/compliance/export/route.ts`.
4. Create `src/app/[locale]/api/compliance/delete/route.ts`.
5. Create `src/components/ui/consent-banner.tsx`.
6. Integrate consent banner into layout.
7. Write integration tests for consent, export, and deletion.

**Deliverables**:
- `src/lib/compliance/consent.ts`
- `src/lib/compliance/audit.ts`
- `src/app/[locale]/api/compliance/consent/route.ts`
- `src/app/[locale]/api/compliance/export/route.ts`
- `src/app/[locale]/api/compliance/delete/route.ts`
- `src/components/ui/consent-banner.tsx`

**Definition of Done**:
- Consent decisions are recorded immutably.
- Export returns customer-related data.
- Deletion returns a request ID and schedules purge.
- Compliance endpoints have unit and integration tests.

---

### Sprint 13: Klaviyo Integration and Final Polish

**Goal**: Add marketing event tracking and finalize the platform.

**Tasks**:
1. Install Klaviyo onsite JS and create `src/lib/analytics.ts`.
2. Track events: `Viewed Product`, `Added to Cart`, `Started Checkout`.
3. Integrate events into product pages, cart actions, and checkout redirect.
4. Add PPR support in `next.config.ts` if stable.
5. Final Lighthouse/Core Web Vitals review.
6. Final security review of headers, cookies, and environment variables.
7. Update README with architecture diagram and deployment guide.

**Deliverables**:
- `src/lib/analytics.ts`
- Klaviyo event tracking in components
- Updated `next.config.ts` with PPR if applicable
- Final README and deployment documentation

**Definition of Done**:
- Klaviyo events fire correctly.
- PPR works without CSP errors (if enabled).
- Lighthouse scores meet targets (LCP < 1.2s, CLS = 0).
- Full CI pipeline is green.

## Appendix B — File Tree Target

```
C:/Users/suppo/Documents/Antigravity/Sinesi Karol/Marketplace/
├── .github/
│   └── workflows/
│       └── ci.yml
├── spec/
│   └── spec-infrastructure-base-ecommerce-luxo.md
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── error.tsx
│   │   │   ├── cart/
│   │   │   │   └── page.tsx
│   │   │   ├── collections/
│   │   │   │   └── [handle]/
│   │   │   │       └── page.tsx
│   │   │   ├── products/
│   │   │   │   └── [handle]/
│   │   │   │       └── page.tsx
│   │   │   ├── search/
│   │   │   │   └── page.tsx
│   │   │   ├── account/
│   │   │   │   ├── page.tsx
│   │   │   │   └── login/
│   │   │   │       └── page.tsx
│   │   │   └── api/
│   │   │       ├── search/
│   │   │       │   └── route.ts
│   │   │       ├── auth/
│   │   │       │   ├── oauth/
│   │   │       │   │   ├── authorize/
│   │   │       │   │   │   └── route.ts
│   │   │       │   │   └── callback/
│   │   │       │   │       └── route.ts
│   │   │       │   └── refresh/
│   │   │       │       └── route.ts
│   │   │       ├── webhooks/
│   │   │       │   └── route.ts
│   │   │       ├── csp-report/
│   │   │       │   └── route.ts
│   │   │       └── compliance/
│   │   │           ├── consent/
│   │   │           │   └── route.ts
│   │   │           ├── export/
│   │   │           │   └── route.ts
│   │   │           └── delete/
│   │   │               └── route.ts
│   │   └── globals.css
│   ├── actions/
│   │   ├── cart.ts
│   │   └── auth.ts
│   ├── components/
│   │   ├── providers/
│   │   │   ├── cart-provider.tsx
│   │   │   ├── auth-provider.tsx
│   │   │   └── edge-config-provider.tsx
│   │   ├── shared/
│   │   │   └── motion-next-image.tsx
│   │   ├── ui/
│   │   │   ├── product-card.tsx
│   │   │   ├── product-recommendations.tsx
│   │   │   ├── search-bar.tsx
│   │   │   ├── product-reviews.tsx
│   │   │   ├── consent-banner.tsx
│   │   │   └── dynamic-scripts.tsx
│   │   └── luxury/
│   │       ├── product-details-luxury.tsx
│   │       ├── add-to-cart-button.tsx
│   │       └── video-360-player.tsx
│   ├── lib/
│   │   ├── env.ts
│   │   ├── regions.ts
│   │   ├── context.ts
│   │   ├── logger.ts
│   │   ├── analytics.ts
│   │   ├── rate-limit.ts
│   │   ├── feature-flags.ts
│   │   ├── edge-config.ts
│   │   ├── bff.ts
│   │   ├── sentry.ts
│   │   ├── redis/
│   │   │   └── client.ts
│   │   ├── cache/
│   │   │   ├── lock.ts
│   │   │   └── stampede.ts
│   │   ├── compliance/
│   │   │   ├── consent.ts
│   │   │   └── audit.ts
│   │   └── shopify/
│   │       ├── client.ts
│   │       ├── queries.ts
│   │       ├── types.ts
│   │       ├── metafields.ts
│   │       ├── loader.ts
│   │       ├── search.ts
│   │       ├── recommendations.ts
│   │       └── cache.ts
│   ├── instrumentation.ts
│   ├── sentry.client.config.ts
│   ├── sentry.server.config.ts
│   └── sentry.edge.config.ts
├── middleware.ts
├── __tests__/
│   ├── unit/
│   │   ├── regions.test.ts
│   │   ├── metafields.test.ts
│   │   ├── logger.test.ts
│   │   └── context.test.ts
│   ├── integration/
│   │   ├── shopify-client.test.ts
│   │   ├── redis-cache.test.ts
│   │   ├── cart-action.test.ts
│   │   ├── webhooks.test.ts
│   │   ├── auth-refresh.test.ts
│   │   └── feature-flags.test.ts
│   ├── e2e/
│   │   ├── home.spec.ts
│   │   ├── product.spec.ts
│   │   ├── search.spec.ts
│   │   ├── cart.spec.ts
│   │   └── consent.spec.ts
│   ├── helpers/
│   │   └── setup.ts
│   └── fixtures/
│       ├── shopify-product.json
│       └── webhook-products-update.json
├── .env.local.example
├── .prettierrc
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── playwright.config.ts
├── README.md
├── tailwind.config.ts
├── tsconfig.json
└── vitest.config.ts
```

## Appendix C — Future Work (Post-Sprint 13)

The following items are not part of this specification and will be addressed in future work:

1. **Algolia Search**: Replace Shopify search for catalogs larger than 50,000 SKUs.
2. **PWA**: Service workers, offline support, and installable app experience.
3. **Social Login**: Google/Apple login via Shopify Customer Account API.
4. **Advanced Performance**: Edge rendering, advanced caching strategies, and image optimization beyond `next/image`.
5. **Chaos Engineering**: Resilience testing with Gremlin or Litmus.
6. **Mobile Native Apps**: iOS/Android applications sharing the same backend.
