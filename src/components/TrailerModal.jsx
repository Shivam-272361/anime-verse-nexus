import { AnimatePresence, motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { getTitle } from '../api/anilistApi.js';

export default function TrailerModal({ open, onClose, anime }) {
  const title = getTitle(anime);
  const banner = anime?.bannerImage || anime?.coverImage?.extraLarge || '';
  const trailerId = anime?.trailer?.id;
  const trailerSite = anime?.trailer?.site;

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[80] grid place-items-center bg-black/70 p-4 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/15 bg-abyss shadow-2xl"
            initial={{ scale: 0.94, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 20 }}
          >
            <button className="absolute right-4 top-4 z-10 rounded-full bg-black/40 p-3 text-white backdrop-blur-xl" onClick={onClose} aria-label="Close trailer">
              <FiX />
            </button>
            {trailerId && trailerSite === 'youtube' ? (
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${trailerId}?autoplay=1`}
                  title={`${title} Trailer`}
                  className="h-full w-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="aspect-video bg-cover bg-center" style={{ backgroundImage: `url(${banner})` }}>
                <div className="grid h-full place-items-center bg-black/45">
                  <div className="text-center">
                    <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full border border-neon-blue/50 bg-white/10 text-3xl shadow-glow">▶</div>
                    <h3 className="font-display text-3xl font-bold">{title} Trailer</h3>
                    <p className="mt-2 text-white/60">{trailerId ? 'Trailer available on ' + trailerSite : 'Trailer not yet available'}</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
