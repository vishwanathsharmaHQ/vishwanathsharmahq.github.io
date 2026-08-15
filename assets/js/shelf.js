(function () {
  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  const shelf = document.getElementById('shelf');
  if (!shelf) return;

  // Wheel over the shelf: if the cursor is over an opened book's content, scroll vertically as normal.
  // Otherwise, translate vertical wheel into horizontal shelf scroll.
  shelf.addEventListener('wheel', (e) => {
    if (e.target.closest && e.target.closest('.pages-inner')) return;
    if (e.deltaY === 0) return;
    e.preventDefault();
    shelf.scrollLeft += e.deltaY;
  }, { passive: false });

  const books = Array.from(shelf.querySelectorAll('.book'));

  function closeAll() {
    books.forEach(b => {
      b.classList.remove('is-open');
      const btn = b.querySelector('.spine');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }

  function openBook(book) {
    const wasOpen = book.classList.contains('is-open');
    closeAll();
    if (wasOpen) return; // clicking an open book closes it
    book.classList.add('is-open');
    const btn = book.querySelector('.spine');
    if (btn) btn.setAttribute('aria-expanded', 'true');
  }

  books.forEach(book => {
    const btn = book.querySelector('.spine');
    if (!btn) return;
    btn.addEventListener('click', () => openBook(book));
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAll();
    });
  });

  // open the first book by default so the shelf doesn't look empty on load
  if (books[0]) {
    books[0].classList.add('is-open');
    const btn = books[0].querySelector('.spine');
    if (btn) btn.setAttribute('aria-expanded', 'true');
  }
})();
