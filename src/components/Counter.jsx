import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function Counter({ value, suffix = '', label }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 70, damping: 18 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, motionValue, value]);

  useEffect(() => spring.on('change', (latest) => setDisplay(Math.round(latest))), [spring]);

  return (
    <motion.div ref={ref} className="glass rounded-3xl p-5" whileHover={{ y: -6, borderColor: 'rgba(65,215,255,0.45)' }}>
      <p className="font-display text-4xl font-bold neon-text">
        {display}
        {suffix}
      </p>
      <p className="mt-1 text-sm text-white/55">{label}</p>
    </motion.div>
  );
}
