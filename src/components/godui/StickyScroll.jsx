import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';

/*
 * GodUI Sticky Scroll — manual registry installation from:
 * https://godui.design/r/sticky-scroll.json
 *
 * The official component structure, active-step observer, AnimatePresence
 * visual swap and reduced-motion handling are retained. The registry version
 * owns an internal overflow-y scroller; this project adapts the observer to
 * window scroll so the page remains the only scroll surface.
 */
const SPRING = { type: 'spring', stiffness: 320, damping: 32, mass: .9 };

export const StickyScroll = React.forwardRef(function StickyScroll(
  { items, className = '', ...props },
  forwardedRef,
) {
  const reduce = useReducedMotion();
  const containerRef = useRef(null);
  const itemRefs = useRef([]);
  const [active, setActive] = useState(0);
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 820px)').matches);

  useImperativeHandle(forwardedRef, () => containerRef.current);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const index = itemRefs.current.indexOf(entry.target);
        if (index !== -1) setActive(index);
      }
    }, { root: null, rootMargin: '-46% 0px -46% 0px', threshold: 0 });

    for (const element of itemRefs.current) if (element) observer.observe(element);
    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 820px)');
    const update = event => setMobile(event.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  const transition = reduce ? { duration: 0 } : SPRING;

  return <div ref={containerRef} data-slot="sticky-scroll" className={`sticky-scroll ${className}`} {...props}>
    <div className="sticky-scroll__grid">
      <div className="sticky-scroll__steps">
        {items.map((item, index) => {
          const isActive = index === active;
          return <motion.article
            id={item.id}
            tabIndex={item.id ? -1 : undefined}
            key={item.title}
            ref={element => { itemRefs.current[index] = element; }}
            data-active={isActive ? 'true' : 'false'}
            className="sticky-scroll__step"
            animate={{ opacity: mobile ? 1 : isActive ? 1 : .3 }}
            transition={transition}
          >
            <motion.span
              className="sticky-scroll__marker"
              aria-hidden="true"
              animate={{ scaleY: isActive ? 1 : .35, opacity: isActive ? 1 : .25 }}
              transition={transition}
            />
            <motion.div
              className="sticky-scroll__copy"
              initial={mobile && !reduce ? { opacity: 0, y: 24 } : false}
              whileInView={mobile ? { opacity: 1, y: 0 } : undefined}
              viewport={{ once: true, amount: .28 }}
              transition={reduce ? { duration: 0 } : { duration: .58, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2>{item.title}</h2>
              <div>{item.description}</div>
            </motion.div>
            <motion.div
              className="sticky-scroll__mobile-visual"
              initial={mobile && !reduce ? { opacity: 0, y: 18, scale: .96 } : false}
              whileInView={mobile ? { opacity: 1, y: 0, scale: 1 } : undefined}
              viewport={{ once: true, amount: .18 }}
              transition={reduce ? { duration: 0 } : { duration: .72, ease: [0.22, 1, 0.36, 1] }}
            >{item.content}</motion.div>
          </motion.article>;
        })}
      </div>

      <div className="sticky-scroll__visual-column">
        <div className="sticky-scroll__visual">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              className="sticky-scroll__visual-inner"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: 8 }}
              transition={transition}
            >
              {items[active]?.content}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  </div>;
});
