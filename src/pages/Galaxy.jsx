import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMaximize, FiMinus, FiPlus, FiStar } from 'react-icons/fi';
import PageTransition from '../components/PageTransition.jsx';
import GalaxyScene from '../three/GalaxyScene.jsx';
import { getTitle, getScore } from '../api/anilistApi.js';
import { useTrending } from '../hooks/useAniList.js';

export default function Galaxy() {
  const [selected, setSelected] = useState(null);
  const { data: animeList, loading } = useTrending(50);
  const handleSelect = useCallback((anime) => setSelected(anime), []);

  return (
    <PageTransition>
      <section className="-mx-4 h-[calc(100vh-5rem)] overflow-hidden sm:-mx-6 lg:-mx-8">
        <div className="relative h-full">
          {loading ? (
            <div className="grid h-full place-items-center">
              <div className="text-center">
                <div className="mx-auto h-14 w-14 animate-spin rounded-full border border-neon-blue/30 border-t-neon-blue" />
                <p className="mt-4 text-sm uppercase tracking-[0.28em] text-white/45">Generating galaxy from AniList...</p>
              </div>
            </div>
          ) : (
            <GalaxyScene animeList={animeList} onSelect={handleSelect} />
          )}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent,rgba(5,8,22,0.6)_72%)]" />
          <div className="absolute left-4 top-4 z-10 max-w-lg sm:left-8 sm:top-8">
            <p className="text-sm uppercase tracking-[0.3em] text-neon-blue">Anime Galaxy</p>
            <h1 className="mt-2 font-display text-4xl font-bold neon-text sm:text-6xl">Planetary discovery</h1>
            <p className="mt-3 text-white/62">
              {loading
                ? 'Loading anime universe...'
                : `${animeList.length} anime planets loaded. Scroll to zoom, click a planet to explore.`}
            </p>
          </div>
          <div className="absolute bottom-4 left-4 z-10 flex gap-2 sm:bottom-8 sm:left-8">
            {[FiMinus, FiPlus, FiMaximize].map((Icon, index) => (
              <button
                key={index}
                className="grid h-12 w-12 place-items-center rounded-2xl border border-white/15 bg-white/10 text-white backdrop-blur-xl transition hover:border-neon-blue/60"
                aria-label="Galaxy control"
              >
                <Icon />
              </button>
            ))}
          </div>
          {selected && (
            <motion.aside
              className="absolute bottom-4 right-4 z-10 w-[min(24rem,calc(100vw-2rem))] rounded-3xl border border-white/15 bg-abyss/78 p-5 shadow-2xl backdrop-blur-2xl sm:bottom-8 sm:right-8"
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              key={selected.id}
            >
              <img
                src={selected.coverImage?.extraLarge || selected.coverImage?.large}
                alt={getTitle(selected)}
                className="mb-4 h-36 w-full rounded-2xl object-cover"
                loading="lazy"
              />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl font-bold">{getTitle(selected)}</h2>
                  <p className="mt-1 text-sm text-white/50">{(selected.genres || []).join(' / ')}</p>
                </div>
                {selected.averageScore && (
                  <span className="flex items-center gap-1 rounded-full bg-amber-300/15 px-3 py-1 text-amber-200">
                    <FiStar /> {getScore(selected)}
                  </span>
                )}
              </div>
              <p className="mt-4 line-clamp-3 text-sm leading-6 text-white/65">
                {selected.description?.replace(/<[^>]*>/g, '').slice(0, 200) || 'No description available.'}
              </p>
              <Link
                to={`/anime/${selected.id}`}
                className="mt-4 block w-full rounded-2xl bg-white px-4 py-3 text-center font-bold text-abyss transition hover:scale-[1.02]"
              >
                View Full Details
              </Link>
            </motion.aside>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
