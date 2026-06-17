import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1300);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center bg-abyss"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="text-center">
            <motion.div
              className="mx-auto mb-6 h-24 w-24 rounded-full border border-neon-blue/30"
              animate={{ rotate: 360, boxShadow: ['0 0 18px #41d7ff33', '0 0 54px #ff4fd855', '0 0 18px #41d7ff33'] }}
              transition={{ rotate: { duration: 1.7, repeat: Infinity, ease: 'linear' }, boxShadow: { duration: 1.2, repeat: Infinity } }}
            >
              <div className="m-3 h-16 w-16 rounded-full border border-neon-pink/50 bg-gradient-to-br from-neon-blue/30 to-neon-pink/30" />
            </motion.div>
            <motion.h1 className="font-display text-3xl font-bold neon-text" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.2, repeat: Infinity }}>
              AnimeVerse Nexus
            </motion.h1>
            <p className="mt-2 text-sm uppercase tracking-[0.35em] text-white/40">Synchronizing galaxy</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
