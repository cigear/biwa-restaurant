# Biwa Restaurant (美和食堂) 🍱

[![Svelte 5](https://img.shields.io/badge/Svelte-5.0_Runes-ff3e00?logo=svelte)](https://svelte.dev/)
[![.NET 10](https://img.shields.io/badge/.NET-10.0-512bd4?logo=dotnet)](https://dotnet.microsoft.com/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)

**Biwa Restaurant** is a high-performance, full-stack ordering system (POS) tailored for the Japanese market. Built with **Clean Architecture**, it focuses on a seamless responsive experience across all devices and is designed for local AI integration.

---

## 🏗 Architecture Overview

The project follows a strict separation of concerns to ensure maintainability and scalability, fully leveraging the latest features of **.NET 10**.

### Backend (ASP.NET Core 10)
*   **Domain**: Core entities, business logic, and domain interfaces (Framework-agnostic).
*   **Application**: Implementation of Use Cases, DTO mapping, and business contracts using the latest C# 14/15 features.
*   **Infrastructure**: Data persistence (EF Core 10), external service integrations, and hardware drivers.
*   **API**: RESTful endpoints with optimized Minimal APIs and enhanced Native AOT support for low-latency hardware.

### Frontend (Svelte 5 + Vite)
*   **Domain**: Shared TypeScript models mirrored from the backend.
*   **Application (State)**: Global reactive state management (Cart, Auth) using Svelte 5 **Runes** (`$state`, `$derived`).
*   **Infrastructure**: API repositories, i18n strategy (Auto-detection), and browser-specific implementations.
*   **Presentation**: Atomic UI components built with **Bits UI** and **Tailwind CSS 4**.

---

## ✨ Key Features

*   **🚀 Svelte 5 Runes Engine**: Leveraging the latest fine-grained reactivity for ultra-fast UI updates.
*   **📱 Responsive & Adaptive**: A tailored experience for **PC, Tablet, and Phone**—featuring a desktop sidebar and a mobile-optimized checkout drawer.
*   **🌐 Intelligent i18n**: Automatic language detection supporting **Japanese (ja), Chinese (zh), and English (en)**.
*   **🛠 Frontend-First Workflow**: Integrated `json-server` environment for rapid UI prototyping without a live backend.
*   **🏛 Clean Architecture**: Decoupled logic that is easy to test and ready for future local LLM (AI) recommendation modules.

---

## 🛠 Getting Started

### Prerequisites
*   **Node.js** (v22 or later)
*   **.NET 10 SDK**
*   **Git**

### Frontend (Mock Mode)
```bash
# Navigate to the client directory
cd client

# Install dependencies
npm install

# Start the Mock API server (Port 3001)
npm run mock

# In a new terminal, start SvelteKit development server
npm run dev