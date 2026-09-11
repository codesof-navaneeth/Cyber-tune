const state = { route: 'home', tracks: [], query: '', reducedMotion: false };
const content = document.querySelector('#content');
const fileInput = document.querySelector('#fileInput');
const settingsDialog = document.querySelector('#settingsDialog');

const escapeHTML = value => String(value ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
const duration = seconds => Number.isFinite(seconds) ? `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2,'0')}` : '—';

function emptyState(title, message, action = true) {
  return `<div class="empty"><div class="empty-inner"><div class="empty-icon">◈</div><h3>${escapeHTML(title)}</h3><p>${escapeHTML(message)}</p>${action ? '<button class="primary" data-import>＋ Import Music</button>' : ''}</div></div>`;
}

function trackList(tracks) {
  if (!tracks.length) return emptyState('Your library is empty','Import music stored on your device. CYBER//TUNE keeps your collection local.');
  return `<div class="track-list">${tracks.map((track, index) => `<button class="track" data-track="${index}" aria-label="Play ${escapeHTML(track.title)}"><span class="art track-art">♪</span><span><strong class="track-title">${escapeHTML(track.title)}</strong><span class="track-sub">${escapeHTML(track.artist || 'Unknown artist')} · ${escapeHTML(track.album || 'Unknown album')}</span></span><span class="track-time">${duration(track.duration)}</span></button>`).join('')}</div>`;
}

function renderHome() {
  content.innerHTML = `<section class="hero"><p class="eyebrow">Private audio / local-first</p><h1>Your music.<br>Nothing else.</h1><p class="hero-copy">A personal music terminal built around the files you already own. No feeds, no streaming service, no noise.</p><button class="primary" data-import>＋ Import Music</button></section><section class="section"><div class="section-head"><div><p class="eyebrow">Library</p><h2>${state.tracks.length ? 'Recently added' : 'Ready when you are'}</h2></div><span class="count">${state.tracks.length} TRACKS</span></div>${state.tracks.length ? trackList(state.tracks.slice(0,8)) : emptyState('Start your collection','Choose audio files from your device. Your music never needs to leave it.')}</section>`;
}

function renderLibrary() {
  content.innerHTML = `<div class="library-head"><div><p class="eyebrow">Collection</p><h1>Library</h1></div><span class="count">${state.tracks.length} TRACKS</span></div><div class="tabs"><button class="tab active">Songs</button><button class="tab" disabled>Albums</button><button class="tab" disabled>Artists</button><button class="tab" disabled>Folders</button></div><section class="section">${trackList(state.tracks)}</section>`;
}

function renderSearch() {
  const query = state.query.trim().toLowerCase();
  const results = query ? state.tracks.filter(track => [track.title,track.artist,track.album,track.genre,track.folder].some(value => String(value || '').toLowerCase().includes(query))) : [];
  content.innerHTML = `<section class="hero"><p class="eyebrow">Local index</p><h1>Search.</h1><div class="search-box"><span class="search-icon">⌕</span><input id="searchInput" value="${escapeHTML(state.query)}" placeholder="Search your music…" autocomplete="off" aria-label="Search local music"></div></section><section class="section">${query ? (results.length ? trackList(results) : emptyState('No matches',`Nothing in your local library matches “${state.query}”.`,false)) : emptyState('Search your library','Search titles, artists, albums and other local metadata.',false)}</section>`;
  const input = document.querySelector('#searchInput');
  if (input) { input.focus(); input.setSelectionRange(input.value.length,input.value.length); }
}

function render() {
  document.querySelectorAll('[data-route]').forEach(button => {
    const active = button.dataset.route === state.route;
    button.classList.toggle('active', active);
    if (button.classList.contains('nav-btn')) button.setAttribute('aria-current', active ? 'page' : 'false');
  });
  if (state.route === 'home') renderHome();
  else if (state.route === 'library') renderLibrary();
  else renderSearch();
}

function importMusic() { fileInput.click(); }

function importFiles(fileList) {
  const accepted = [...fileList].filter(file => file.type.startsWith('audio/') || /\.(mp3|wav|flac|m4a|aac|ogg)$/i.test(file.name));
  const known = new Set(state.tracks.map(track => track.id));
  const additions = accepted.filter(file => !known.has(`${file.name}:${file.size}:${file.lastModified}`)).map(file => ({
    id:`${file.name}:${file.size}:${file.lastModified}`,
    title:file.name.replace(/\.[^.]+$/,''), artist:'', album:'', genre:'', folder:'', duration:NaN,
    fileName:file.name
  }));
  state.tracks.push(...additions);
  render();
}

document.addEventListener('click', event => {
  const routeButton = event.target.closest('[data-route]');
  if (routeButton) { state.route = routeButton.dataset.route; render(); return; }
  if (event.target.closest('[data-import],#importBtn')) { importMusic(); return; }
  if (event.target.closest('#settingsBtn')) { settingsDialog.showModal(); return; }
  if (event.target.closest('[data-close-dialog]')) { settingsDialog.close(); return; }
  const trackButton = event.target.closest('[data-track]');
  if (trackButton) console.info('CYBER//TUNE playback placeholder:', state.tracks[Number(trackButton.dataset.track)]?.title);
});

document.addEventListener('input', event => {
  if (event.target.id === 'searchInput') { state.query = event.target.value; renderSearch(); }
  if (event.target.id === 'reducedMotion') {
    state.reducedMotion = event.target.checked;
    document.documentElement.style.setProperty('scroll-behavior', state.reducedMotion ? 'auto' : 'smooth');
  }
});

fileInput.addEventListener('change', event => { importFiles(event.target.files); event.target.value = ''; });
document.querySelector('#clearLibrary').addEventListener('click', () => { state.tracks = []; render(); settingsDialog.close(); });

render();
