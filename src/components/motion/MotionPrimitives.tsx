import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';

export function WordReveal({
  text,
  className = '',
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const prefersReduced = useReducedMotion();
  const words = text.split(' ');

  if (prefersReduced) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span key={text} className={className}>
      {words.map((word, idx) => (
        <motion.span
          key={`${text.slice(0, 12)}-${word}-${idx}`}
          initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            duration: 0.44,
            delay: delay + idx * 0.04,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block mr-[0.26em] will-change-transform"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

export function TextFadeSwitch({
  textKey,
  children,
  className = '',
}: {
  textKey: string;
  children: React.ReactNode;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();
  if (prefersReduced) {
    return <span className={className}>{children}</span>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={textKey}
        initial={{ opacity: 0, y: 6, filter: 'blur(2px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -4, filter: 'blur(2px)' }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className={`inline-block ${className}`}
      >
        {children}
      </motion.span>
    </AnimatePresence>
  );
}

export function AnimatedHeadline({
  text,
  className = '',
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const prefersReduced = useReducedMotion();
  if (prefersReduced) {
    return <span className={className}>{text}</span>;
  }

  return (
    <motion.span
      key={text}
      initial={{ opacity: 0, y: 12, letterSpacing: '0.02em', filter: 'blur(3px)' }}
      whileInView={{ opacity: 1, y: 0, letterSpacing: '-0.02em', filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.52, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`inline-block ${className}`}
    >
      {text}
    </motion.span>
  );
}

export function AnimatedCounter({
  target,
  suffix = '',
}: {
  target: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const prefersReduced = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (prefersReduced) {
      setDisplay(target);
      return;
    }
    const duration = 900;
    const start = performance.now();
    let raf = 0;

    const frame = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, prefersReduced]);

  return (
    <span ref={ref} className="tabular-nums font-mono-num">
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

export function Tilt3DCard({
  children,
  className = '',
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const prefersReduced = useReducedMotion();
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -py * 7, ry: px * 7 });
  };

  const resetTilt = () => setTilt({ rx: 0, ry: 0 });

  return (
    <div
      onMouseMove={handleMove}
      onMouseLeave={resetTilt}
      onClick={onClick}
      style={{
        transform: prefersReduced
          ? undefined
          : `perspective(950px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: 'transform 220ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className={className}
    >
      {children}
    </div>
  );
}

export function RevealSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const prefersReduced = useReducedMotion();
  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
