import { useCallback, useLayoutEffect, useRef, useState } from 'react';

/*
 * GodUI Magic Tab — manual registry installation from:
 * https://godui.design/r/magic-tab.json
 *
 * Adapted for this project’s existing custom-CSS Vite stack:
 * - real anchor elements instead of tab buttons, because this is page navigation;
 * - one restrained moving indicator instead of the original 3D/rainbow treatment;
 * - no Tailwind/theme package added solely for one component.
 *
 * Controlled value, hover/focus preview, keyboard movement and reduced-motion
 * behavior follow the installed component’s interaction model.
 */
export function MagicTab({ items, value, onValueChange, className = '', ...props }) {
  const rootRef = useRef(null);
  const itemRefs = useRef(new Map());
  const [previewValue, setPreviewValue] = useState(null);
  const [indicator, setIndicator] = useState({ x: 0, width: 0, ready: false });
  const displayedValue = previewValue ?? value;

  const measure = useCallback(() => {
    const root = rootRef.current;
    const item = itemRefs.current.get(displayedValue);
    if (!root || !item) { setIndicator(previous => ({ ...previous, ready: false })); return; }
    const rootRect = root.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    setIndicator({ x: itemRect.left - rootRect.left, width: itemRect.width, ready: true });
  }, [displayedValue]);

  useLayoutEffect(() => {
    measure();
    const root = rootRef.current;
    if (!root || typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    return () => observer.disconnect();
  }, [measure]);

  const moveFocus = (current, direction) => {
    const index = items.findIndex(item => item.value === current);
    const next = items[(index + direction + items.length) % items.length];
    itemRefs.current.get(next.value)?.focus();
  };

  return <nav
    ref={rootRef}
    className={`magic-tab ${className}`}
    onMouseLeave={() => setPreviewValue(null)}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setPreviewValue(null); }}
    {...props}
  >
    <span
      className="magic-tab__indicator"
      aria-hidden="true"
      data-ready={indicator.ready ? 'true' : 'false'}
      style={{ width: indicator.width, transform: `translateX(${indicator.x}px)` }}
    />
    {items.map(item => <a
      key={item.value}
      ref={node => { if (node) itemRefs.current.set(item.value, node); else itemRefs.current.delete(item.value); }}
      href={item.href}
      aria-current={item.value === value ? 'page' : undefined}
      data-active={item.value === value ? 'true' : 'false'}
      data-preview={item.value === previewValue ? 'true' : undefined}
      onMouseEnter={() => setPreviewValue(item.value)}
      onFocus={() => setPreviewValue(item.value)}
      onClick={() => onValueChange?.(item.value)}
      onKeyDown={event => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); moveFocus(item.value, 1); }
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); moveFocus(item.value, -1); }
        if (event.key === 'Home') { event.preventDefault(); itemRefs.current.get(items[0].value)?.focus(); }
        if (event.key === 'End') { event.preventDefault(); itemRefs.current.get(items.at(-1).value)?.focus(); }
      }}
    >{item.label}</a>)}
  </nav>;
}
