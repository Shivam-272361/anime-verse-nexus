import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiCpu, FiRefreshCw, FiZap } from 'react-icons/fi';
import AnimeCard from '../components/AnimeCard.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import PageTransition from '../components/PageTransition.jsx';
import { GENRES, searchAnime } from '../api/anilistApi.js';
import { useTrending } from '../hooks/useAniList.js';

export default function Recommendations() {
  const [selectedGenres, setSelectedGenres] = useState(['Sci-Fi', 'Drama']);
  const [generated, setGenerated] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const { data: defaultAnime, loading: defaultLoading } = useTrending(20);

  const toggleGenre = (genre) => {
    setSelectedGenres((current) =>
      current.includes(genre) ? current.filter((item) => item !== genre) : [...current, genre],
    );
  };

  const generate = useCallback(async () => {
    setLoading(true);
    setGenerated(true);
    try {
      const results = [];
      // Fetch for each selected genre and merge
      for (const genre of selectedGenres.slice(0, 3)) {
        const page = await searchAnime('', genre, ['SCORE_DESC'], 1, 10);
        results.push(...(page.media || []));
      }
      // Deduplicate and sort by score
      const unique = [...new Map(results.map((a) => [a.id, a])).values()];
      unique.sort((a, b) => (b.averageScore || 0) - (a.averageScore || 0));
      setRecommendations(unique.slice(0, 12));
    } catch (err) {
      console.error('Failed to generate recommendations:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedGenres]);

  const displayAnime = generated ? recommendations : defaultAnime.slice(0, 8);

  return (
    <PageTransition className="py-8">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-neon-mint">AI Recommendation Lab</p>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Tune your anime DNA</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[26rem_1fr]">
        <aside className="glass-strong h-fit rounded-3xl p-5">
          <h2 className="flex items-center gap-2 font-display text-2xl font-bold">
            <FiCpu className="text-neon-blue" /> Preference Engine
          </h2>
          <p className="mt-2 text-sm leading-6 text-white/55">
            Select genres that match your mood. We&apos;ll find the highest-rated anime from AniList.
          </p>

          <div className="mt-6">
            <p className="mb-3 text-sm uppercase tracking-[0.22em] text-white/45">Genres</p>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((genre) => (
                <button
                  key={genre}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    selectedGenres.includes(genre)
                      ? 'border-neon-blue bg-neon-blue text-abyss'
                      : 'border-white/15 bg-white/[0.05] text-white/65 hover:text-white'
                  }`}
                  onClick={() => toggleGenre(genre)}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          <button
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-neon-blue to-neon-pink px-5 py-4 font-bold text-white shadow-glow transition hover:scale-[1.02] disabled:opacity-50"
            onClick={generate}
            disabled={selectedGenres.length === 0 || loading}
          >
            <FiZap /> {loading ? 'Generating...' : 'Generate recommendations'}
          </button>
        </aside>

        <div className="space-y-6">
          <div className="glass rounded-3xl p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold">Model Progress</h2>
              <FiRefreshCw className={loading ? 'animate-spin text-neon-blue' : generated ? 'text-neon-mint' : 'text-white/40'} />
            </div>
            {['Taste vector', 'Genre overlap', 'Narrative energy', 'Visual mood'].map((label, index) => {
              const value = generated ? 88 + index * 3 : loading ? 50 + index * 10 : 34 + index * 9;
              return (
                <div key={label} className="mb-4 last:mb-0">
                  <div className="mb-2 flex justify-between text-sm text-white/60">
                    <span>{label}</span>
                    <span>{value}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-neon-blue to-neon-pink"
                      initial={false}
                      animate={{ width: `${value}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={generated ? 'generated' : 'default'}
              className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {loading || defaultLoading ? (
                Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={`skel-${i}`} compact />)
              ) : (
                displayAnime.slice(0, 8).map((anime, index) => (
                  <div key={anime.id} className="relative">
                    {generated && anime.averageScore && (
                      <span className="absolute right-3 top-3 z-10 rounded-full bg-neon-blue px-3 py-1 text-xs font-bold text-abyss">
                        {anime.averageScore}% Score
                      </span>
                    )}
                    <AnimeCard anime={anime} index={index} compact />
                  </div>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}
