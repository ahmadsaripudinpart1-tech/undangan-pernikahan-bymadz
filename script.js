(() => {
  const C = CONFIG, $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const get = p => p.split('.').reduce((o, k) => o[k], C);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmt = (d, o) => new Intl.DateTimeFormat('id-ID', { timeZone: C.timezone, ...o }).format(new Date(d));
  const full = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }, hm = { hour: '2-digit', minute: '2-digit', hour12: false };

  // Tema & teks
  Object.entries(C.theme).forEach(([k, v]) => document.documentElement.style.setProperty('--' + k, v));
  $$('[data-b]').forEach(e => e.textContent = get(e.dataset.b));
  document.title = `Undangan Pernikahan ${C.bride.short} & ${C.groom.short}`;
  $('meta[property="og:title"]').content = document.title;
  const guest = new URLSearchParams(location.search).get('to'); if (guest) $('#guest').textContent = guest;
  $('#heroDate').textContent = fmt(C.akad.date, full);
  $('#opening').textContent = C.opening; $('#closing').textContent = C.closing;
  // Foto dengan fallback: placeholder SVG tampil dulu, diganti foto asli jika file ada
  const PH = 'assets/placeholder/';
  const setBg = (n, u) => {
    const show = x => { n.style.backgroundImage = `url("${x}")`; n.dataset.src = x; };
    const name = u.split('/').pop().replace(/\.[^.]+$/, '');
    const f = new Image(); f.onerror = () => { if (!n.dataset.real) show(PH + 'foto.svg'); }; f.onload = () => { if (!n.dataset.real) show(PH + name + '.svg'); }; f.src = PH + name + '.svg';
    const i = new Image(); i.onload = () => { n.dataset.real = 1; show(u); }; i.src = u;
  };
  [['#couplePhoto', C.couplePhoto], ['#bridePhoto', C.bride.photo], ['#groomPhoto', C.groom.photo]].forEach(([s, u]) => setBg($(s), u));

  // Acara
  [['Akad Nikah', C.akad], ['Resepsi', C.resepsi]].forEach(([t, e]) =>
    $('#events').append(el('div', 'card', `<h3>${t}</h3><p>${fmt(e.date, full)}<br>${fmt(e.date, hm)} – ${esc(e.end)}</p><p><strong>${esc(e.place)}</strong><br>${esc(e.address)}</p>`)));
  $('#maps').href = C.mapsUrl;

  // Countdown
  const target = new Date(C.akad.date).getTime();
  const tick = () => {
    let s = Math.max(0, Math.floor((target - Date.now()) / 1000));
    const v = [['Hari', 86400], ['Jam', 3600], ['Menit', 60], ['Detik', 1]].map(([n, d]) => { const x = Math.floor(s / d); s %= d; return `<div><b>${x}</b><span>${n}</span></div>`; });
    $('#cd').innerHTML = v.join('');
  };
  tick(); setInterval(tick, 1000);

  // Galeri + lightbox
  C.gallery.forEach(u => { const d = el('div'); d.setAttribute('role', 'button'); d.tabIndex = 0; d.setAttribute('aria-label', 'Perbesar foto'); setBg(d, u);
    const open = () => { const l = el('div', 'lightbox'); l.style.backgroundImage = `url("${d.dataset.src}")`; l.onclick = () => l.remove(); document.body.append(l); };
    d.onclick = open; d.onkeydown = e => e.key === 'Enter' && open(); $('#gallery').append(d); });

  // Love story
  C.story.forEach(s => $('#story').append(el('div', '', `<b>${esc(s.year)} · ${esc(s.title)}</b><p>${esc(s.text)}</p>`)));

  // RSVP via WhatsApp
  $('#rName').value = guest || '';
  $('#rSend').onclick = () => {
    const n = $('#rName').value.trim(); if (!n) return $('#rName').focus();
    const msg = `Halo, saya ${n}. Konfirmasi kehadiran untuk pernikahan ${C.bride.short} & ${C.groom.short}: ${$('#rStatus').value}, jumlah tamu ${$('#rCount').value} orang.`;
    window.open(`https://wa.me/${C.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  };

  // Buku tamu (localStorage: hanya di perangkat pengunjung)
  const key = 'gb-' + C.id, load = () => { try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; } };
  const draw = () => { const l = $('#gbList'); l.textContent = ''; load().reverse().forEach(m => { const d = el('div'); const b = el('b'); b.textContent = m.n; const p = el('span'); p.textContent = m.m; d.append(b, p); l.append(d); }); };
  $('#gSend').onclick = () => {
    const n = $('#gName').value.trim(), m = $('#gMsg').value.trim(); if (!n || !m) return alert('Isi nama dan ucapan terlebih dahulu.');
    try { localStorage.setItem(key, JSON.stringify([...load(), { n, m }])); } catch {} $('#gMsg').value = ''; draw();
  };
  draw();

  // Amplop digital
  C.gifts.forEach(g => { const c = el('div', 'card', `<h3>${esc(g.bank)}</h3><p><strong>${esc(g.number)}</strong><br>a.n. ${esc(g.name)}</p>`); const b = el('button', 'btn', 'Salin Nomor');
    b.onclick = async () => { try { await navigator.clipboard.writeText(g.number); b.textContent = 'Tersalin'; } catch { prompt('Salin nomor rekening:', g.number); } setTimeout(() => b.textContent = 'Salin Nomor', 1800); };
    c.append(b); $('#gifts').append(c); });

  // Musik
  const audio = $('#audio'), mb = $('#music'); audio.src = C.music;
  const setMusic = on => { mb.classList.toggle('on', on); mb.setAttribute('aria-label', on ? 'Jeda musik' : 'Putar musik'); };
  mb.onclick = () => audio.paused ? audio.play().then(() => setMusic(true)).catch(() => alert('File musik tidak ditemukan.')) : (audio.pause(), setMusic(false));

  // Buka undangan
  $('#open').onclick = () => {
    $('#cover').classList.add('gone'); document.body.classList.remove('locked');
    $('#nav').classList.add('show'); mb.classList.add('show'); audio.play().then(() => setMusic(true)).catch(() => {});
    scrollTo(0, 0);
  };

  // Animasi scroll
  const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))), { threshold: .12 });
  $$('.reveal').forEach(e => io.observe(e));
})();
