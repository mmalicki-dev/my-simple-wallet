# Ultimate Wallet

A full stack personal finance management application
built with React, Node.js and TypeScript.

## Features

**Accounts**
- Multiple accounts per user with different currencies
- Real-time currency converter
- Dashboard banner showing total balance across all accounts
  in your preferred currency

**Transactions**
- Add, edit, delete and view transactions
- Categorize transactions with custom categories
- Automatic recurring payments — subscriptions and credits
  that automatically create transactions on due dates

**Analytics**
- Line charts, donut charts and bar charts
- Filter by account, category and time period

**Authentication**
- JWT authentication with Passport.js
- Secure cookie-based sessions
- Password hashing with bcrypt

## Tech Stack

**Frontend:**
React 18 · TypeScript · Redux Toolkit · React Router · Recharts · Vite

**Backend:**
Node.js · Express · TypeScript · MongoDB · Mongoose
JWT · Passport.js · Agenda.js · Zod

**Architecture:**
Monorepo with pnpm workspaces (frontend, backend, shared, email)

**Testing:**
Vitest · Supertest

## Live Demo

[wallet.mm-tech-dev.no](https://wallet.mm-tech-dev.no)

## Coming Soon

React Native mobile application

## Running Locally

### Prerequisites
- Node.js 20+
- pnpm
- MongoDB

### Installation

```bash
# Clone the repository
git clone https://github.com/mmalicki-dev/my-simple-wallet.git
cd my-simple-wallet

# Install dependencies
pnpm install

# Set up environment variables
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env

# Start all services
pnpm dev

# Or start individually
pnpm --filter frontend dev
pnpm --filter backend dev
```

### Environment Variables

**Backend (.env):**
[apps/backend/.env.example](apps/backend/.env.example)

**Frontend (.env):**
[apps/frontend/.env.example](apps/frontend/.env.example)

## Project Structure

```
my-simple-wallet/
├── apps/
│   ├── frontend/     # React + TypeScript
│   ├── backend/      # Node.js + Express
│   └── mobile/       # React Native (coming soon)
└── packages/
    ├── shared/       # Shared types and utilities
    └── email/        # Email service (EmailJS)
```

## License

MIT
