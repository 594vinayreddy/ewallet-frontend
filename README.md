# 💳 eWallet Frontend

A modern, responsive frontend application for seamless digital wallet management.

---

## 📌 Table of Contents

- [Overview](#overview)
- [User Flow](#user-flow)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Tech Stack](#tech-stack)
- [Contributing](#contributing)

---

## Overview

The eWallet Frontend provides users with a clean, action-oriented UI to manage their digital finances — from checking balances to executing transactions — all within a structured, predictable navigation flow.

---

## 🔄 User Flow

Every interaction follows a simple, consistent pattern that keeps users oriented at all times:

```
🏠 Dashboard
      │
      ▼
📄 Dedicated Action Page   ← (e.g. Pay, Transfer, Add Money, History)
      │
      ▼
✅ Perform Action
      │
      ▼
🏠 Return to Dashboard
```

> The Dashboard acts as the **single source of truth** — every action begins and ends here, ensuring users always have a clear anchor point.

---

## 🗂️ Project Structure

The codebase follows a clean separation of concerns:

```
src/
│
├── api/                        # Backend communication layer
│   ├── Authapi.ts              # Authentication endpoints
│   ├── axiosClient.ts          # Axios instance & interceptors
│   ├── healthApi.ts            # Health check endpoint
│   ├── transactionApi.ts       # Transaction endpoints
│   ├── Userapi.ts              # User profile endpoints
│   └── walletApi.ts            # Wallet endpoints
│
├── assets/                     # Static assets (images, icons, fonts)
│
├── components/                 # Reusable UI building blocks
│   ├── Navbar.tsx              # Top navigation bar
│   ├── ProfileDropdown.tsx     # User profile dropdown menu
│   └── TransactionCard.tsx     # Transaction list item card
│
├── pages/                      # Full-screen route-level views
│   ├── AddMoney.tsx            # Add funds to wallet
│   ├── Balance.tsx             # Wallet balance view
│   ├── ChangePin.tsx           # Change PIN page
│   ├── Dashboard.tsx           # 🏠 Main hub — entry & return point
│   ├── History.tsx             # Transaction history
│   ├── Login.tsx               # User login
│   ├── Pay.tsx                 # Make a payment
│   ├── Register.tsx            # New user registration
│   ├── SetPin.tsx              # Initial PIN setup
│   ├── Success.tsx             # Action success confirmation
│   ├── Transfer.tsx            # Transfer funds
│   ├── VerifyPin.tsx           # PIN verification
│   └── Wallet.tsx              # Wallet overview
│
├── store/                      # Global state management
│   └── authstore.ts            # Auth state (login, session, user info)
│
├── types/                      # TypeScript type definitions
│
├── App.tsx                     # Root component & route definitions
├── App.css                     # Global app styles
├── index.css                   # Base/reset styles
└── main.tsx                    # Application entry point
```

### Layer Responsibilities

| Layer | Purpose |
|---|---|
| `api/` | All backend calls — keeps data-fetching logic out of components |
| `components/` | Reusable, composable UI elements shared across pages |
| `pages/` | Full-screen views, one per feature/route |
| `store/` | Auth state and global session management |
| `types/` | Shared TypeScript interfaces and type definitions |

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/your-org/ewallet-frontend.git

# Navigate into the project
cd ewallet-frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

---

## 🛠️ Tech Stack

- **Framework** — React + TypeScript
- **State Management** — Zustand (`authstore.ts`)
- **API Communication** — Axios

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---
