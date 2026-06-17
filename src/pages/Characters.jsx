import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiSearch, FiHeart, FiX } from 'react-icons/fi';
import PageTransition from '../components/PageTransition.jsx';
import { getTitle } from '../api/anilistApi.js';
import { useCharacters } from '../hooks/useAniList.js';

export default function Characters() {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(null);
  const { characters, loading } = useCharacters(query);

  return (
    <PageTransition className="py-8">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-neon-pink">Character Universe</p>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Meet the icons</h1>
        <p className="mt-2 text-white/50">Search thousands of characters from the AniList database</p>
      </div>

      <div className="glass-strong mb-8 rounded-3xl p-4">
        <label className="flex items-center rounded-2xl border border-white/10 bg-white/[0.06] px-4">
          <FiSearch className="text-neon-blue" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent px-3 py-3 outline-none placeholder:text-white/35"
            placeholder="Search characters..."
          />
          {loading && <div className="h-5 w-5 animate-spin rounded-full border-2 border-neon-blue/30 border-t-neon-blue" />}
        </label>
      </div>

      {loading && characters.length === 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="glass rounded-3xl p-5">
              <div className="mb-5 aspect-square skeleton-shimmer rounded-3xl" />
              <div className="h-5 w-2/3 skeleton-shimmer rounded-lg" />
              <div className="mt-2 h-4 w-1/2 skeleton-shimmer rounded-lg" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {characters.map((character, index) => (
            <motion.button
              key={character.id}
              className="glass group rounded-3xl p-5 text-left transition hover:border-neon-blue/50"
              onClick={() => setActive(character)}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              whileHover={{ y: -8 }}
            >
              <div className="relative mb-5 aspect-square overflow-hidden rounded-3xl">
                {character.image?.large ? (
                  <img
                    src={character.image.large}
                    alt={character.name?.full}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-gradient-to-br from-neon-blue/20 to-neon-pink/20">
                    <span className="font-display text-5xl font-bold text-white/30">
                      {character.name?.full?.split(' ').map((p) => p[0]).join('') || '?'}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-abyss/80 via-transparent to-transparent" />
              </div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-bold">{character.name?.full}</h2>
                  <p className="mt-1 text-sm text-white/55">
                    {character.media?.edges?.[0]
                      ? getTitle(character.media.edges[0].node)
                      : 'Unknown anime'}
                  </p>
                </div>
                <span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-sm text-neon-pink">
                  <FiHeart /> {character.favourites?.toLocaleString() || 0}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {!loading && characters.length === 0 && (
        <div className="mt-16 text-center">
          <p className="font-display text-2xl font-bold text-white/60">No characters found</p>
          <p className="mt-2 text-white/40">Try a different search term</p>
        </div>
      )}

      {/* Character Detail Modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[70] grid place-items-center bg-black/70 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              className="glass-strong relative w-full max-w-xl rounded-3xl p-6"
              initial={{ scale: 0.94, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute right-4 top-4 rounded-full bg-white/10 p-3"
                onClick={() => setActive(null)}
                aria-label="Close character details"
              >
                <FiX />
              </button>
              <div className="flex gap-5">
                {active.image?.large && (
                  <img
                    src={active.image.large}
                    alt={active.name?.full}
                    className="h-40 w-32 rounded-2xl object-cover"
                  />
                )}
                <div>
                  <h2 className="font-display text-3xl font-bold">{active.name?.full}</h2>
                  <p className="mt-1 flex items-center gap-2 text-neon-pink">
                    <FiHeart /> {active.favourites?.toLocaleString() || 0} favorites
                  </p>
                  {active.media?.edges?.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-white/40">Appears in</p>
                      <div className="mt-1 space-y-1">
                        {active.media.edges.slice(0, 3).map((edge) => (
                          <Link
                            key={edge.node.id}
                            to={`/anime/${edge.node.id}`}
                            className="block text-sm text-neon-blue hover:text-white"
                            onClick={() => setActive(null)}
                          >
                            {getTitle(edge.node)}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {active.description && (
                <p className="mt-5 max-h-40 overflow-y-auto text-sm leading-7 text-white/65 search-dropdown">
                  {active.description.replace(/<[^>]*>/g, '').slice(0, 500)}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
