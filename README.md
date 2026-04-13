# react-express-template

A full-stack monorepo template using React, React Native, and Express with TypeScript across all apps.

---

## Stack

### Frontend (`apps/frontend`)
| Package | Purpose |
|---|---|
| React 18 + Vite | UI framework + build tool |
| TypeScript | Type safety |
| React Router DOM | Client-side routing |
| Redux Toolkit + React Redux | Global state management |
| Axios | HTTP client |
| React Helmet | Document head management |

### Backend (`apps/backend`)
| Package | Purpose |
|---|---|
| Express | HTTP server framework |
| TypeScript + tsx | Type safety + dev runner |
| Mongoose | MongoDB ODM |
| Passport + passport-jwt | Authentication strategy |
| jsonwebtoken | JWT signing and verification |
| bcryptjs | Password hashing |
| cors | Cross-origin resource sharing |
| morgan | HTTP request logging |
| dotenv | Environment variable loading |

### Mobile (`apps/mobile`)
| Package | Purpose |
|---|---|
| Expo + React Native | Mobile framework |
| TypeScript | Type safety |
| React Navigation (native stack) | Screen navigation |
| Redux Toolkit + React Redux | Global state management |
| Axios | HTTP client |
| react-native-mmkv | Fast persistent storage (replaces AsyncStorage) |

### Shared (`packages/shared`)
Common TypeScript types imported by all three apps — `ApiResponse`, `PaginatedResponse`, `User`, `AuthTokenPayload`.

---

## Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/) >= 8 — `npm install -g pnpm`
- [MongoDB](https://www.mongodb.com/) running locally or a connection URI
- [Expo Go](https://expo.dev/client) on your phone (for mobile development)

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/your-username/react-express-template.git
cd react-express-template
pnpm install:all
```

### 2. Set up environment variables

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
cp apps/mobile/.env.example apps/mobile/.env
```

Edit `apps/backend/.env` at minimum:
```
MONGO_URI=mongodb://localhost:27017/myapp
JWT_SECRET=your_secret_here
```

---

## Running the Apps

### Frontend + Backend together
```bash
pnpm dev
```

### Individually
```bash
pnpm dev:frontend   # http://localhost:5173
pnpm dev:backend    # http://localhost:5000
pnpm dev:mobile     # Expo dev server — scan QR with Expo Go
```

### Production build
```bash
pnpm build:all              # builds all apps
pnpm start:backend          # runs compiled backend
```

---

## Project Structure

```
react-express-template/
├── apps/
│   ├── frontend/                   # React + Vite
│   │   └── src/
│   │       ├── components/         # Atomic Design
│   │       │   ├── atoms/
│   │       │   ├── molecules/
│   │       │   ├── organisms/
│   │       │   └── templates/
│   │       ├── context/            # LanguageContext, ThemeContext
│   │       ├── pages/              # AuthPage, HomePage
│   │       ├── redux/              # store, hooks, slices/
│   │       └── services/           # axios instance
│   │
│   ├── backend/                    # Express
│   │   └── src/
│   │       ├── api/
│   │       │   ├── controllers/    # authController
│   │       │   ├── middlewares/    # protect()
│   │       │   ├── routes/         # authRoutes, index
│   │       │   └── validators/     # authValidator
│   │       ├── config/             # env, database, passport
│   │       └── models/             # User
│   │
│   └── mobile/                     # Expo + React Native
│       └── src/
│           ├── components/         # Atomic Design (same as frontend)
│           ├── context/            # LanguageContext, ThemeContext
│           ├── navigation/         # RootStackParamList + Stack navigator
│           ├── screens/            # AuthScreen, HomeScreen
│           ├── redux/              # store, hooks, slices/
│           └── services/           # axios instance, MMKV storage
│
└── packages/
    └── shared/                     # Shared TypeScript types
        └── src/types/
            ├── api.ts              # ApiResponse, PaginatedResponse
            └── user.ts             # User, AuthTokenPayload
```

---

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/auth/me` | Yes | Get current user |
| GET | `/health` | No | Server health check |

---

## Auth Flow

1. User registers or logs in via `/api/auth/register` or `/api/auth/login`
2. Backend returns a JWT
3. Frontend stores the token in `localStorage`, mobile in MMKV
4. All subsequent requests attach the token as `Authorization: Bearer <token>`
5. Protected routes use the `protect` middleware which validates via passport-jwt
6. On 401 response, the token is cleared automatically by the axios interceptor

---

## Adding a New API Route

1. Create a controller in `apps/backend/src/api/controllers/`
2. Create a validator in `apps/backend/src/api/validators/`
3. Create a route file in `apps/backend/src/api/routes/`
4. Register it in `apps/backend/src/api/routes/index.ts`

## Adding a Shared Type

Add it to `packages/shared/src/types/`, export it from `packages/shared/src/index.ts`, then import it in any app:

```ts
import type { User } from 'shared'
```
