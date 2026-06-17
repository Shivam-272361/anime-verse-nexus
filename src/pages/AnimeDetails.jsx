import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiClock, FiPlay, FiStar, FiTv, FiCalendar, FiBarChart2 } from 'react-icons/fi';
import AnimeCard from '../components/AnimeCard.jsx';
import PageTransition from '../components/PageTransition.jsx';
import TrailerModal from '../components/TrailerModal.jsx';
import { getTitle, getScore } from '../api/anilistApi.js';
import { useAnimeDetails } from '../hooks/useAniList.js';

export default function AnimeDetails() {
  const { id } = useParams();
  const [trailer, setTrailer] = useState(false);
  const { data: anime, loading, error } = useAnimeDetails(Number(id));

  if (loading) return <DetailsSkeleton />;
  if (error || !anime) {
    return (
      <PageTransition className="grid min-h-[60vh] place-items-center">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold">Anime not found</h1>
          <Link to="/explore" className="mt-4 inline-block text-neon-blue hover:text-white">Back to Explore</Link>
        </div>
      </PageTransition>
    );
  }

  const title = getTitle(anime);
  const romajiTitle = anime.title?.romaji;
  const englishTitle = anime.title?.english;
  const score = getScore(anime);
  const banner = anime.bannerImage || anime.coverImage?.extraLarge;
  const characters = anime.characters?.edges || [];
  const recommendations = (anime.recommendations?.edges || []).map((e) => e.node?.mediaRecommendation).filter(Boolean);
  const relations = (anime.relations?.edges || []).filter((e) => e.node?.type === 'ANIME');
  const studios = (anime.studios?.edges || []).filter((e) => e.isMain).map((e) => e.node);
  const allStudios = (anime.studios?.edges || []).map((e) => e.node);
  const rankings = anime.rankings || [];

  return (
    <PageTransition>
      {/* Banner */}
      <section className="-mx-4 min-h-[34rem] bg-cover bg-center sm:-mx-6 lg:-mx-8" style={{ backgroundImage: `url(${banner})` }}>
        <div className="flex min-h-[34rem] items-end bg-gradient-to-t from-abyss via-abyss/65 to-abyss/10 px-4 pb-10 sm:px-6 lg:px-8">
          <div className="grid w-full gap-6 lg:grid-cols-[18rem_1fr]">
            <motion.div className="hidden overflow-hidden rounded-3xl border border-white/15 shadow-2xl lg:block" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <img src={anime.coverImage?.extraLarge} alt={`${title} poster`} className="h-[26rem] w-full object-cover" />
            </motion.div>
            <div className="self-end">
              <div className="mb-4 flex flex-wrap gap-2">
                {(anime.genres || []).map((tag) => (
                  <span key={tag} className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-white/75 backdrop-blur-xl">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="font-display text-5xl font-bold neon-text sm:text-7xl">{title}</h1>
              {romajiTitle && englishTitle && romajiTitle !== englishTitle && (
                <p className="mt-2 text-lg text-white/50">{romajiTitle}</p>
              )}
              <p className="mt-5 max-w-3xl text-lg leading-8 text-white/72">
                {anime.description?.replace(/<[^>]*>/g, '') || 'No description available.'}
              </p>
              <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/70">
                {score && (
                  <span className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3">
                    <FiStar className="text-amber-300" /> {score} / 10
                  </span>
                )}
                {anime.episodes && (
                  <span className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3">
                    <FiClock /> {anime.episodes} Episodes
                  </span>
                )}
                {anime.status && (
                  <span className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3">
                    <FiTv /> {anime.status.replace(/_/g, ' ')}
                  </span>
                )}
                {anime.season && anime.seasonYear && (
                  <span className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3">
                    <FiCalendar /> {anime.season} {anime.seasonYear}
                  </span>
                )}
                {studios.length > 0 && (
                  <span className="rounded-2xl bg-white/10 px-4 py-3">{studios.map((s) => s.name).join(', ')}</span>
                )}
              </div>
              <button
                className="mt-6 flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-bold text-abyss transition hover:scale-[1.03]"
                onClick={() => setTrailer(true)}
              >
                <FiPlay /> {anime.trailer?.id ? 'Watch Trailer' : 'Open Trailer'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 py-10 xl:grid-cols-[1fr_24rem]">
        <div className="space-y-6">
          {/* Rankings */}
          {rankings.length > 0 && (
            <div className="glass rounded-3xl p-6">
              <h2 className="flex items-center gap-2 font-display text-2xl font-bold"><FiBarChart2 className="text-neon-blue" /> Rankings</h2>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {rankings.filter((r) => r.allTime).slice(0, 6).map((ranking, i) => (
                  <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                    <span className="text-xs text-neon-blue">#{ranking.rank}</span>
                    <h3 className="mt-2 font-bold capitalize">{ranking.context}</h3>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Anime */}
          {relations.length > 0 && (
            <div>
              <h2 className="mb-5 font-display text-2xl font-bold">Related Anime</h2>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {relations.slice(0, 8).map((rel, index) => (
                  <div key={rel.node.id} className="relative">
                    <span className="absolute left-3 top-3 z-10 rounded-full border border-white/15 bg-abyss/80 px-2 py-0.5 text-xs text-neon-blue backdrop-blur">
                      {rel.relationType?.replace(/_/g, ' ')}
                    </span>
                    <AnimeCard anime={rel.node} index={index} compact />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div>
              <h2 className="mb-5 font-display text-2xl font-bold">Recommendations</h2>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {recommendations.slice(0, 8).map((rec, index) => (
                  <AnimeCard anime={rec} key={rec.id} index={index} compact />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Characters Sidebar */}
        <aside className="glass-strong h-fit rounded-3xl p-5">
          <h2 className="font-display text-2xl font-bold">Characters</h2>
          <div className="mt-5 space-y-3">
            {characters.length > 0 ? characters.slice(0, 8).map((edge) => (
              <div key={edge.node.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-3 transition hover:border-neon-blue/40">
                <img
                  src={edge.node.image?.large}
                  alt={edge.node.name?.full}
                  className="h-12 w-12 rounded-xl object-cover"
                  loading="lazy"
                />
                <span>
                  <span className="block font-bold">{edge.node.name?.full}</span>
                  <span className="text-sm text-white/50 capitalize">{edge.role?.toLowerCase()}</span>
                </span>
              </div>
            )) : (
              <p className="text-sm text-white/40">No character data available</p>
            )}
          </div>

          {/* Studios */}
          {allStudios.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-3 text-sm uppercase tracking-[0.2em] text-white/45">Studios</h3>
              <div className="flex flex-wrap gap-2">
                {allStudios.map((studio) => (
                  <span key={studio.id} className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-sm text-white/70">
                    {studio.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>
      </section>
      <TrailerModal open={trailer} onClose={() => setTrailer(false)} anime={anime} />
    </PageTransition>
  );
}

function DetailsSkeleton() {
  return (
    <PageTransition>
      <section className="-mx-4 min-h-[34rem] sm:-mx-6 lg:-mx-8">
        <div className="flex min-h-[34rem] items-end bg-gradient-to-t from-abyss to-abyss/50 px-4 pb-10 sm:px-6 lg:px-8">
          <div className="grid w-full gap-6 lg:grid-cols-[18rem_1fr]">
            <div className="hidden h-[26rem] w-full skeleton-shimmer rounded-3xl lg:block" />
            <div className="self-end space-y-4">
              <div className="flex gap-2">
                <span className="h-7 w-20 skeleton-shimmer rounded-full" />
                <span className="h-7 w-16 skeleton-shimmer rounded-full" />
              </div>
              <div className="h-16 w-3/4 skeleton-shimmer rounded-2xl" />
              <div className="h-6 w-full max-w-2xl skeleton-shimmer rounded-xl" />
              <div className="h-6 w-2/3 skeleton-shimmer rounded-xl" />
              <div className="flex gap-3">
                <span className="h-12 w-36 skeleton-shimmer rounded-2xl" />
                <span className="h-12 w-36 skeleton-shimmer rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
