<div align="center">
  <img src="./frontend/public/voicecode-logo.png" width="80" alt="EliteFolks Logo"/>
</div>

# EliteFolks — AI Coding Assistant & Training Arena

EliteFolks is an AI-assisted coding platform that helps developers practice smarter by recommending problems based on their performance.

🌐 **Live Demo:** [https://elitefolks.com](https://elitefolks.com)

---

## Why this exists

Most students learn coding by solving random problems without a structured path. This leads to slow progress and frustration.

EliteFolks focuses on adaptive learning — helping users work on the *right problems at the right time*.

---

## What it does

* Recommends coding problems based on user performance
* Tracks progress and identifies learning gaps
* Provides AI-assisted guidance (voice + text)
* Offers an interactive coding environment
* Includes competitive and gamified learning features

---

## Important Note

This repository is a **public showcase version** of EliteFolks.

* Core backend systems are private
* Recommendation engine is not included
* AI pipelines and prompt logic are excluded
* APIs are mocked for safe demonstration

This repo is intended to demonstrate **frontend engineering, UI/UX, and system design thinking**.

---

## Graphics!!

![Hero](docs/images/banner.png)
![AI Tutor](docs/images/ai_tutor.png)
![Arena](docs/images/arena.png)

---

## Architecture (High-Level)

Frontend (Next.js) → API Layer → Private Backend (AI + Recommendation Engine)

* Frontend handles UI, interactions, and state
* API layer communicates with backend services (mocked here)
* Backend includes AI systems, evaluation engine, and data pipelines (private)

---

## Tech Stack

**Frontend**

* Next.js (App Router)
* React
* Tailwind CSS
* GSAP & Framer Motion

**Tools & Integrations**

* Monaco Editor
* Mock APIs for simulation

---

## What I Learned

* Designing adaptive learning systems
* Working with AI-assisted workflows
* Building complex UI systems with high interactivity
* Structuring scalable frontend architecture
* Thinking in terms of product, not just features

---

## Run Locally

```bash
git clone https://github.com/Atul-Chahar/elitefolks_showcase.git
cd elitefolks_showcase/frontend
npm install --legacy-peer-deps
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## About

Built by Atul Chahar

* GitHub: [https://github.com/Atul-Chahar](https://github.com/Atul-Chahar)
* LinkedIn: [https://www.linkedin.com/in/atul-chahar/](https://www.linkedin.com/in/atul-chahar/)

---

**Note:** This project is actively evolving. The current version represents a showcase of the product direction and engineering approach.
