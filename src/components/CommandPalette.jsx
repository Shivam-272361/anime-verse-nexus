import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCommand, FiSearch, FiStar } from 'react-icons/fi';
import { getTitle, getScore } from '../api/anilistApi.js';
import { useSearch } from '../hooks/useAniList.js';

const commands = [
  { label: 'Open Explore', path: '/explore' },
  { label: 'Open Anime Galaxy', path: '/galaxy' },
  { label: 'Open Character Universe', path: '/characters' },
  { label: 'Generate AI Recommendations', path: '/recommendations' },
  { label: 'Open User Profile', path: '/profile' },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const { results: animeResults, loading } = useSearch(open && query.length >= 2 ? query : '', null);

  useEffect(() => {
    const handler = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const filteredCommands = useMemo(
    () => commands.filter((command) => command.label.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  const run = (path) => {
    navigate(path);
    setOpen(false);
    setQuery('');
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] bg-black/60 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            className="mx-auto mt-24 max-w-2xl overflow-hidden rounded-3xl border border-white/15 bg-abyss/95 shadow-2xl"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
              <FiSearch className="text-neon-blue" />
              <input
                ref={inputRef}
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="flex-1 bg-transparent text-lg text-white outline-none placeholder:text-white/35"
                placeholder="Search anime or jump to..."
              />
              <span className="flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1 text-xs text-white/45">
                <FiCommand /> K
              </span>
            </div>
            <div className="max-h-[26rem] overflow-y-auto p-3 search-dropdown">
              {filteredCommands.length > 0 && (
                <div className="mb-2">
                  <p className="mb-1 px-3 text-xs uppercase tracking-[0.2em] text-white/30">Navigation</p>
                  {filteredCommands.map((command) => (
                    <button
                      key={command.path}
                      className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-white/75 transition hover:bg-white/10 hover:text-white"
                      onClick={() => run(command.path)}
                    >
                      {command.label}
                      <span className="text-xs text-neon-blue">Enter</span>
                    </button>
                  ))}
                </div>
              )}
              {query.length >= 2 && (
                <div>
                  <p className="mb-1 px-3 text-xs uppercase tracking-[0.2em] text-white/30">Anime</p>
                  {loading ? (
                    <div className="flex items-center gap-3 px-4 py-3 text-white/40">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-neon-blue/30 border-t-neon-blue" />
                      Searching AniList...
                    </div>
                  ) : animeResults.length > 0 ? (
                    animeResults.slice(0, 8).map((anime) => (
                      <button
                        key={anime.id}
                        className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left transition hover:bg-white/10"
                        onClick={() => run(`/anime/${anime.id}`)}
                      >
                        <img
                          src={anime.coverImage?.large}
                          alt=""
                          className="h-12 w-9 rounded-lg object-cover"
                          loading="lazy"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-white">{getTitle(anime)}</p>
                          <p className="truncate text-xs text-white/45">{(anime.genres || []).slice(0, 3).join(', ')}</p>
                        </div>
                        {anime.averageScore && (
                          <span className="flex items-center gap-1 text-sm text-amber-300">
                            <FiStar className="text-xs" /> {getScore(anime)}
                          </span>
                        )}
                      </button>
                    ))
                  ) : (
                    <p className="px-4 py-3 text-sm text-white/40">No anime found</p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
