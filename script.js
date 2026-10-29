// Scroll progress + nav state
const nav = document.getElementById('nav');
const bar = document.getElementById('progress');
addEventListener('scroll', () => {
  const h = document.documentElement;
  bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + '%';
  nav.classList.toggle('scrolled', scrollY > 40);
}, { passive: true });

// Mobile menu
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');
const setMenu = (open) => {
  menu.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
};
burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
addEventListener('keydown', e => e.key === 'Escape' && setMenu(false));

// Reveal on scroll (+ stagger within groups)
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    const siblings = [...en.target.parentElement.children].filter(c => c.classList.contains('reveal'));
    en.target.style.transitionDelay = Math.min(siblings.indexOf(en.target), 5) * 90 + 'ms';
    en.target.classList.add('in');
    io.unobserve(en.target);
  });
}, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Count-up numbers
const fmt = new Intl.NumberFormat('en-US');
const counter = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    const el = en.target, end = +el.dataset.count, t0 = performance.now(), dur = 1400;
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = fmt.format(Math.round(end * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counter.unobserve(el);
  });
}, { threshold: .6 });
document.querySelectorAll('[data-count]').forEach(el => counter.observe(el));

// Compensation calculator ($7.50 per copy, 30% share)
const range = document.getElementById('copies');
const money = (n) => '$' + fmt.format(n % 1 ? +n.toFixed(2) : n);
const calc = () => {
  const copies = +range.value, earn = copies * 7.5, share = earn * 0.3;
  document.getElementById('copiesOut').textContent = fmt.format(copies);
  document.getElementById('earn').textContent = money(earn);
  document.getElementById('share').textContent = money(share);
  document.getElementById('keep').textContent = money(earn - share);
  range.style.background = `linear-gradient(90deg,#e8b84a ${copies / 20}%,rgba(255,255,255,.2) 0)`;
};
range.addEventListener('input', calc);
calc();
