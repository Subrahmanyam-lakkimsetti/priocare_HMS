// src/components/AnimatedAuthLayout.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const variants = {
  enter: {
    opacity: 0,
    scale: 0.99,
  },
  center: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    scale: 0.99,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

export default function AnimatedAuthLayout({ children }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        className="w-full min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
