# Expense Tracker Backend

## Overview

This is the backend service for the Expense Tracker application, built with Node.js, Apollo Server, and Prisma. It is designed to be scalable, maintainable, and follows industry-standard best practices.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Scripts](#scripts)
- [Tools and Libraries](#tools-and-libraries)

## Prerequisites

- Node.js
- PostgreSQL

## Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/mdtalha109/expense-tracker-backend.git
    cd expense-tracker-backend
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Set up environment variables**:
    Create a `.env` file in the root directory with the following content:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/expense_tracker"
    JWT_SECRET="your_secret_key"
    ```

4. **Initialize Prisma**:
    ```bash
    npx prisma init
    ```

5. **Run Prisma migrations**:
    ```bash
    npx prisma migrate dev --name init
    npx prisma generate
    ```

## Project Structure

```plaintext
expense-tracker-backend/
├── src/
│   ├── __tests__/            # Unit and integration tests
│   ├── config/               # Configuration files
│   │   ├── index.ts
│   │   ├── database.ts
│   │   └── auth.ts
│   ├── graphql/              # GraphQL schema and resolvers
│   │   ├── index.ts
│   │   ├── schema.ts
│   │   ├── resolvers/
│   │   │   ├── index.ts
│   │   │   ├── userResolvers.ts
│   │   │   └── expenseResolvers.ts
│   ├── middleware/           # Custom middleware
│   │   └── authMiddleware.ts
│   ├── models/               # Prisma models
│   │   └── index.ts
│   ├── services/             # Business logic
│   │   ├── index.ts
│   │   ├── userService.ts
│   │   └── expenseService.ts
│   ├── utils/                # Utility functions
│   │   ├── index.ts
│   │   ├── logger.ts
│   │   └── email.ts
│   ├── index.ts              # Entry point of the application
│   ├── server.ts             # Apollo Server setup
│   └── context.ts            # Context setup for Apollo Server
├── prisma/
│   ├── migrations/           # Prisma migrations
│   ├── schema.prisma         # Prisma schema
│   └── seed.ts               # Seed script
├── .env                      # Environment variables
├── .eslintrc.js              # ESLint configuration
├── .gitignore                # Git ignore file
├── jest.config.js            # Jest configuration
├── package.json              # Package configuration
├── README.md                 # Project documentation
└── tsconfig.json             # TypeScript configuration
