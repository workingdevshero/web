<p align="center">
  <img src="public/logo.png" alt="Working Dev's Hero" width="120" />
</p>

<h1 align="center">Working Dev's Hero</h1>

<p align="center">
  <strong>AI-Enabled Software Development Company</strong>
</p>

<p align="center">
  <a href="https://workingdevshero.com">Website</a> •
  <a href="https://x.com/workingdevshero">X (Twitter)</a> •
  <a href="https://github.com/workingdevshero">GitHub</a> •
  <a href="https://linkedin.com/company/workingdevshero">LinkedIn</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Astro-5.x-BC52EE?style=flat-square&logo=astro&logoColor=white" alt="Astro" />
  <img src="https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/MDX-Content-F9AC00?style=flat-square&logo=mdx&logoColor=white" alt="MDX" />
</p>

---

## 🦸 About

This is the marketing website for **Working Dev's Hero (WDH)** — an AI-enabled software development company helping businesses harness the power of artificial intelligence and modern technologies.

### What We Do

- **Full-Stack Product Development** — Building customer-facing applications with AI as a force multiplier
- **Operations & AI Integration** — Helping businesses overhaul internal processes to unlock AI's potential  
- **Strategic Consulting** — Guiding organizations to leverage AI for maximum effectiveness

---

## 🚀 Tech Stack

| Technology | Purpose |
|------------|---------|
| [Astro](https://astro.build) | Static site generator |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first styling |
| [MDX](https://mdxjs.com) | Blog content with JSX support |
| [Sharp](https://sharp.pixelplumbing.com) | Image optimization |

---

## 📁 Project Structure

```
workingdevshero-web/
├── public/              # Static assets (images, favicon)
├── src/
│   ├── assets/          # Optimized images
│   ├── components/      # Astro components
│   │   ├── layout/      # Header, Footer
│   │   └── ui/          # Reusable UI components
│   ├── content/         # MDX blog posts & content
│   ├── layouts/         # Page layouts
│   ├── pages/           # Route pages
│   ├── styles/          # Global CSS
│   └── utils/           # Helper functions
├── astro.config.mjs     # Astro configuration
├── tailwind.config.mjs  # Tailwind configuration
└── tsconfig.json        # TypeScript configuration
```

---

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/bobbyg603/workingdevshero-web.git

# Navigate to project
cd workingdevshero-web

# Install dependencies
npm install
```

### Development

```bash
# Start dev server at localhost:4321
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🎨 Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| **Primary** | `#4A1942` | Brand purple, headings |
| **Secondary** | `#7C3AED` | Accent purple, links |
| **Accent** | `#F59E0B` | CTAs, highlights |
| **Dark** | `#1E1B4B` | Dark backgrounds |
| **Hero** | `#D35400` | Sidekick mascot orange |

---

## 📝 Adding Blog Posts

Create a new `.mdx` file in `src/content/blog/`:

```mdx
---
title: "Your Post Title"
description: "A brief description"
pubDate: 2025-01-01
author: "bobbyg603"
heroImage: "/images/blog/your-image.png"
categories: ["AI", "Software"]
tags: ["ai", "development"]
---

Your content here...
```

---

## 🌐 Deployment

This site is configured for static hosting. Build output goes to `dist/`.

```bash
npm run build
```

Deploy the `dist/` folder to any static hosting provider:
- Cloudflare Pages
- Netlify
- Vercel
- GitHub Pages

---

## 📄 License

ISC © [Working Dev's Hero LLC](https://workingdevshero.com)

---

<p align="center">
  <strong>Built with 🤖 AI + ❤️ Human Expertise</strong>
</p>


<!-- Test preview deployment -->
