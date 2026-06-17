import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 500, damping: 36 });
  const smoothY = useSpring(y, { stiffness: 500, damping: 36 });

  useEffect(() => {
    const move = (event) => {
      setVisible(true);
      x.set(event.clientX - 14);
      y.set(event.clientY - 14);
      document.documentElement.style.setProperty('--cursor-x', `${event.clientX}px`);
      document.documentElement.style.setProperty('--cursor-y', `${event.clientY}px`);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [x, y]);

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[120] hidden h-7 w-7 rounded-full border border-neon-blue/70 mix-blend-screen shadow-glow md:block"
      style={{ x: smoothX, y: smoothY, opacity: visible ? 1 : 0 }}
    />
  );
}
