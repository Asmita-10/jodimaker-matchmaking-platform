# 💍 JodiMaker — AI-Powered Dual-Portal Matchmaking Platform

**JodiMaker** is an enterprise-grade B2B2C matchmaking platform built for modern matrimonial agencies and matchmakers. It bridges operational CRM capabilities for matchmakers with an aesthetic, private client workspace for candidates.

---

## ✨ Key Features

### 🏢 1. Matchmaker Admin Portal (B2B Operational Suite)
* **Real-Time Client Directory:** Filter, search, and manage candidate profiles with safe string normalization.
* **Dynamic Match Pairing Engine:** Real-time reverse-chronological feed showing mutual connections and candidate interactions.
* **AI Match Report Synthesizer:** Instant generation of personalized introduction proposals.
* **AI Credit Rate-Limiter:** Built-in credit balance tracking and top-up mechanism.
* **SaaS Tier & Billing Calculator:** Interactive team plan calculator with simulated Stripe checkout and dynamic PDF invoice generation.

### 👥 2. Candidate Portal (B2C Workspace)
* **Multi-Step Onboarding Wizard:** Clean, 3-stage profile setup (*Personal* ➔ *Professional* ➔ *Cultural*).
* **Dynamic Gender Matching:** Automatic opposite-gender recommendation feed based on client preferences.
* **Direct Messaging Portal:** Real-time candidate-to-candidate chat interface unlocked upon mutual connection.
* **Glassmorphic Aesthetic UI:** Warm, modern design system powered by customized palette (`#f64d68`).

---

## 🛠️ Tech Stack & Architecture

* **Framework:** [Next.js](https://nextjs.org/) (App Router & Client Hydration Safety)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) + Glassmorphism / Custom Palette (`#f64d68`)
* **Icons:** [Lucide React](https://lucide.dev/)
* **State & Data Persistence:** React Context API + LocalStorage Client Hydration Sync
* **PDF Export:** `jspdf`

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js (v18+ recommended) and npm/pnpm/yarn installed.

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/jodimaker-matchmaking-platform.git](https://github.com/YOUR_USERNAME/jodimaker-matchmaking-platform.git)
   cd jodimaker-matchmaking-platform
