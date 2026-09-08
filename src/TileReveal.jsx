import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function easeInOutPower(value, power) {
  return value < 0.5
    ? Math.pow(2, power - 1) * Math.pow(value, power)
    : 1 - Math.pow(-2 * value + 2, power) / 2;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return reduced;
}

export function TileReveal({
  images,
  headline,
  children,
  columns = 3,
  gap = 28,
  gridWidth = 720,
  tileAspect = 1,
  tileRadius = 0,
  grayscale = true,
  direction = 'alternate',
  startAssembled = false,
  stagger = 0.06,
  overlap = 0.6,
  zoom = 2.05,
  spread = 0.4,
  scrollLength = 3,
  scrub = 0.08,
  contentGap = 28,
  backgroundColor = 'transparent',
  onProgress,
  className = '',
}) {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const gridRef = useRef(null);
  const tileRefs = useRef([]);
  const headlineRef = useRef(null);
  const contentRef = useRef(null);
  const currentProgress = useRef(0);
  const frame = useRef(0);
  const previousTime = useRef(0);
  const ticking = useRef(false);
  const stageWidth = useRef(0);
  const stageHeight = useRef(0);
  const gridActualWidth = useRef(0);
  const gridActualHeight = useRef(0);
  const contentHeight = useRef(0);
  const columnCount = Math.max(1, Math.round(columns));

  const sequence = useMemo(() => {
    const middleColumn = (columnCount - 1) / 2;
    const rowCounts = Array.from(
      { length: columnCount },
      (_, column) => Math.floor((images.length - column + columnCount - 1) / columnCount),
    );
    const rows = Math.max(0, ...rowCounts);
    const zoomStart = Math.max(0, (rows > 0 ? 1 + (rows - 1) * stagger : 0) - overlap);
    const contentStart = zoomStart + 1 - 0.32;
    const total = Math.max(zoomStart + 1, contentStart + 0.32, 0.001);

    return {
      tiles: images.map((_, index) => {
        const column = index % columnCount;
        const row = Math.floor(index / columnCount);
        const rowsInColumn = rowCounts[column];
        const entersFromTop = direction === 'top' || (direction === 'alternate' && column % 2 === 0);
        const centered = Math.abs(column - middleColumn) < 0.001;
        const lateral = centered ? 0 : Math.sign(column - middleColumn);
        const vertical = centered ? (row < Math.floor(rowsInColumn / 2) ? -1 : 1) : 0;
        return {
          start: (entersFromTop ? rowsInColumn - 1 - row : row) * stagger,
          direction: entersFromTop ? -1 : 1,
          column,
          row,
          lateral,
          vertical,
        };
      }),
      rows: Math.ceil(images.length / columnCount),
      middleColumn,
      zoomStart,
      splitStart: zoomStart + 0.5,
      contentStart,
      total,
    };
  }, [columnCount, direction, images, overlap, stagger]);

  const applyProgress = useCallback((progress) => {
    const grid = gridRef.current;
    if (!grid) return;
    const timeline = progress * sequence.total;
    const travel = (stageHeight.current + gridActualHeight.current) / 2;
    const zoomProgress = easeInOutPower(clamp(timeline - sequence.zoomStart, 0, 1), 3);
    const splitProgress = easeInOutPower(clamp((timeline - sequence.splitStart) / 0.5, 0, 1), 1);
    const revealProgress = easeInOutPower(clamp((timeline - sequence.contentStart) / 0.32, 0, 1), 2);
    const safeZoom = Math.max(zoom, 1);
    grid.style.transform = `scale(${1 + (safeZoom - 1) * zoomProgress})`;

    const tileWidth = Math.max(1, (gridActualWidth.current - gap * (columnCount - 1)) / columnCount);
    const tileHeight = tileWidth / Math.max(tileAspect, 0.01);
    const columnStep = tileWidth + gap;
    const rowStep = tileHeight + gap;
    const middleRow = (sequence.rows - 1) / 2;
    const horizontalPush = (offset) => Math.max(spread * tileWidth, stageWidth.current / (2 * safeZoom) + tileWidth / 2 - Math.abs(offset) + gap);
    const verticalPush = (offset) => Math.max(spread * tileHeight, stageHeight.current / (2 * safeZoom) + tileHeight / 2 - Math.abs(offset) + gap);

    sequence.tiles.forEach((tile, index) => {
      const element = tileRefs.current[index];
      if (!element) return;
      const flyProgress = startAssembled ? 1 : easeInOutPower(clamp(timeline - tile.start, 0, 1), 1);
      const flyY = tile.direction * travel * (1 - flyProgress);
      const splitX = tile.lateral * horizontalPush((tile.column - sequence.middleColumn) * columnStep) * zoomProgress;
      const splitY = tile.vertical * verticalPush((tile.row - middleRow) * rowStep) * splitProgress;
      element.style.transform = `translate3d(${splitX.toFixed(2)}px, ${(flyY + splitY).toFixed(2)}px, 0)`;
      element.style.visibility = flyProgress <= 0 ? 'hidden' : 'visible';
    });

    if (headlineRef.current) {
      const shift = (contentHeight.current + contentGap) / 2 * (1 - revealProgress);
      headlineRef.current.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0)`;
    }
    if (contentRef.current) {
      contentRef.current.style.opacity = revealProgress.toFixed(3);
      contentRef.current.style.transform = `translate3d(0, ${((1 - revealProgress) * 12).toFixed(2)}px, 0)`;
      contentRef.current.style.pointerEvents = revealProgress > 0.5 ? 'auto' : 'none';
    }
    onProgress?.(progress);
  }, [columnCount, contentGap, gap, onProgress, sequence, spread, startAssembled, tileAspect, zoom]);

  const readProgress = useCallback(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return 0;
    const sectionBox = section.getBoundingClientRect();
    const distance = sectionBox.height - stage.getBoundingClientRect().height;
    return distance <= 0 ? 0 : clamp(-sectionBox.top / distance, 0, 1);
  }, []);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const section = sectionRef.current;
    const stage = stageRef.current;
    const grid = gridRef.current;
    if (!section || !stage || !grid) return undefined;
    const view = section.ownerDocument.defaultView;
    const smoothing = Math.max(scrub, 0);
    const animate = (time) => {
      const prior = previousTime.current || time;
      const delta = Math.min(0.05, Math.max(0, (time - prior) / 1000));
      previousTime.current = time;
      const target = readProgress();
      const blend = smoothing > 0 ? 1 - Math.exp(-delta / smoothing) : 1;
      const next = currentProgress.current + (target - currentProgress.current) * blend;
      currentProgress.current = next;
      applyProgress(next);
      if (Math.abs(target - next) > 0.0004) frame.current = view.requestAnimationFrame(animate);
      else {
        currentProgress.current = target;
        applyProgress(target);
        ticking.current = false;
      }
    };
    const requestTick = () => {
      if (ticking.current) return;
      ticking.current = true;
      previousTime.current = 0;
      frame.current = view.requestAnimationFrame(animate);
    };
    const measure = () => {
      const stageBox = stage.getBoundingClientRect();
      stageWidth.current = stageBox.width;
      stageHeight.current = stageBox.height;
      gridActualWidth.current = grid.offsetWidth;
      gridActualHeight.current = grid.offsetHeight;
      contentHeight.current = contentRef.current?.offsetHeight ?? 0;
      currentProgress.current = readProgress();
      applyProgress(currentProgress.current);
    };
    measure();
    view.addEventListener('scroll', requestTick, { passive: true });
    view.addEventListener('resize', measure);
    view.addEventListener('pageshow', measure);
    const observer = new ResizeObserver(measure);
    observer.observe(section);
    observer.observe(stage);
    observer.observe(grid);
    if (contentRef.current) observer.observe(contentRef.current);
    return () => {
      view.cancelAnimationFrame(frame.current);
      ticking.current = false;
      view.removeEventListener('scroll', requestTick);
      view.removeEventListener('resize', measure);
      view.removeEventListener('pageshow', measure);
      observer.disconnect();
    };
  }, [applyProgress, readProgress, reducedMotion, scrub]);

  const sectionStyle = {
    height: reducedMotion ? undefined : `${((1 + Math.max(scrollLength, 0)) * 100).toFixed(2)}svh`,
    background: backgroundColor,
  };

  if (reducedMotion) {
    return <section ref={sectionRef} className={`tile-reveal tile-reveal--static ${className}`.trim()} style={sectionStyle}>
      <div className="tile-reveal__static-grid" style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`, gap }} aria-hidden="true">
        {images.map((image, index) => <div key={`${image}-${index}`} style={{ aspectRatio: tileAspect, borderRadius: tileRadius }}><img src={image} alt="" loading="lazy" decoding="async" draggable="false" /></div>)}
      </div>
      <div className="tile-reveal__static-copy" style={{ gap: contentGap }}>
        {headline && <div>{headline}</div>}
        {children && <div>{children}</div>}
      </div>
    </section>;
  }

  return <section ref={sectionRef} className={`tile-reveal ${className}`.trim()} style={sectionStyle}>
    <div ref={stageRef} className="tile-reveal__stage" style={{ background: backgroundColor }}>
      <div className="tile-reveal__copy" style={{ gap: contentGap }}>
        {headline && <div ref={headlineRef} className="tile-reveal__headline">{headline}</div>}
        {children && <div ref={contentRef} className="tile-reveal__content" style={{ opacity: 0 }}>{children}</div>}
      </div>
      <div className="tile-reveal__grid-wrap" style={{ width: `min(${gridWidth}px, calc(100% - ${gap * 2}px))` }} aria-hidden="true">
        <div ref={gridRef} className="tile-reveal__grid" style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`, gap }}>
          {images.map((image, index) => <div key={`${image}-${index}`} ref={(element) => { tileRefs.current[index] = element; }} className="tile-reveal__tile" style={{ aspectRatio: tileAspect, borderRadius: tileRadius, visibility: 'hidden' }}><img className={grayscale ? 'is-grayscale' : ''} src={image} alt="" loading="lazy" decoding="async" draggable="false" /></div>)}
        </div>
      </div>
    </div>
  </section>;
}
