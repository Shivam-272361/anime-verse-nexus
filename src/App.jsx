import { AnimatePresence } from 'framer-motion';
import { lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';
import CustomCursor from './components/CustomCursor.jsx';
import CommandPalette from './components/CommandPalette.jsx';

const Home = lazy(() => import('./pages/Home.jsx'));
const Explore = lazy(() => import('./pages/Explore.jsx'));
const AnimeDetails = lazy(() => import('./pages/AnimeDetails.jsx'));
const Characters = lazy(() => import('./pages/Characters.jsx'));
const Galaxy = lazy(() => import('./pages/Galaxy.jsx'));
const Recommendations = lazy(() => import('./pages/Recommendations.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));

export default function App() {
  const location = useLocation();

  return (
    <>
      <LoadingScreen />
      <CustomCursor />
      <CommandPalette />
      <Layout>
        <AnimatePresence mode="wait">
          <Suspense fallback={<RouteFallback />} key={location.pathname}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/anime/:id" element={<AnimeDetails />} />
              <Route path="/characters" element={<Characters />} />
              <Route path="/galaxy" element={<Galaxy />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </Layout>
    </>
  );
}

function RouteFallback() {
  return (
    <div className="grid min-h-[calc(100vh-5rem)] place-items-center">
      <div className="text-center">
        <div className="mx-auto h-14 w-14 animate-spin rounded-full border border-neon-blue/30 border-t-neon-blue" />
        <p className="mt-4 text-sm uppercase tracking-[0.28em] text-white/45">Loading route</p>
      </div>
    </div>
  );
}
