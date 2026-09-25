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

  // Contact form: posts to the private contact relay, which saves the message and emails it to KD Exotics
  const FORM_ENDPOINT = 'https://okniyuargfizzdbuvhos.supabase.co/functions/v1/contact-relay';
  const form = document.getElementById('contact-form');
  if (form) {
    const note = document.getElementById('form-note');
    const btn = form.querySelector('button[type="submit"]');
    const show = (msg) => { if (note) { note.hidden = false; note.textContent = msg; } };
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (form.querySelector('[name="_honey"]')?.value) return; // bot
      const f = form.elements;
      const name = f['name'].value.trim();
      const email = f['email'].value.trim();
      const interest = f['interest'].value;
      const message = f['message'].value.trim();
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            name, email, topic: interest, message,
            _honey: f['_honey'] ? f['_honey'].value : '',
            page: location.href
          })
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.ok) throw new Error(data.error || res.status);
        form.reset();
        show("Thanks. Your message is in our inbox and we'll write back.");
      } catch (err) {
        show("That didn't send. Please try again in a minute.");
      } finally {
        if (btn) { btn.disabled = false; btn.textContent = 'Send'; }
      }
    });
  }
});
