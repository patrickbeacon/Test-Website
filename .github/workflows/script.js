(function () {
  const selectors = ['.project-frame', '.project-frame-black'];

  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.style.touchAction = 'none'; // prefer pointer events
      el.addEventListener('pointerdown', onPointerDown);
    });
  });

  function onPointerDown(e) {
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);

    const rect = el.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    // switch to absolute so we can move it freely
    el.style.position = 'absolute';
    el.style.zIndex = 9999;
    // ensure initial left/top are set
    moveAt(e.clientX, e.clientY);

    function moveAt(clientX, clientY) {
      const left = clientX - offsetX;
      const top = clientY - offsetY;

      // clamp so element stays in viewport
      const maxLeft = Math.max(0, window.innerWidth - rect.width);
      const maxTop = Math.max(0, window.innerHeight - rect.height);

      el.style.left = Math.max(0, Math.min(left, maxLeft)) + 'px';
      el.style.top = Math.max(0, Math.min(top, maxTop)) + 'px';
    }

    function onPointerMove(ev) {
      moveAt(ev.clientX, ev.clientY);
    }

    function onPointerUp(ev) {
      try { el.releasePointerCapture(ev.pointerId); } catch {}
      window.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', onPointerUp);
      el.style.zIndex = '';
    }

    window.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', onPointerUp);
  }
})();