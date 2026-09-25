# Mostafa Ahmed — Marketing Travel Consultant

A production-ready Next.js website with a Resend-backed contact workflow and protected admin inbox.

## Features

- Responsive portfolio, services, work, about, and contact pages
- Server-side contact validation and honeypot spam protection
- Contact notifications sent from the verified `mostafaconsultant.com` domain
- Durable admin inbox sourced from Resend (no serverless filesystem dependency)
- Protected admin session with HTTP-only cookies
- In-dashboard client replies sent through Resend
- Optimized Next.js images, lazy video loading, compression, and asset caching
- Consent-based Meta Pixel page-view and successful-lead tracking
- Privacy notice, cookie choice, and Global Privacy Control support

## Environment variables

Copy `.env.example` to `.env.local` and set every value. Never commit `.env.local`.

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Server-only Resend API credential |
| `RESEND_FROM_EMAIL` | Sender on the verified domain, for example `Mostafa Ahmed <website@mostafaconsultant.com>` |
| `CONTACT_TO_EMAIL` | Inbox that receives new inquiry notifications and client replies |
| `ADMIN_EMAIL` | Admin dashboard login email |
| `ADMIN_PASSWORD` | Admin dashboard login password |
| `ADMIN_SESSION_SECRET` | Random secret of at least 32 characters used to sign admin sessions |
| `NEXT_PUBLIC_META_PIXEL_ID` | Numeric Meta Pixel ID; leave unset to disable the Pixel and cookie banner |

Set the same variables in the production hosting provider before deployment.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The admin login is at `/admin`.

## Verification

```bash
npm run lint
npm run typecheck
npm run build
```

The project gallery manifest is regenerated automatically before development and production builds.
