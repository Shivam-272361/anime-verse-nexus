import { motion } from 'framer-motion';

const particles = Array.from({ length: 42 }, (_, index) => ({
  id: index,
  left: `${(index * 37) % 100}%`,
  top: `${(index * 53) % 100}%`,
  delay: (index % 8) * 0.35,
  size: 2 + (index % 4),
}));

export default function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-[0.07] [background-size:42px_42px]" />
      <div className="absolute inset-x-0 bottom-[-18rem] h-[34rem] bg-grid grid-floor opacity-30" />
      <motion.div
        className="absolute left-[-12rem] top-24 h-96 w-96 rounded-full bg-neon-blue/20 blur-3xl"
        animate={{ x: [0, 60, 10], y: [0, 30, -10], scale: [1, 1.15, 1] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-[-14rem] top-10 h-[30rem] w-[30rem] rounded-full bg-neon-pink/20 blur-3xl"
        animate={{ x: [0, -70, 0], y: [0, 55, 20], scale: [1, 0.9, 1.1] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-10 left-1/3 h-[28rem] w-[28rem] rounded-full bg-neon-purple/20 blur-3xl"
        animate={{ y: [0, -55, 0], scale: [1, 1.15, 0.95] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full bg-white shadow-[0_0_20px_rgba(65,215,255,0.85)]"
          style={{ left: particle.left, top: particle.top, width: particle.size, height: particle.size }}
          animate={{ opacity: [0.1, 0.9, 0.1], y: [0, -26, 0], scale: [1, 1.8, 1] }}
          transition={{ duration: 5 + (particle.id % 5), delay: particle.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}
