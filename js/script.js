const langBtn = document.getElementById('langToggle');
const html = document.documentElement;

const arabicDigits = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
function toArabicNum(str){return String(str).replace(/\d/g, d => arabicDigits[+d]);}

function setLang(lang){
  const isAr = lang === 'ar';
  html.lang = isAr ? 'ar' : 'en';
  html.dir = isAr ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-en]').forEach(el => {
    el.innerHTML = el.getAttribute(isAr ? 'data-ar' : 'data-en');
  });
  document.querySelectorAll('.rec-num').forEach(el => {
    const t = el.getAttribute('data-target');
    el.textContent = isAr ? toArabicNum(t) : t;
  });
  document.querySelectorAll('.bar-pct').forEach(el => {
    const t = el.getAttribute('data-target');
    el.textContent = (isAr ? toArabicNum(t) : t) + (isAr ? '٪' : '%');
  });
  localStorage.setItem('lang', lang);
}

langBtn.addEventListener('click', () => {
  const next = html.dir === 'rtl' ? 'en' : 'ar';
  setLang(next);
});

const savedLang = localStorage.getItem('lang') || 'en';

function animateCount(el, target, duration = 1400){
  const isAr = html.dir === 'rtl';
  const start = performance.now();
  function step(now){
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = Math.round(target * eased);
    el.textContent = isAr ? toArabicNum(val) : val;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function runCounters(){
  document.querySelectorAll('.rec-num').forEach(el => {
    animateCount(el, +el.getAttribute('data-target'));
  });
  document.querySelectorAll('.bar-pct').forEach(el => {
    const target = +el.getAttribute('data-target');
    const isAr = html.dir === 'rtl';
    const start = performance.now();
    const dur = 1600;
    function step(now){
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = Math.round(target * eased);
      el.textContent = (isAr ? toArabicNum(v) : v) + (isAr ? '٪' : '%');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
  document.querySelectorAll('.bar-fill').forEach(el => {
    requestAnimationFrame(() => { el.style.width = el.getAttribute('data-pct') + '%'; });
  });
}

window.addEventListener('DOMContentLoaded', () => {
  setLang(savedLang);
  setTimeout(runCounters, 300);
  document.getElementById('year').textContent = new Date().getFullYear();
});

const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting){
      e.target.querySelectorAll('.bar-fill').forEach(b => {
        b.style.width = b.getAttribute('data-pct') + '%';
      });
    }
  });
}, {threshold:.3});
window.addEventListener('load', () => {
  document.querySelectorAll('.bars').forEach(b => io.observe(b));
});
