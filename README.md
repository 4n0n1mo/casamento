# Casamento Minimal (pt-BR) — Pix + RSVP fechado

Site mobile-first, minimalista clássico-moderno, com:
- Presentear via Pix (Checkout no provedor / gateway)
- RSVP fechado (apenas convidados com token/código)
- Admin simples (importar lista, gerar tokens/QR, exportar status)

## Stack
- Next.js (App Router) + TypeScript + Tailwind
- Prisma + SQLite (dev) / Postgres (produção)
- Mercado Pago (Checkout Pro) como exemplo de gateway Pix (pluggable)

## 1) Rodar localmente

```bash
cp .env.example .env
npm i
npx prisma migrate dev --name init
npm run seed
npm run dev
```

Abra: http://localhost:3000

## 2) Configurar RSVP fechado

### Gerar chaves (recomendado)
Gere valores fortes:

```bash
node -e "console.log('TOKEN_PEPPER=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('RSVP_SESSION_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('TOKEN_ENC_KEY=' + require('crypto').randomBytes(32).toString('base64'))"
```

### Como funciona
1. Cada grupo (família) possui um **TOKEN aleatório** (alta entropia).
2. O token pode ser impresso no convite e/ou embutido em um QR Code que abre:
   `/rsvp?t=TOKEN`
3. A página mostra apenas a lista de nomes **pré-cadastrados** daquele grupo.  
   Não é possível digitar/adição de nomes.

Tokens não são guardados em texto puro no banco: guardamos `tokenHash = HMAC-SHA256(token, TOKEN_PEPPER)` e `tokenEnc` criptografado (AES-256-GCM) para permitir export/QR com acesso admin.

### Admin
- `/admin/login` (senha em `ADMIN_PASSWORD`)
- `/admin`:
  - Importar CSV de convidados (grupos e pessoas)
  - Gerar token/QR para cada grupo
  - Ver status (YES/NO/PENDING) e exportar planilha CSV
  - Travar edições ao passar do `deadline` (automático)

#### CSV de importação (formato)
Arquivo `convidados.csv` com colunas:

- `label` (ex.: "Família Souza")
- `deadline` (YYYY-MM-DD)
- `plus_one_allowed` (true/false)
- `guests` (nomes separados por `;`)

Exemplo:
```csv
label,deadline,plus_one_allowed,guests
"Família Souza","2026-07-01",true,"Mariana Souza;João Souza;Acompanhante"
"Amigos do Trabalho","2026-07-01",false,"Carla Pereira;Diego Lima"
```

Observação: Se `plus_one_allowed=true`, inclua explicitamente um convidado **Acompanhante** na lista (nome fixo), para manter a regra de “sem adicionar nomes”.

## 3) Pix via gateway (Checkout)

A página **Presentes** mostra cards simbólicos (exemplos). O presente real é **via Pix** no provedor escolhido.

### Mercado Pago (Checkout Pro) — exemplo
Defina:
- `MERCADOPAGO_ACCESS_TOKEN`
- `NEXT_PUBLIC_SITE_URL` (URL pública em produção)

O fluxo cria uma **preference** e redireciona para o checkout hospedado.

Se você preferir outro gateway, implemente o adapter em `src/lib/payments/providers/`.

## 4) CAPTCHA (após falhas repetidas)
Opcional com Cloudflare Turnstile:
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`

Sem as chaves, o site funciona e apenas aplica rate-limit (IP) e bloqueio temporário.

## 5) Deploy (Vercel)
- Configure variáveis de ambiente
- Use Postgres em produção (Supabase/Railway etc)
- Rode migrações em CI/CD ou manualmente:
  `npx prisma migrate deploy`

## 6) Personalização rápida
Edite `src/lib/site.ts`:
- nomes, data, cidade, textos curtos
- horários, dress code, FAQ
- paleta e detalhes

## Segurança (resumo técnico)
- RSVP fechado por token de alta entropia (hash no banco)
- Sessão curta (cookie HTTP-only) após validação do token
- Rate limit por IP + logs mínimos (IP hash, timestamp, sucesso/falha)
- Erros genéricos para reduzir enumeração
- (Opcional) Turnstile após falhas repetidas

