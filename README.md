# 💍 JodiMaker — Enterprise Matchmaking Platform 

An enterprise-grade B2B2C matchmaking platform built for modern matrimonial agencies and matchmakers. **JodiMaker** bridges operational CRM capabilities for matchmakers with an aesthetic, highly secure, and private client workspace for candidates.

---

## 📌 Executive Overview & Problem Statement

### The Problem

Traditional matrimonial and matchmaking operations rely heavily on fragmented tools like spreadsheets, unorganized messaging channels, and static file systems:

* **Data Fragmentation:** Managing candidate bios, criteria, and communication across disconnected platforms leads to lost context and slow turnaround times.
* **Privacy Concerns:** Centralized public databases expose client personal data without explicit agency control or client consent.
* **Binary Matching Limits:** Standard search engines rely on exact hard filters (e.g., age or city), missing qualitative human attributes like values, professional tracks, and lifestyle compatibility.

### The Solution

**JodiMaker** provides a dual-interface B2B2C platform:

1. **For Agencies (B2B):** An administrative suite featuring candidate CRM directory management, AI-powered proposal generation, SaaS credit rate-limiting, team plan calculations, and dynamic PDF invoice generation.
2. **For Candidates (B2C):** A private, client-facing portal with a 3-step onboarding wizard, personalized AI recommendation feed, opposite-gender match discovery, and mutual direct messaging.

---

## ✨ Key Features

### 🏢 1. Matchmaker Admin Portal (B2B Operational Suite)

* **Real-Time Client Directory:** Filter, search, and manage candidate profiles using safe string normalization algorithms.
* **Dynamic Match Pairing Engine:** Real-time reverse-chronological feed showing mutual candidate connections and interactions.
* **AI Match Report Synthesizer:** Instant generation of personalized introduction proposals and match summaries.
* **AI Credit Rate-Limiter:** Built-in credit balance tracking and top-up mechanism.
* **SaaS Tier & Billing Calculator:** Interactive team plan calculator with simulated Stripe checkout and dynamic PDF invoice export.
* **Discreet Administrative Gateway:** Hidden keyboard shortcut trigger (`Cmd + Shift + M` / `Ctrl + Shift + M`) opens an empty admin modal, keeping the default client interface strictly candidate-only for enhanced privacy perception.

### 👥 2. Candidate Portal (B2C Client Workspace)

* **Multi-Step Onboarding Wizard:** Clean, 3-stage profile setup (Personal → Professional → Cultural/Preferences).
* **Personalized AI Recommendation Engine:** Dynamic filtering bar (`CandidateFilterBar.tsx`) allowing candidates to discover matches by profession (*Engineering*, *Business*, *Finance*, *Design*), location (*Local City*, *International / Abroad*), and interest tags (✈️ *Travel*, 💻 *Tech*, 🏋️ *Fitness*, 🎵 *Music*, 🎨 *Art*).
* **Dynamic Gender Matching:** Automatic opposite-gender recommendation feed based on client preferences and profile attributes.
* **Real-Time AI Compatibility Badges:** Displays color-coded score badges (🟢 Green ≥ 80%, 🟡 Amber ≥ 60%, 🔴 Rose < 60%), gold rank badges (**#1**, **#2**, **#3**), and match reasoning highlights (e.g., `⚡ Engineering Background • ⚡ Shared Interest in Travel`).
* **Direct Messaging Portal:** Real-time candidate-to-candidate chat interface unlocked upon mutual connection.
* **Aesthetic Glassmorphic UI:** Warm design system styled with Playfair Display typography, brand accent (`#f64d68`), custom SVG illustrations, and frosted glass components (`bg-white/85 backdrop-blur-md`).



---

## 🏗️ High-Level Architecture

JodiMaker runs a hybrid serverless architecture built on Next.js, featuring MongoDB Atlas database persistence along with client-side state hydration fallbacks to guarantee uptime and zero-downtime execution.

```
                           ┌─────────────────────────────────────────┐
                           │          Client Web Browser             │
                           │  Next.js App Router (React Context)     │
                           └────────────────────┬────────────────────┘
                                                │
                                       (REST API Requests)
                                                │
                                                ▼
                           ┌─────────────────────────────────────────┐
                           │      Next.js Serverless API Routes      │
                           │  /api/auth | /api/recommendations | ... │
                           └────────────────────┬────────────────────┘
                                                │
                                      (Mongoose ODM Driver)
                                                │
                                                ▼
                           ┌─────────────────────────────────────────┐
                           │        MongoDB Atlas Cloud DB           │
                           │    (Candidates & Messages Collections)  │
                           └────────────────────┬────────────────────┘
                                                │
                                    (Fallback Guard Active)
                                                │
                                                ▼
                           ┌─────────────────────────────────────────┐
                           │      Client LocalStorage Fallback       │
                           │  (Ensures app runs even if DB drops)    │
                           └─────────────────────────────────────────┘

```

---

## 🤖 AI API Resilience & Fallback Architecture

To ensure the AI diagnostic and scoring service never fails during live production or API outages, JodiMaker implements a resilient **3-Tier Fallback Strategy**:

```
                 ┌─────────────────────────────────────────┐
                 │   1. Primary Call: Google Gemini API    │
                 └────────────────────┬────────────────────┘
                                      │
                         (If Timeout, Rate Limit, or Error)
                                      │
                                      ▼
                 ┌─────────────────────────────────────────┐
                 │    2. Fallback Call: OpenAI API         │
                 └────────────────────┬────────────────────┘
                                      │
                            (If OpenAI also fails)
                                      │
                                      ▼
                 ┌─────────────────────────────────────────┐
                 │ 3. Safe Local Fallback Engine (No API)  │
                 │  (Weighted Rule-Based Scoring Engine)   │
                 └─────────────────────────────────────────┘

```

1. **Primary Call:** Executes match analysis using the Google Gemini API.
2. **Secondary Provider:** Automatically re-routes to the OpenAI API if Gemini times out or throws a rate limit (429).
3. **Safe Local Fallback:** Runs a deterministic rule-based scoring algorithm if both external APIs are unavailable, guaranteeing 100% route uptime without 500 server errors.

---

## 🛠️ Tech Stack Breakdown

| Category | Technology / Library | Purpose |
| --- | --- | --- |
| **Framework** | **Next.js (App Router)** | Serverless SSR/SSG framework, route handlers, and client hydration safety. |
| **Language** | **TypeScript** | Strict type definitions, interfaces, and compile-time error prevention. |
| **Styling** | **Tailwind CSS** | Custom theme palette (`#f64d68`), glassmorphism overlays, and responsive design. |
| **Typography** | **Playfair Display & Google Fonts** | Premium serif typography used for hero headings and branding. |
| **Icons & Visuals** | **Lucide React & Inline SVGs** | Scalable UI icons and inline vector stickers/illustrations. |
| **State Management** | **React Context API + LocalStorage** | Client state persistence and sync across session reloads. |
| **Database & ODM** | **MongoDB Atlas + Mongoose** | Managed NoSQL document storage and schema object modeling. |
| **Authentication** | **`bcryptjs`** | Password salting and hash verification. |
| **PDF Generation** | **`jsPDF`** | Dynamic PDF export engine for proposals and SaaS billing invoices. |
| **Deployment & CI/CD** | **GitHub + Vercel** | Continuous integration and automatic edge deployment pipeline. |

---

## 📁 Repository Directory Structure

```text
jodimaker/
├── public/                     # Static graphics and public assets
├── src/
│   ├── app/                    # Next.js App Router Page Routes & Serverless APIs
│   │   ├── api/
│   │   │   ├── auth/           # Login & signup authentication endpoints
│   │   │   ├── candidates/     # Candidate CRUD and seeding APIs
│   │   │   ├── match/          # 3-Tier AI match scoring API
│   │   │   ├── messages/       # Real-time chat messaging routes
│   │   │   └── recommendations/# AI personalized recommendation scoring engine
│   │   ├── candidate/
│   │   │   ├── dashboard/      # Main candidate feed, filter bar, and AI badges
│   │   │   ├── profile/        # Account management & bio editing
│   │   │   └── onboarding/     # 3-step candidate onboarding wizard
│   │   ├── layout.tsx          # Root layout with font definitions (Playfair Display)
│   │   └── page.tsx            # Application entry page
│   ├── components/
│   │   ├── CandidateFilterBar.tsx  # Dynamic profession, location, and interest filter bar
│   │   ├── LoginView.tsx       # Default Candidate portal + secret Cmd+Shift+M modal trigger
│   │   └── ...                 # UI cards, modals, and navigation components
│   ├── lib/
│   │   └── db.ts               # Mongoose MongoDB connection singleton driver
│   └── models/                 # Mongoose schemas (Candidate, Message, User)
├── package.json
└── README.md

```

---

## 🔐 Credentials & Portal Access

* **Candidate Workspace Default Access:** Accessible directly at the main entry point (`/`).
* **Matchmaker Admin Modal Access:** Press **`Cmd + Shift + M`** (Mac) or **`Ctrl + Shift + M`** (Windows) on the login screen to open the hidden administrative login modal.
* **Test Admin Credentials:**
    * **Username:** `admin`
    * **Password:** `password`

---
Deployed Link:[https://jodimaker-matchmaking-platform.vercel.app/](https://jodimaker-matchmaking-platform.vercel.app/)
