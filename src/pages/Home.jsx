import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiPlay, FiSearch, FiStar, FiZap } from 'react-icons/fi';
import AnimeCard from '../components/AnimeCard.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import Counter from '../components/Counter.jsx';
import PageTransition from '../components/PageTransition.jsx';
import HeroWorld from '../three/HeroWorld.jsx';
import { getTitle, getScore } from '../api/anilistApi.js';
import { useTrending } from '../hooks/useAniList.js';

export default function Home() {
  const { data: trending, loading } = useTrending(50);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const featured = trending[0];
  const secondary = trending[1];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/explore?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative -mx-4 min-h-[calc(100vh-5rem)] overflow-hidden px-4 py-10 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <HeroWorld />
        <div className="relative z-10 grid min-h-[calc(100vh-8rem)] items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-4xl">
            <motion.div
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-neon-blue/25 bg-neon-blue/10 px-4 py-2 text-sm text-neon-blue"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <FiZap />
              {loading ? 'Loading trending...' : `Trending now: ${getTitle(featured)}`}
            </motion.div>
            <motion.h1
              className="font-display text-5xl font-bold leading-[0.95] tracking-tight neon-text sm:text-7xl lg:text-8xl"
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            >
              AnimeVerse Nexus
            </motion.h1>
            <motion.p
              className="mt-6 max-w-2xl text-lg leading-8 text-white/68 sm:text-xl"
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
            >
              Discover cinematic worlds, track your watch DNA, and navigate anime like a glowing star map — powered by a living database of thousands.
            </motion.p>

            <motion.form
              onSubmit={handleSearch}
              className="mt-8 flex max-w-2xl items-center rounded-3xl border border-white/15 bg-white/[0.08] p-2 shadow-glow backdrop-blur-2xl"
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <FiSearch className="ml-4 text-xl text-neon-blue" />
              <input
                className="min-w-0 flex-1 bg-transparent px-4 py-4 text-white outline-none placeholder:text-white/35"
                placeholder="Search thousands of anime..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Link to="/explore" className="rounded-2xl bg-white px-5 py-3 font-bold text-abyss transition hover:scale-[1.03]">
                Explore
              </Link>
            </motion.form>

            <motion.div className="mt-8 flex flex-wrap gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }}>
              <Link to="/galaxy" className="group rounded-2xl bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink p-[1px]">
                <span className="flex items-center gap-2 rounded-2xl bg-abyss px-6 py-4 font-bold transition group-hover:bg-transparent">
                  Enter Galaxy <FiArrowRight />
                </span>
              </Link>
              <Link
                to="/characters"
                className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.08] px-6 py-4 font-bold text-white/85 transition hover:border-neon-pink/50 hover:text-white"
              >
                <FiPlay /> Characters
              </Link>
            </motion.div>
          </div>

          {/* Featured Card */}
          {featured ? (
            <motion.div
              className="glass-strong relative ml-auto hidden w-full max-w-md overflow-hidden rounded-[2rem] p-4 lg:block"
              initial={{ opacity: 0, x: 60, rotate: 2 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ delay: 0.25, duration: 0.75 }}
            >
              <Link to={`/anime/${featured.id}`}>
                <div
                  className="h-[34rem] rounded-[1.5rem] bg-cover bg-center"
                  style={{ backgroundImage: `url(${featured.coverImage?.extraLarge})` }}
                >
                  <div className="flex h-full flex-col justify-end rounded-[1.5rem] bg-gradient-to-t from-abyss via-abyss/20 to-transparent p-6">
                    <p className="text-sm uppercase tracking-[0.32em] text-neon-blue">Now Trending</p>
                    <h2 className="mt-2 font-display text-4xl font-bold">{getTitle(featured)}</h2>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/68">
                      {featured.description?.replace(/<[^>]*>/g, '').slice(0, 160)}
                    </p>
                    {featured.averageScore && (
                      <div className="mt-3 flex items-center gap-2 text-amber-300">
                        <FiStar /> {getScore(featured)} / 10
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ) : loading ? (
            <div className="glass-strong ml-auto hidden h-[36rem] w-full max-w-md animate-pulse rounded-[2rem] lg:block" />
          ) : null}
        </div>
      </section>

      {/* Trending Carousel */}
      <section className="py-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-neon-pink">Hot Queue</p>
            <h2 className="mt-2 font-display text-3xl font-bold">Trending Anime</h2>
          </div>
          <Link to="/explore" className="hidden text-sm font-bold text-neon-blue hover:text-white sm:block">
            View all
          </Link>
        </div>
        {loading ? (
          <div className="-mx-4 flex gap-5 overflow-hidden px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-72 flex-none">
                <SkeletonCard compact />
              </div>
            ))}
          </div>
        ) : (
          <div className="scroll-fade -mx-4 overflow-hidden px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div
              className="trending-scroll flex gap-5"
              style={{ '--scroll-duration': `${trending.length * 3}s`, width: 'max-content' }}
            >
              {/* Duplicate for infinite scroll effect */}
              {[...trending, ...trending].map((anime, index) => (
                <div key={`${anime.id}-${index}`} className="w-72 flex-none">
                  <AnimeCard anime={anime} index={index % trending.length} compact />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Featured Banner */}
      {secondary && (
        <section className="grid gap-6 py-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="glass-strong overflow-hidden rounded-3xl">
            <div
              className="min-h-[26rem] bg-cover bg-center"
              style={{ backgroundImage: `url(${secondary.bannerImage || secondary.coverImage?.extraLarge})` }}
            >
              <div className="flex min-h-[26rem] flex-col justify-end bg-gradient-to-r from-abyss via-abyss/65 to-transparent p-6 sm:p-10">
                <p className="text-sm uppercase tracking-[0.3em] text-neon-blue">Featured</p>
                <h2 className="mt-3 max-w-xl font-display text-4xl font-bold">{getTitle(secondary)}</h2>
                <p className="mt-4 max-w-xl leading-7 text-white/68">
                  {secondary.description?.replace(/<[^>]*>/g, '').slice(0, 200)}
                </p>
                <Link
                  to={`/anime/${secondary.id}`}
                  className="mt-6 w-fit rounded-2xl bg-white px-5 py-3 font-bold text-abyss transition hover:scale-[1.03]"
                >
                  View details
                </Link>
              </div>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <Counter value={trending.length * 168} suffix="K" label="Anime scans this month" />
            <Counter value={97} suffix="%" label="Recommendation match rate" />
            <Counter value={128} suffix="M" label="Community watch minutes" />
          </div>
        </section>
      )}

      {/* Popular Right Now */}
      {trending.length > 6 && (
        <section className="py-8">
          <div className="glass rounded-3xl p-6 sm:p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-neon-mint">Popular Right Now</p>
            <div className="mt-5 grid gap-5 md:grid-cols-3">
              {trending.slice(3, 6).map((anime, index) => (
                <motion.div
                  key={anime.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.05] p-5"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 5 + index, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Link to={`/anime/${anime.id}`} className="flex items-center gap-4">
                    <img
                      src={anime.coverImage?.large}
                      alt={getTitle(anime)}
                      className="h-20 w-14 rounded-xl object-cover"
                      loading="lazy"
                    />
                    <div>
                      <h3 className="font-display text-lg font-bold">{getTitle(anime)}</h3>
                      <p className="mt-1 text-sm text-white/50">{(anime.genres || []).slice(0, 2).join(' · ')}</p>
                      {anime.averageScore && (
                        <p className="mt-2 flex items-center gap-1 text-sm text-amber-300">
                          <FiStar /> {getScore(anime)}
                        </p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </PageTransition>
  );
}
