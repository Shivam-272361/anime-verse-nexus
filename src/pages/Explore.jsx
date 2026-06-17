import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiLoader } from 'react-icons/fi';
import AnimeCard from '../components/AnimeCard.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import PageTransition from '../components/PageTransition.jsx';
import { GENRES } from '../api/anilistApi.js';
import { useInfiniteAnime, useSearch } from '../hooks/useAniList.js';

const SORT_OPTIONS = [
  { label: 'Trending', value: 'TRENDING_DESC' },
  { label: 'Popular', value: 'POPULARITY_DESC' },
  { label: 'Highest Rated', value: 'SCORE_DESC' },
  { label: 'Newest', value: 'START_DATE_DESC' },
  { label: 'A–Z', value: 'TITLE_ENGLISH' },
];

export default function Explore() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [genre, setGenre] = useState('All');
  const [sort, setSort] = useState('TRENDING_DESC');
  const sentinelRef = useRef(null);

  // Use search hook when there's a query, otherwise infinite scroll
  const { results: searchResults, loading: searchLoading } = useSearch(
    query.length >= 2 ? query : '',
    genre !== 'All' ? genre : null,
    [sort],
  );

  const {
    anime: browseAnime,
    loading: browseLoading,
    loadMore,
    hasMore,
  } = useInfiniteAnime(genre !== 'All' ? genre : null, [sort]);

  const isSearching = query.length >= 2;
  const displayAnime = isSearching ? searchResults : browseAnime;
  const isLoading = isSearching ? searchLoading : browseLoading;

  // Infinite scroll observer
  useEffect(() => {
    if (isSearching || !sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) loadMore();
      },
      { rootMargin: '400px' },
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [isSearching, hasMore, loadMore]);

  return (
    <PageTransition className="py-8">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-neon-blue">Explore</p>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Find your next obsession</h1>
        <p className="mt-2 text-white/50">Browse thousands of anime from the AniList database</p>
      </div>

      {/* Filters */}
      <div className="glass-strong sticky top-24 z-20 mb-8 rounded-3xl p-4">
        <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr]">
          <label className="flex items-center rounded-2xl border border-white/10 bg-white/[0.06] px-4">
            <FiSearch className="text-neon-blue" />
            <input
              className="w-full bg-transparent px-3 py-3 outline-none placeholder:text-white/35"
              placeholder="Search anime..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <Select label="Genre" value={genre} onChange={setGenre} options={['All', ...GENRES]} />
          <Select
            label="Sort"
            value={sort}
            onChange={setSort}
            options={SORT_OPTIONS.map((s) => s.value)}
            labels={SORT_OPTIONS.map((s) => s.label)}
          />
        </div>
        {/* Genre Pills */}
        <div className="mt-3 flex flex-wrap gap-2">
          {['All', ...GENRES].map((g) => (
            <button
              key={g}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                genre === g
                  ? 'border-neon-blue bg-neon-blue text-abyss'
                  : 'border-white/10 bg-white/[0.04] text-white/55 hover:border-white/20 hover:text-white'
              }`}
              onClick={() => setGenre(g)}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <motion.div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4" layout>
        {displayAnime.map((anime, index) => (
          <AnimeCard anime={anime} key={anime.id} index={index % 20} />
        ))}
        {isLoading &&
          Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={`skeleton-${i}`} />)}
      </motion.div>

      {/* Empty state */}
      {!isLoading && displayAnime.length === 0 && (
        <div className="mt-16 text-center">
          <p className="font-display text-2xl font-bold text-white/60">No anime found</p>
          <p className="mt-2 text-white/40">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Infinite scroll sentinel */}
      {!isSearching && hasMore && <div ref={sentinelRef} className="h-10" />}

      {/* Loading more indicator */}
      {!isSearching && browseLoading && browseAnime.length > 0 && (
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-3 text-white/50">
            <FiLoader className="animate-spin text-neon-blue" />
            Loading more anime...
          </div>
        </div>
      )}
    </PageTransition>
  );
}

function Select({ label, value, onChange, options, labels }) {
  return (
    <label className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-2">
      <span className="text-xs uppercase tracking-[0.2em] text-white/45">{label}</span>
      <select
        className="mt-1 w-full bg-transparent text-sm font-semibold text-white outline-none"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option, i) => (
          <option key={option} className="bg-abyss text-white" value={option}>
            {labels ? labels[i] : option}
          </option>
        ))}
      </select>
    </label>
  );
}
