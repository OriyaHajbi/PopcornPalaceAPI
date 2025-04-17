# Popcorn Palace API Setup Guide

## 1. Prerequisites

Before you start, make sure you have the following installed on your system:

- **Node.js** (v16.x or later): [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js)
- **PostgreSQL** (or another database system you prefer, ensure it’s set up locally or on a server)
- **Git**: [Download Git](https://git-scm.com/)

---

## 2. Clone the Repository

To start working on the project, clone the repository from GitHub:

```bash
git clone https://github.com/OriyaHajbi/PopcornPalaceAPI.git
```

## 3: Navigate to the Project Directory

```bash
cd PopcornPalaceAPI
```

## 4: Install Dependencies

```bash
npm install
```

## 5: Set Up Environment Variables

```bash
DATABASE_URL=your-database-connection-string
JWT_SECRET=your-jwt-secret
PORT=3000
```

## 6: Build the Project

```bash
npm run build
```

## 7: Run the Project

```bash
npm run start:dev
```

Your API should now be running at http://localhost:3000.

## 8: Run Tests

```bash
npx jest --config jest.config.ts
```
