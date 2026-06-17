import { motion } from 'framer-motion';

export default function PageTransition({ children, className = '' }) {
  return (
    <motion.main
      className={`min-h-screen ${className}`}
      initial={{ opacity: 0, y: 22, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -18, filter: 'blur(10px)' }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.main>
  );
}
