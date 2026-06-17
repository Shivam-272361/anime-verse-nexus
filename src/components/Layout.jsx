import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiBell,
  FiCommand,
  FiCompass,
  FiGrid,
  FiHeart,
  FiHome,
  FiMenu,
  FiMoon,
  FiSearch,
  FiStar,
  FiUser,
  FiX,
  FiZap,
} from 'react-icons/fi';
import { GiRingedPlanet } from 'react-icons/gi';
import AnimatedBackground from './AnimatedBackground.jsx';
import { getTitle, getScore } from '../api/anilistApi.js';
import { useSearch } from '../hooks/useAniList.js';

const navItems = [
  { path: '/', label: 'Home', icon: FiHome },
  { path: '/explore', label: 'Explore', icon: FiCompass },
  { path: '/characters', label: 'Characters', icon: FiHeart },
  { path: '/galaxy', label: 'Galaxy', icon: GiRingedPlanet },
  { path: '/recommendations', label: 'AI Picks', icon: FiZap },
  { path: '/profile', label: 'Profile', icon: FiUser },
];

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const { results: searchResults, loading: searchLoading } = useSearch(
    searchFocused && searchQuery.length >= 2 ? searchQuery : '',
    null,
  );

  useEffect(() => {
    setOpen(false);
    setSearchQuery('');
    setSearchFocused(false);
  }, [location.pathname]);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const goToAnime = (id) => {
    navigate(`/anime/${id}`);
    setSearchQuery('');
    setSearchFocused(false);
  };

  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-white/10 bg-abyss/70 p-4 backdrop-blur-2xl transition duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="mb-8 flex items-center justify-between">
            <NavLink to="/" className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-neon-blue via-neon-purple to-neon-pink text-xl shadow-glow">
                <FiGrid />
              </span>
              <span>
                <span className="block font-display text-lg font-bold tracking-wide">AnimeVerse</span>
                <span className="text-xs uppercase tracking-[0.32em] text-neon-blue/80">Nexus</span>
              </span>
            </NavLink>
            <button className="rounded-xl p-2 text-white/70 lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
              <FiX />
            </button>
          </div>

          <nav className="space-y-2">
            {navItems.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 overflow-hidden rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    isActive ? 'text-white' : 'text-white/60 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-2xl bg-white/10 shadow-glow"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <Icon className="relative z-10 text-lg" />
                    <span className="relative z-10">{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto overflow-hidden rounded-2xl border border-neon-blue/20 bg-neon-blue/10 p-4">
            <p className="text-xs uppercase tracking-[0.28em] text-neon-blue">Live Database</p>
            <p className="mt-2 text-sm text-white/80">Connected to AniList — discover thousands of anime in real time.</p>
            <button
              className="mt-4 rounded-xl bg-white px-4 py-2 text-sm font-bold text-abyss transition hover:scale-[1.03]"
              onClick={() => navigate('/explore')}
            >
              Explore Now
            </button>
          </div>
        </div>
      </aside>

      <header className="fixed left-0 right-0 top-0 z-30 border-b border-white/10 bg-abyss/55 backdrop-blur-2xl lg:left-72">
        <div className="flex h-20 items-center gap-3 px-4 sm:px-6 lg:px-8">
          <button className="rounded-xl p-3 text-white/75 hover:bg-white/10 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <FiMenu />
          </button>
          <div ref={searchRef} className="relative hidden min-w-0 flex-1 md:block">
            <div className="flex items-center rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white/60">
              <FiSearch className="mr-3" />
              <input
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
                placeholder="Search anime, characters, studios..."
                aria-label="Global search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
              />
              <span className="ml-3 flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1 text-xs">
                <FiCommand /> K
              </span>
            </div>
            <AnimatePresence>
              {searchFocused && searchQuery.length >= 2 && (
                <motion.div
                  className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[24rem] overflow-y-auto rounded-2xl border border-white/15 bg-abyss/95 shadow-2xl backdrop-blur-2xl search-dropdown"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <div className="p-2">
                    {searchLoading ? (
                      <div className="flex items-center gap-3 px-4 py-4 text-sm text-white/40">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-neon-blue/30 border-t-neon-blue" />
                        Searching AniList...
                      </div>
                    ) : searchResults.length > 0 ? (
                      searchResults.slice(0, 8).map((anime) => (
                        <button
                          key={anime.id}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-white/10"
                          onClick={() => goToAnime(anime.id)}
                        >
                          <img
                            src={anime.coverImage?.large}
                            alt=""
                            className="h-14 w-10 rounded-lg object-cover"
                            loading="lazy"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-white">{getTitle(anime)}</p>
                            <p className="truncate text-xs text-white/45">
                              {anime.seasonYear ? `${anime.seasonYear} · ` : ''}{(anime.genres || []).slice(0, 2).join(', ')}
                            </p>
                          </div>
                          {anime.averageScore && (
                            <span className="flex items-center gap-1 text-sm text-amber-300">
                              <FiStar className="text-xs" /> {getScore(anime)}
                            </span>
                          )}
                        </button>
                      ))
                    ) : (
                      <p className="px-4 py-4 text-center text-sm text-white/40">No anime found for &quot;{searchQuery}&quot;</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button className="rounded-xl border border-white/10 bg-white/[0.06] p-3 text-white/70 transition hover:border-neon-blue/50 hover:text-white" aria-label="Toggle theme">
            <FiMoon />
          </button>
          <button
            className="relative rounded-xl border border-white/10 bg-white/[0.06] p-3 text-white/70 transition hover:border-neon-pink/50 hover:text-white"
            onClick={() => setNotifications((value) => !value)}
            aria-label="Notifications"
          >
            <FiBell />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-neon-pink shadow-pink" />
          </button>
          <div className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-2 pr-4 sm:flex">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-neon-blue to-neon-pink font-bold">AV</div>
            <div>
              <p className="text-sm font-bold">Nexus Pilot</p>
              <p className="text-xs text-white/45">Level 42 Curator</p>
            </div>
          </div>
        </div>
        {notifications && (
          <motion.div
            className="absolute right-4 top-24 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-white/10 bg-abyss/90 p-4 shadow-2xl backdrop-blur-2xl"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {['New trending anime update', 'Galaxy event begins tonight', '3 recommendations recalibrated'].map((item) => (
              <div key={item} className="rounded-xl p-3 text-sm text-white/75 hover:bg-white/10">
                {item}
              </div>
            ))}
          </motion.div>
        )}
      </header>

      <div className="pt-20 lg:pl-72">
        <div className="px-4 pb-10 sm:px-6 lg:px-8">{children}</div>
      </div>
    </div>
  );
}
