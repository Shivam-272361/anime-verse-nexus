import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiPlay, FiStar } from 'react-icons/fi';
import { getTitle, getScore } from '../api/anilistApi.js';

export default function AnimeCard({ anime, index = 0, compact = false }) {
  const title = getTitle(anime);
  const score = getScore(anime);
  const image = anime.coverImage?.extraLarge || anime.coverImage?.large || '';
  const genres = anime.genres || [];
  const year = anime.seasonYear;

  return (
    <motion.article
      className="group animated-border rounded-[1.35rem]"
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.04 }}
      whileHover={{ y: -8 }}
    >
      <Link to={`/anime/${anime.id}`} className="block rounded-[1.25rem] bg-abyss p-[1px]">
        <div className="glass-strong overflow-hidden rounded-[1.2rem]">
          <div className={`${compact ? 'h-52' : 'h-72'} relative overflow-hidden`}>
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/20 to-transparent" />
            <button className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur-xl transition group-hover:opacity-100" aria-label={`Preview ${title}`}>
              <FiPlay />
            </button>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="mb-3 flex flex-wrap gap-2">
                {genres.slice(0, 2).map((genre) => (
                  <span key={genre} className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/75 backdrop-blur-xl">
                    {genre}
                  </span>
                ))}
              </div>
              <h3 className="font-display text-xl font-bold line-clamp-1">{title}</h3>
              <div className="mt-2 flex items-center justify-between text-sm text-white/65">
                <span>{year || '\u2014'}</span>
                {score && (
                  <span className="flex items-center gap-1 text-amber-300">
                    <FiStar /> {score}
                  </span>
                )}
              </div>
            </div>
          </div>
          {!compact && (
            <div className="p-4">
              <p className="line-clamp-2 text-sm leading-6 text-white/58">
                {anime.description?.replace(/<[^>]*>/g, '').slice(0, 150) || 'No description available.'}
              </p>
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  );
}
