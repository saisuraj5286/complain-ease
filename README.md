# ComplainEase

A college complaint-management app. **Students** file complaints (ragging, hostel, transport,
on-campus, other) and **admins** track and resolve them. Built on the
[T3 Stack](https://create.t3.gg/).

## Tech stack

- **Next.js 15** (App Router, React 19)
- **tRPC v11** + **TanStack React Query** for the type-safe API
- **Drizzle ORM** + **PostgreSQL**
- **Lucia** authentication (session cookies, Argon2 password hashing)
- **Tailwind CSS v4**
- **pnpm** package manager

## Features

- Username / roll-number / password signup and login
- Role-based access: `student` and `admin`
  - Students: file complaints, see only their own, track status
  - Admins: see all complaints, filter/search, change status (resolve / progress / reject), delete
- Server-side route protection via group layouts, plus `protectedProcedure` / `adminProcedure`
  authorization on the tRPC API

## Local setup

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Configure environment**

   Copy `.env.example` to `.env` and set `DATABASE_URL` to your Postgres connection string
   (Supabase, Neon, local Docker, etc.). A local Postgres can be started with
   `./start-database.sh`.

   ```
   DATABASE_URL="postgresql://user:password@host:5432/postgres"
   ```

3. **Apply the database schema**

   ```bash
   pnpm db:migrate   # apply committed migrations
   # or, for local iteration:
   pnpm db:push
   ```

4. **Run the dev server**

   ```bash
   pnpm dev
   ```

## Creating an admin

Signup always creates a `student`. To promote a user to `admin`, either use Drizzle Studio
(`pnpm db:studio`) and flip the `role` column, or run SQL against your database:

```sql
UPDATE "user" SET role = 'admin' WHERE username = 'your_username';
```

Log out and back in so the new role takes effect, and you'll be routed to `/admin`.

## Scripts

| Command             | Description                              |
| ------------------- | ---------------------------------------- |
| `pnpm dev`          | Start the dev server (Turbopack)         |
| `pnpm build`        | Production build                         |
| `pnpm lint`         | ESLint                                   |
| `pnpm typecheck`    | `tsc --noEmit`                           |
| `pnpm check`        | Lint + typecheck                         |
| `pnpm db:generate`  | Generate a Drizzle migration from schema |
| `pnpm db:migrate`   | Apply migrations                         |
| `pnpm db:push`      | Push schema directly (dev)               |
| `pnpm db:studio`    | Open Drizzle Studio                      |

## CI/CD

GitHub Actions workflows live in `.github/workflows/`:

- **`ci.yml`** — runs on every push and pull request: installs deps, then `lint`, `typecheck`,
  and `build`. The build runs with `SKIP_ENV_VALIDATION=1` and a dummy `DATABASE_URL`, so no live
  database or secrets are needed just to compile.
- **`deploy.yml`** — runs on pushes to `main` and deploys the production build to Vercel.

### Vercel deployment setup

The deploy workflow needs these **repository secrets**
(Settings → Secrets and variables → Actions):

| Secret              | Where to get it                                                  |
| ------------------- | ---------------------------------------------------------------- |
| `VERCEL_TOKEN`      | Vercel account → Settings → Tokens                               |
| `VERCEL_ORG_ID`     | `.vercel/project.json` after `vercel link`, or project settings  |
| `VERCEL_PROJECT_ID` | `.vercel/project.json` after `vercel link`, or project settings  |

Also set `DATABASE_URL` (and any other env vars) in the **Vercel project's Environment Variables**
so the deployed app can reach the database.
