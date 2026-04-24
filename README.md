# EliteFolks AI (Showcase)

EliteFolks is a next-generation interactive coding platform that uses AI-driven personalized tutoring, socratic guidance, and an immersive gamified learning environment to help developers master advanced programming concepts.

> **Note:** This repository is a sanitized, public-safe showcase of the EliteFolks frontend. To protect proprietary internal systems, all backend logic, database schemas, AI recommendation pipelines, and API integrations have been stripped, mocked, or randomized. This repo allows you to securely explore the engineering quality, component structure, and design system.

## 🚀 Features (Showcase Mode)
- **Gamified Learning Hub:** Explore the beautiful, dashboard and curriculum selectors built with `framer-motion` and `gsap`.
- **Integrated Coding IDE:** Complete coding challenges directly in your browser.
- **AI Live Tutor (Mocked):** See how the voice and text AI tutor conceptually integrates alongside the IDE to assist learners without giving away answers.
- **Battle Arena (Mocked):** A competitive programming mode with skill rankings. 

## 🛠 Tech Stack
This project runs entirely on the Client in Showcase Mode.

- **Framework:** Next.js (App Router) + React 19
- **Styling:** Tailwind CSS + custom SCSS modules
- **Animations:** GSAP, Framer Motion, Spline 3D
- **Editor Integration:** Monaco Editor, pyodide (for Python support)
- **Backend (Mocked in this repo):** Originally powered by Appwrite, Node.js microservices, and Google Gemini.

## 🏃‍♂️ Getting Started

Because the proprietary APIs have been removed, you can safely clone and run this application locally. A mock `AuthContext` will automatically log you in as a showcase user.

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev
```

Then visit `http://localhost:3000` to interact with the platform.

## 🔒 Security Posture
- This branch guarantees the absence of production keys.
- Recommendation engine and logic gates have been entirely stripped out.
- Dummy stats are utilized across the entire experience.

## architecture

See [`/docs/architecture.md`](docs/architecture.md) for a technical overview of how the real application pieces together AI, stateless microservices, and the interactive Next.js frontend.
