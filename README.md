# DemoBet Recharge

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)]([![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/mamanadamouabdoulaziz-sys/Marass-Service-1X-Recharge))

A modern full-stack web application for bet recharge management, featuring secure authentication, file storage, and realtime updates. Built with Cloudflare Workers for edge deployment, Convex for backend services, and React with shadcn/ui for a polished frontend experience.

## Features

- **Secure Authentication**: Email OTP verification, password management, forgot password/reset, and anonymous sign-in.
- **File Management**: Upload, list, preview, and delete user files with Convex Storage.
- **Realtime Data**: Convex-powered queries and mutations for instant updates.
- **Responsive UI**: shadcn/ui components, Tailwind CSS, dark mode support, and mobile-friendly design.
- **Edge-Optimized**: Cloudflare Workers for fast global performance and API routing with Hono.
- **Type-Safe**: Full TypeScript support across frontend, backend, and Workers.
- **Production-Ready**: Error handling, logging, CORS, and optimized builds.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, React Router, TanStack Query, shadcn/ui, Tailwind CSS, Lucide icons.
- **Backend**: Convex (realtime DB, auth, storage), Hono (API routing).
- **Deployment**: Cloudflare Workers/Pages, Wrangler.
- **Tools**: Bun (package manager), Immer (state), Sonner (toasts), Framer Motion (animations).

## Quick Start

1. Clone the repository.
2. Install dependencies: `bun install`.
3. Set up environment variables (see below).
4. Run development server: `bun dev`.

## Installation

```bash
# Install dependencies
bun install

# Generate Cloudflare Worker types
bun run cf-typegen

# Deploy backend (Convex)
bun run backend:deploy
```

Set the following environment variables:

```
VITE_CONVEX_URL=your_convex_url_here
ANDROMO_SMTP_URL=your_smtp_url
ANDROMO_SMTP_API_KEY=your_smtp_key
```

- Get `VITE_CONVEX_URL` from your Convex dashboard after deploying the backend.
- SMTP credentials from your Andromo SMTP service for email OTP.

## Development

```bash
# Start dev server (frontend + backend sync)
bun dev

# Lint code
bun lint

# Build for production
bun build

# Preview production build
bun preview
```

The dev server runs on `http://localhost:3000` (or `$PORT`). Convex handles realtime sync automatically.

### Project Structure

```
├── convex/          # Backend: Schema, auth, queries/mutations
├── src/             # Frontend: React components, pages, hooks
├── worker/          # Cloudflare Workers: API routes (Hono)
├── shared/          # Shared types/utils
└── public/          # Static assets
```

## Usage Examples

### Authentication
- Sign up/sign in with email + password.
- Verify via 6-digit OTP sent to email.
- Use anonymous mode for quick access.

### File Management
Files are automatically scoped to authenticated users. Upload via drag-and-drop or form, with metadata storage.

## Deployment

1. **Backend (Convex)**:
   ```bash
   bun run backend:deploy
   ```
   Copy the deployment URL to `VITE_CONVEX_URL`.

2. **Frontend (Cloudflare Workers)**:
   ```bash
   bun build
   wrangler deploy
   ```

For one-click deployment:

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)]([![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/mamanadamouabdoulaziz-sys/Marass-Service-1X-Recharge))

**Note**: Ensure Wrangler is authenticated (`wrangler login`) and bound to your Cloudflare account. Custom domains and assets are configured in `wrangler.jsonc`.

## Scripts

| Script | Description |
|--------|-------------|
| `bun dev` | Development server with hot reload |
| `bun build` | Build for production (deploys assets) |
| `bun deploy` | Full deploy (build + wrangler) |
| `bun lint` | Run ESLint |
| `bun preview` | Preview production build |

## Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_CONVEX_URL` | Yes | Convex deployment URL | `https://*.convex.cloud` |
| `ANDROMO_SMTP_URL` | Yes | SMTP service base URL | `https://smtp.andromo.com` |
| `ANDROMO_SMTP_API_KEY` | Yes | SMTP API key | `sk-...` |

## Contributing

1. Fork the repo.
2. Create a feature branch (`git checkout -b feature/xyz`).
3. Commit changes (`git commit -m "Add feature"`).
4. Push and open a PR.

## License

MIT License. See [LICENSE](LICENSE) for details.

## Support

- [Convex Docs](https://docs.convex.dev)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers)
- Issues: Open a GitHub issue for bugs/features.

Built with ❤️ by Andromo.