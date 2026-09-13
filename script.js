// KD Exotics — shared site behavior (mobile nav, FAQ accordion, animal filters)

document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      item.closest('.faq-list')?.querySelectorAll('.faq-item.open').forEach(o => { if (o !== item) o.classList.remove('open'); });
      item.classList.toggle('open', !wasOpen);
    });
  });

  // Available Animals filter tabs
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('[data-species]');
  if (tabs.length && cards.length) {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const filter = tab.dataset.filter;
        cards.forEach(card => {
          const match = filter === 'all' || card.dataset.species === filter;
          card.style.display = match ? '' : 'none';
        });
      });
    });
  }

  // Contact form: friendly placeholder handling until a real form backend is wired up
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      if (form.dataset.wired === 'true') return; // let a real endpoint handle it
      e.preventDefault();
      const note = document.getElementById('form-note');
      if (note) {
        note.hidden = false;
        note.textContent = "This form isn't connected to an inbox yet — once it is, messages sent here will land in your email.";
      }
      form.reset();
    });
  }
});
