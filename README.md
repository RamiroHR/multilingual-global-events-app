# Multilingual Global Events App

A modern web application built with Next.js for managing and displaying global events with multilingual support.

#### Development Status Legend:

> ✅ Completed, ⬜ Not implemented, 🔄 In progress

## Features

- ✅ Multilingual support using next-intl (EN, ES)
- ✅ Authentication with JWT
- ⬜ Event management system
- ⬜ Concurrency management
- 🔄 UI made with React
- 🔄 Responsive design with Tailwind CSS
- ✅ TypeScript for type safety
- ✅ Comprehensive testing with Jest, GitHub Actions

### Application Screenshots

#### Home Page

<div align="center">
  <img src="./public/screenshots/home.png" alt="Login Page" width="420"/>
  <br/>
  <em>Landing Page</em>
</div>

#### Authentication & Registration

<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="./public/screenshots/login.png" alt="Login Page" width="200"/>
        <br/>
        <em>Login Page</em>
      </td>
      <td align="center">
        <img src="./public/screenshots/signup.png" alt="Signup Page" width="200"/>
        <br/>
        <em>Signup Page</em>
      </td>
    </tr>
  </table>
</div>

#### User Dashboard

The dashboard provides users with a comprehensive overview of their event activities.

<div align="center">
  <img src="./public/screenshots/dashboard.png" alt="Dashboard" width="800"/>
  <br/>
  <em>Personal Dashboard</em>
</div>

Here users can:

- ✅ View some metrics about their engagement in the application (number of past activities joined, etc).
- ✅ View the upcoming confirmed activity in have applied.
- ✅ View the next events they are organizing.
- ✅ Access quick actions for the next activity or event management.
- ✅ See their event hosting and activities schedule in calendar.
- ✅ Get a quick reminder of the number of future activities and events scheduled
- ✅ Get notifications about people waiting for their confirmation.

#### Explore Events

<div align="center">
  <img src="./public/screenshots/explore.png" alt="Explore Events" width="800"/>
  <br/>
  <em>Public Events Discovery</em>
</div>

The Explore page serves as a central hub for discovering events:

- ✅ Browse all public events
- ✅ Search events by type: online/in-person, by country (TO-DO: by city, date range, or category)
- ✅ Preview event information and access the full event description.
- ✅ Subscribe to events of interest.
- ✅ Share events as a creator with other users.
- ✅ precise event location and time are hidden until the participation is confirmed

<div align="center">
  <img src="./public/screenshots/eventDetails.png" alt="Explore Events" width="600"/>
  <br/>
  <em>Public Event Details View</em>
</div>

#### Joining Page

<div align="center">
  <img src="./public/screenshots/joining.png" alt="Joinig" width="800"/>
  <br/>
  <em>Joining Page</em>
</div>

The joining page allow the user to:

- ✅ Visualize activities they have applied.
- ✅ Visualize the application status.
- ✅ wihdraw their application if they can no loger be present.
- ✅ Re-apply to participation they have canceclled.

#### Hosting Page

<div align="center">
  <img src="./public/screenshots/hosting.png" alt="My Events" width="800"/>
  <br/>
  <em>Event Management Center</em>
</div>

The Hosting page is a dedicated space for event management the user has created:

- ✅ Create and publish new events
- ✅ Edit existing event details
- ✅ Manage participant subscriptions (accept or reject)
- ✅ Handle event cancellations
- ✅ View event applications and attendance
- ✅ View participants who cancelled their participation

## Tech Stack

- **Framework:** Next.js 14 + React
- **Language:** Node.js + TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL + Prisma ORM
- **Backend query:** Axios
- **Authentication:** JWT + bcryptjs
- **Testing:** Jest
- **Linting:** ESLint + Prettier
- **Global App state:** Zustand
- **Forms and Validation:** Formik + Yup

## Project Structure

```
├── .github/             # GitHub configuration files
├── .husky/              # husky hooks (pre-commit, etc)
├── .next/               # Next.js build output
├── messages/            # Internationalization messages
├── node_modules/        # Dependencies
│
├── prisma/              # Database & ORM configuration
│   ├── migrations/         # Database migrations
│   ├── schema.prisma       # Database schema
│   └── schema.prisma       # Script to seed the database with mock data
│
├── public/              # Static files: images
│
├── src/                 # Source code:
│   ├── app/                # Next.js app directory
│   │   ├── [locale]/          # Internationalized routes
│   │   ├── api/               # API routes
│   │   ├── fonts/             # Font files
│   │   ├── globals.css        # Global styles
│   │   └── layout.tsx         # Root app layout
│   │
│   ├── components/         # React components
│   ├── i18n/               # Internationalization setup
│   ├── lib/                # Utility functions
│   │   ├── types/          # central place for Types
│   │   ├── validations/    # yup validation schemas
│   │   ├── ...             # other utility functions ...
│   │   └── routes/         # Central endpoint strings variables
│   │
│   ├── hooks/              # Custom hooks
│   ├── metadata/           # App metadata for SEO
│   ├── mocks/              # Mock data & templates
│   ├── store/              # App state stores
│   ├── config.ts           # environment NODE_ENV configuration
│   └── middleware.ts       # Next.js middleware
│
├── tests/               # Test files: per routes & files
│
├── LICENSE              # Project license
├── package.json         # Project dependencies and scripts
├── package-lock.json    # Locked dependencies
├── .nvmrc               # Node version manager config
├── .editorconfig        # Editor configuration
├── .gitignore           # Git ignore rules
├── .gitattributes       # Git attributes
├── .eslintrc.json       # ESLint configuration
├── .prettierrc          # Prettier configuration
├── .prettierignore      # Prettier ignore rules
├── jest.config.mjs      # Jest configuration
├── next-env.d.ts        # Next.js boilerplate TypeScript declarations
├── next.config.mjs      # Next.js configuration
├── postcss.config.mjs   # PostCSS configuration
├── tailwind.config.ts   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

## Prerequisites

- Node.js (version specified in .nvmrc)
- npm
- Git
- PostgreSQL (local instance, e.g., version 17)
  - For now you must create a local database (e.g., `multilingual_events_dev`) before running the app (one for dev, another for local tests)

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/RamiroHR/multilingual-global-events-app.git
   cd multilingual-global-events-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up your environment variables:

   - Create a `.env` file in the root directory and add the necessary environment variables. Check the `.env.example` template for guidance.
   - Make sure your `DATABASE_URL` points to your local database (e.g., `multilingual_events_dev`).

4. Set up the local database:

   - Make sure you have PostgreSQL installed and running locally.
   - Create a new database (e.g., `multilingual_events_dev`).
   - Update the `.env` file with the correct `DATABASE_URL` for the database.
   - Run Prisma migrations and generate the Prisma client:

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

   This step will not be needed after setting up a web hosted database.

5. Run the development server:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests (unit & integration)
- `npm run test:coverage` - Run tests with coverage report

## CI/CD Pipeline and Testing

### Pipeline Steps

Our CI/CD pipeline runs automatically on push to `main` and `develop` branches, and on pull requests. The pipeline includes:

1. **Environment Setup**

   - ✅ Node.js 18 setup
   - ✅ PostgreSQL 17 database setup
   - ✅ Environment variables configuration

2. **Code Quality Checks**

   - ✅ Format checking with Prettier
   - ✅ Linting check with ESLint
   - ✅ TypeScript type checking

3. **Testing**

   - ✅ Unit tests execution
   - ✅ Test coverage reporting
   - ✅ Test results artifact upload

4. **Integration**

   - ⬜ Tests complete endpoint flows with real HTTP request

5. **Deployment**
   - ⬜ Buil Docker image and pucblish in DockerHub
   - ⬜ Deploy to Vercel

### Running Tests Locally

1. Set up test environment variables: Create a `.env.test` file in the root directory and add necessary environment variables. Check the `.env.test.example` template.

2. Run Tests

   ```bash
   # Run all tests
   npm run test

   # Run tests with coverage
   npm run test:coverage
   ```

### Test Coverage Report [TO-UPDATE]

The test coverage report is generated automatically when running `npm run test:coverage`. The report includes:

- Statement coverage
- Branch coverage
- Function coverage
- Line coverage

You can find the coverage report in the `coverage` directory after running the tests. The report is also available to download as an artifact in GitHub Actions after each pipeline run.

Latest test coverage (09/05/2025):

```
-------------------------|---------|----------|---------|---------|-------------------
File                     | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------------|---------|----------|---------|---------|-------------------
All files                |   91.93 |    84.21 |    87.5 |   94.91 |
 src                     |      80 |       50 |     100 |      80 |
  config.ts              |      80 |       50 |     100 |      80 | 64
 src/app/api/auth/login  |     100 |      100 |     100 |     100 |
  route.ts               |     100 |      100 |     100 |     100 |
 src/app/api/auth/signup |     100 |      100 |     100 |     100 |
  route.ts               |     100 |      100 |     100 |     100 |
 src/lib                 |    86.2 |       60 |   83.33 |    92.3 |
  jwt.ts                 |      75 |        0 |      75 |   85.71 | 29-30
  prisma.ts              |     100 |      100 |     100 |     100 |
  user.ts                |     100 |      100 |     100 |     100 |
-------------------------|---------|----------|---------|---------|-------------------

Test Suites: 2 passed, 2 total
Tests:       7 passed, 7 total
Snapshots:   0 total
Time:        4.608 s, estimated 5 s
```

### Local Development Workflow

1. **Develop new features, fiw bugs, refactor, etc**

2. **Before Committing**  
   The project uses Husky to enforce code quality checks before each commit. The following checks will run automatically:

   - Code formatting (Prettier)
   - Linting (ESLint)
   - Tests
   - Build verification

   If any check fails, the commit will be blocked until the issues are fixed.

   You can also run these checks manually:

   ```bash
   # Format the code
   npm run format

   # Check linting
   npm run lint:check

   # Run tests
   npm run test:coverage

   # Test build process
   npm run build
   ```

   To temporarily bypass the pre-commit hooks (not recommended):

   ```bash
   git commit -m "your message" --no-verify
   ```

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "your commit message"  # This command will run the husky verifications automatically
   ```

## Mock Data

This directory is for development-only mock data. Do not commit actual mock data files to the repository.

#### Usage

1. Copy `events.template.ts` to `events.ts`
2. Add your mock data to `events.ts` following the example
3. After creating the user mock data, change the importing in `events.ts` to: `import { mockUsers } from "@/mocks/users";`
4. Use the mock data in your development environment. Importing it in your page.tsx as:
   ```bash
   import { getAllMockEvents, getMockEventsByType } from "@/mocks/events";
   ```
5. Do not commit `events.ts` to the repository

#### Available Templates

- `events.template.ts`: Template for event mock data
- `users.template.ts`: Template for user mock data

### Database Seeding

Alternatively the mock data can be used to seed a fresh database. The seed script `prisma/seed.ts` will:

- Signup the mock users (all with password: "Password123") from the file `src/mocks/user.ts`
- Create the mock events (mix of online and offline events) from the file `src/mocks/events.ts`
- Set up event participants and relationships as describen in the file `src/mocks/events.ts`

To seed the database with mock data execute:

```bash
npm run seed
```

## License

This project is licensed under the terms of the license included in the repository.
