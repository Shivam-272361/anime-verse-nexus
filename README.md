# 🌌 AnimeVerse Nexus
AnimeVerse Nexus is a premium, real-time anime discovery portal and curation dashboard. Built with a futuristic dark-space aesthetic, glassmorphism, and neon glowing visual accents, it integrates directly with the **AniList GraphQL API** to browse, search, and visualize thousands of anime and characters in real time.
---
## ✨ Key Features
*   **⚡ Real-Time AniList API Sync**: Fully dynamic data integration querying titles, cover/banner images, genres, scores, popularity, trailer links, rankings, and character profiles directly from the AniList database.
*   **🪐 3D Anime Galaxy**: Interactive Three.js-powered planetary system mapping the top 50 trending anime as distinct planets, sized dynamically by popularity and colored according to their genre.
*   **🔍 Global Search & Command Palette**: 
    *   Instant global search dropdown in the navigation header.
    *   Keyboard-accessible Command Palette (`Ctrl + K` or `Cmd + K`) combining site navigation with live AniList database queries.
*   **♾️ Explore with Infinite Scrolling**: Dynamic page rendering with custom intersection observers, supporting genre filtering and sorting (Trending, Popular, Score, Release Date).
*   **🧬 AI Recommendation Lab**: A mock preference engine letting users calibrate their "anime DNA" by selecting genres to fetch and evaluate top matches dynamically.
*   **👤 Pilot Profile & Analytics**: Personal curation dashboard featuring Interactive Recharts graphs mapping anime genre tastes and weekly watch logs.
*   **🎬 Cinematic Trailer Modal**: Embedded YouTube trailers with fallbacks to cover/banner images for an immersive experience.
*   **✨ Premium UI/UX**: Shimmer skeleton loading states, smooth page transitions (Framer Motion), hover micro-animations, and custom glowing cursors.
---
## 🛠️ Tech Stack
*   **Core**: React (Vite-powered environment)
*   **Styling**: Tailwind CSS & Custom CSS variables (Neon Aura & Dark Space Theme)
*   **3D Graphics**: Three.js
*   **Animations**: Framer Motion
*   **Charts**: Recharts (Radar taste map, Bar history graph)
*   **Data Source**: AniList GraphQL API
---
## 🚀 Getting Started
### Prerequisites
Make sure you have Node.js installed on your machine.
### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/AnimeVerseNexus.git
   cd AnimeVerseNexus
Install the dependencies:

bash


npm install
Launch the local development server:

bash


npm run dev
Build for production:

bash


npm run build
📁 Key File Structure
text


src/
├── api/
│   └── anilistApi.js      # GraphQL client, caching engine, & API helpers
├── components/
│   ├── AnimeCard.jsx      # Reusable lazy-loaded anime card
│   ├── CommandPalette.jsx # Ctrl+K global navigation and search search
│   ├── Layout.jsx         # Sidebar, header search, notification layout
│   └── SkeletonCard.jsx   # Shimmer animated loaders
├── hooks/
│   └── useAniList.js      # Custom React hooks (Infinite Scroll, Search, Details)
├── pages/
│   ├── Home.jsx           # Animated landing page & trending carousel
│   ├── Explore.jsx        # Infinite scroll search directory
│   ├── AnimeDetails.jsx   # Character lists, relations, rankings, and recommendations
│   ├── Characters.jsx     # Favourites directory with search and detail modals
│   ├── Galaxy.jsx         # 3D interactive Three.js workspace
│   ├── Recommendations.js # AI Lab calibrator
│   └── Profile.jsx        # Data visualization and watch records
├── three/
│   ├── GalaxyScene.jsx    # Three.js planetary orbit configuration
│   └── HeroWorld.jsx      # Core node animation for landing page
└── styles/
    └── index.css          # Main stylesheet and animations
