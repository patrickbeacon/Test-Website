// ...existing code...
(function () {
  const selectors = ['.project-frame', '.project-frame-black'];

  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.style.touchAction = 'none';
      el.style.userSelect = 'none';
      el.addEventListener('pointerdown', onPointerDown);
    });
  });

  function onPointerDown(e) {
    const el = e.currentTarget;
    // capture pointer so moves continue even if pointer leaves element
    el.setPointerCapture?.(e.pointerId);

    const rect = el.getBoundingClientRect();
    const startLeft = rect.left + window.scrollX;
    const startTop = rect.top + window.scrollY;
    const offsetX = e.clientX + window.scrollX - startLeft;
    const offsetY = e.clientY + window.scrollY - startTop;

    // switch to absolute and set initial position
    el.style.position = 'absolute';
    el.style.left = startLeft + 'px';
    el.style.top = startTop + 'px';
    el.style.zIndex = 9999;

    function onMove(ev) {
      const left = ev.clientX + window.scrollX - offsetX;
      const top = ev.clientY + window.scrollY - offsetY;

      // optional clamp to document bounds
      const maxLeft = Math.max(0, document.documentElement.scrollWidth - rect.width);
      const maxTop = Math.max(0, document.documentElement.scrollHeight - rect.height);

      el.style.left = Math.max(0, Math.min(left, maxLeft)) + 'px';
      el.style.top = Math.max(0, Math.min(top, maxTop)) + 'px';
    }

    function onUp(ev) {
      try { el.releasePointerCapture?.(ev.pointerId); } catch (err) {}
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      el.style.zIndex = '';
    }

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }
})();