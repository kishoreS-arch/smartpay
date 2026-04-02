# SmartBank Master Architecture

Welcome to the SmartBank project repository! This repository uses a microservices-inspired monorepo structure to organize Frontend, Backend, Database, Mobile, and AI integrations.

## Directory Structure

```text
smartbank/
├── frontend/                        # React Web App (UI Layer)
├── backend/                         # Node.js + Express API
├── database/                        # Database Layer (MongoDB & SQL schemas)
├── mobile/                          # Future Mobile App (React Native)
├── ai-services/                     # AI Microservices (chatbot/voice/insights)
├── shared/                          # Shared constants and utilities
├── docs/                            # Architectural & API Documentation
├── scripts/                         # Automation & Deployment Shell Scripts
└── tests/                           # E2E & Unit Tests
```

## Getting Started

### 1. Frontend (Web Application)
The frontend is a fully responsive React/Vite progressive web application (PWA) with built-in accessibility themes (Visual, Senior, Default).
```bash
cd frontend
npm install
npm run dev
```

### 2. Backend (Node + Express)
The backend acts as a RESTful gateway connecting transactions, users, and AI to the database.
```bash
cd backend
npm install
npm run dev
```

> For full architectural details, please see `docs/ARCHITECTURE.md`
