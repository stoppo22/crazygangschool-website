import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { forwardRef, useId, useRef, useState } from 'react';

/* GodUI Accordion installed from https://godui.design/r/accordion.json.
 * Disclosure state, aria wiring, AnimatePresence height reveal and reduced
 * motion are preserved; rendering is adapted to the custom-CSS faculty UI. */
const MOTION_PRESETS = {
  smooth: { height: { bounce: 0, duration: .4 }, content: { bounce: 0, duration: .4 }, lift: 6 },
  spring: { height: { bounce: .05, duration: .45 }, content: { bounce: .3, duration: .5 }, lift: 10 },
  bounce: { height: { bounce: .12, duration: .5 }, content: { bounce: .55, duration: .6 }, lift: 14 },
};

export const Accordion = forwardRef(function Accordion({
  items, type = 'single', defaultValue, value, onValueChange, onPreviewChange,
  collapsible = true, animation = 'smooth', className = '', ...props
}, forwardedRef) {
  const reduceMotion = useReducedMotion();
  const preset = MOTION_PRESETS[animation];
  const generatedId = useId().replaceAll(':', '');
  const triggerRefs = useRef([]);
  const controlled = value !== undefined;
  const [internalOpen, setInternalOpen] = useState(() => defaultValue === undefined ? [] : Array.isArray(defaultValue) ? defaultValue : [defaultValue]);
  const open = controlled ? (Array.isArray(value) ? value : value ? [value] : []) : internalOpen;
  const setOpen = next => { if (!controlled) setInternalOpen(next); onValueChange?.(type === 'single' ? next[0] ?? null : next); };
  const toggle = itemValue => {
    const isOpen = open.includes(itemValue);
    if (type === 'single') { setOpen(isOpen && collapsible ? [] : isOpen ? open : [itemValue]); return; }
    setOpen(isOpen ? open.filter(current => current !== itemValue) : [...open, itemValue]);
  };
  const moveFocus = (index, direction) => {
    const enabled = items.map((item, itemIndex) => ({ item, itemIndex })).filter(entry => !entry.item.disabled);
    const current = enabled.findIndex(entry => entry.itemIndex === index);
    const next = enabled[(current + direction + enabled.length) % enabled.length];
    triggerRefs.current[next.itemIndex]?.focus();
  };
  return <div ref={forwardedRef} className={`godui-accordion ${className}`} onMouseLeave={() => onPreviewChange?.(null)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) onPreviewChange?.(null); }} {...props}>
    {items.map((item, index) => {
      const isOpen = open.includes(item.value);
      const panelId = `accordion-panel-${generatedId}-${item.value}`;
      const triggerId = `accordion-trigger-${generatedId}-${item.value}`;
      return <div key={item.value} className="godui-accordion__item" data-open={isOpen ? 'true' : 'false'}>
        <h3><button ref={node => { triggerRefs.current[index] = node; }} type="button" id={triggerId} aria-expanded={isOpen} aria-controls={panelId} disabled={item.disabled} onMouseEnter={() => onPreviewChange?.(item.value)} onFocus={() => onPreviewChange?.(item.value)} onClick={() => toggle(item.value)} onKeyDown={event => {
          if (event.key === 'ArrowDown') { event.preventDefault(); moveFocus(index, 1); }
          if (event.key === 'ArrowUp') { event.preventDefault(); moveFocus(index, -1); }
          if (event.key === 'Home') { event.preventDefault(); triggerRefs.current[0]?.focus(); }
          if (event.key === 'End') { event.preventDefault(); triggerRefs.current.at(-1)?.focus(); }
        }} className="godui-accordion__trigger">{item.title}</button></h3>
        <AnimatePresence initial={false}>{isOpen && <motion.div id={panelId} role="region" aria-labelledby={triggerId} key="content" initial={reduceMotion ? false : { height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={reduceMotion ? undefined : { height: 0, opacity: 0 }} transition={{ height: { type: 'spring', ...preset.height }, opacity: { duration: .2 } }} className="godui-accordion__panel"><motion.div initial={reduceMotion ? false : { y: -preset.lift }} animate={{ y: 0 }} transition={reduceMotion ? undefined : { type: 'spring', ...preset.content, delay: .03 }} className="godui-accordion__content">{item.content}</motion.div></motion.div>}</AnimatePresence>
      </div>;
    })}
  </div>;
});
