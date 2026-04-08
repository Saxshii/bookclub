// ══════════════════════════════════════════════════
// BOOKSHELF.JS
// ══════════════════════════════════════════════════

// ── Carousel ─────────────────────────────────────
let currentIdx = 0;
const almirahs = Array.from(document.querySelectorAll('.almirah'));
const dots     = Array.from(document.querySelectorAll('.carousel-dot'));

function updateCarousel(animate) {
  almirahs.forEach((el, i) => {
    el.classList.remove('state-center','state-left','state-right','state-far-left','state-far-right');
    const d = i - currentIdx;
    if      (d === 0)  el.classList.add('state-center');
    else if (d === 1)  el.classList.add('state-right');
    else if (d === -1) el.classList.add('state-left');
    else if (d > 1)    el.classList.add('state-far-right');
    else               el.classList.add('state-far-left');
  });
  dots.forEach((d,i) => d.classList.toggle('active', i === currentIdx));
  const prev = document.getElementById('nav-prev');
  const next = document.getElementById('nav-next');
  if (prev) prev.style.opacity = currentIdx === 0 ? '0.2' : '1';
  if (next) next.style.opacity = currentIdx === almirahs.length - 1 ? '0.2' : '1';
}

function navigate(dir) {
  const n = currentIdx + dir;
  if (n < 0 || n >= almirahs.length) return;
  currentIdx = n;
  updateCarousel(true);
}

function goTo(i) { currentIdx = i; updateCarousel(true); }

function almirahClick(i) { if (i !== currentIdx) goTo(i); }

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft')  navigate(-1);
  if (e.key === 'ArrowRight') navigate(1);
});

let tx = 0;
document.addEventListener('touchstart', e => { tx = e.touches[0].clientX; });
document.addEventListener('touchend',   e => {
  const d = tx - e.changedTouches[0].clientX;
  if (Math.abs(d) > 44) navigate(d > 0 ? 1 : -1);
});

updateCarousel(false);

// ── Search ────────────────────────────────────────
let searchTimer;
let addedAny = false;
const inp  = document.getElementById('book-search');
const drop = document.getElementById('search-dropdown');
const doneWrap = document.getElementById('done-btn-wrap');

inp.addEventListener('input', function () {
  clearTimeout(searchTimer);
  const q = this.value.trim();
  if (q.length < 2) { drop.style.display = 'none'; return; }

  searchTimer = setTimeout(() => doSearch(q), 380);
});

async function doSearch(q) {
  drop.innerHTML = `<p style="padding:12px 14px;color:rgba(245,220,180,0.4);font-size:12px;">Searching...</p>`;
  drop.style.display = 'block';

  try {
    // Smart query: if looks like author name, prefix with inauthor:
    // Otherwise search title first, fallback to general
    const isAuthorQuery = /^[a-z]+ [a-z]+$/i.test(q.trim()) && !q.includes(':');
    
    let url;
    if (isAuthorQuery) {
      // Try author search first
      url = `https://openlibrary.org/search.json?author=${encodeURIComponent(q)}&limit=10&fields=key,title,author_name,cover_i,first_publish_year`;
    } else {
      url = `https://openlibrary.org/search.json?title=${encodeURIComponent(q)}&limit=10&fields=key,title,author_name,cover_i,first_publish_year`;
    }

    const res  = await fetch(url);
    const data = await res.json();

    // If author search returns nothing, try title search
    let docs = data.docs || [];
    if (docs.length === 0 && isAuthorQuery) {
      const fallback = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=10&fields=key,title,author_name,cover_i,first_publish_year`
      );
      const fdata = await fallback.json();
      docs = fdata.docs || [];
    }

    if (!docs.length) {
      drop.innerHTML = `<p style="padding:14px;text-align:center;color:rgba(245,220,180,0.35);font-size:12px;">No results found. Try a book title.</p>`;
      return;
    }

    drop.innerHTML = docs.map(doc => {
      const title  = doc.title || 'Unknown';
      const author = doc.author_name ? doc.author_name[0] : 'Unknown';
      const cover  = doc.cover_i
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-S.jpg`
        : '/images/fallback-cover.jpg';
      const coverM = doc.cover_i
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
        : '';
      const id = doc.key || '';

      return `
        <div class="search-result-row">
          <img src="${cover}" onerror="this.src='/images/fallback-cover.jpg'"/>
          <div class="search-result-info">
            <p>${title}</p>
            <p>${author}</p>
          </div>
          <button class="add-search-btn"
                  onclick="addFromSearch(this)"
                  data-id="${id}"
                  data-title="${title.replace(/"/g,'&quot;')}"
                  data-author="${author.replace(/"/g,'&quot;')}"
                  data-coverurl="${coverM}">
            + Add
          </button>
        </div>`;
    }).join('');

  } catch(e) {
    drop.innerHTML = `<p style="padding:12px 14px;color:rgba(245,220,180,0.4);font-size:12px;">Search failed. Please try again.</p>`;
  }
}

document.addEventListener('click', e => {
  if (!inp.contains(e.target) && !drop.contains(e.target) && !doneWrap.contains(e.target)) {
    drop.style.display = 'none';
  }
});

async function addFromSearch(btn) {
  const data = {
    openLibraryId: btn.dataset.id,
    title:         btn.dataset.title,
    author:        btn.dataset.author,
    coverUrl:      btn.dataset.coverurl,
  };
  btn.textContent = '...';
  btn.disabled = true;

  try {
    const res  = await fetch('/books/add', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data)
    });
    const json = await res.json();

    if (json.success) {
      btn.textContent = '✓';
      btn.classList.add('added');
      addedAny = true;
      doneWrap.style.display = 'flex';

      const countEl = document.getElementById('book-count-display');
      if (countEl) {
        const n = parseInt(countEl.textContent) || 0;
        countEl.textContent = `${n+1} books in your collection`;
      }
      showToast(`Added "${data.title}" ✓`);
    } else {
      btn.textContent = '+ Add';
      btn.disabled = false;
      showToast(json.message || 'Already on shelf');
    }
  } catch(e) {
    btn.textContent = '+ Add';
    btn.disabled = false;
    showToast('Failed. Try again.');
  }
}

function doneAdding() { location.reload(); }

// ── Modal ─────────────────────────────────────────
function openModal(id, title, author, coverId, coverUrl, status, notes, review, rating) {
  const src = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : (coverUrl || '/images/fallback-cover.jpg');

  const stars = [1,2,3,4,5].map(n =>
    `<button id="star-${n}" onclick="setRating(${n})"
             style="background:none;border:none;cursor:pointer;font-size:24px;
                    color:${Number(rating)>=n?'#f59e0b':'#d1d5db'};transition:transform 0.15s;"
             onmouseover="this.style.transform='scale(1.2)'"
             onmouseout="this.style.transform='scale(1)'">★</button>`
  ).join('');

  const opts = [
    {v:'want-to-read',      l:'🔖 Want to Read'},
    {v:'currently-reading', l:'📖 Currently Reading'},
    {v:'finished',          l:'✅ Finished'},
  ].map(o => `<option value="${o.v}" ${status===o.v?'selected':''}>${o.l}</option>`).join('');

  document.getElementById('modal-content').innerHTML = `
    <div style="padding:24px;">
      <div style="display:flex;align-items:flex-start;gap:16px;margin-bottom:20px;">
        <img src="${src}" alt="${title}"
             style="width:80px;height:120px;object-fit:cover;border-radius:7px;
                    box-shadow:0 4px 14px rgba(0,0,0,0.2);flex-shrink:0;"
             onerror="this.src='/images/fallback-cover.jpg'"/>
        <div style="flex:1;min-width:0;">
          <h2 style="font-family:'Playfair Display',serif;font-size:1.2rem;
                     font-weight:700;color:#3d1f08;margin-bottom:4px;line-height:1.3;">${title}</h2>
          <p style="color:#c9a96e;font-size:13px;margin-bottom:10px;">${author}</p>
          <div style="display:flex;gap:1px;margin-bottom:12px;">${stars}</div>
          <select id="modal-status" onchange="updateStatus(this.value,'${id}')"
                  style="width:100%;padding:8px 12px;border:1.5px solid #e8d5b7;
                         border-radius:10px;font-size:13px;color:#3d1f08;
                         background:#fffdf8;outline:none;cursor:pointer;
                         font-family:'Lato',sans-serif;">${opts}</select>
        </div>
        <button onclick="closeModal()"
                style="background:none;border:none;font-size:22px;color:#a8845a;
                       cursor:pointer;flex-shrink:0;">✕</button>
      </div>
      <div style="margin-bottom:14px;">
        <label style="display:block;font-size:12px;font-weight:600;color:#7a4a28;
                       margin-bottom:6px;letter-spacing:0.06em;">📝 MY NOTES</label>
        <textarea id="modal-notes" rows="4"
                  placeholder="Your thoughts, quotes, summaries..."
                  style="width:100%;padding:12px;border:1.5px solid #e8d5b7;
                         border-radius:12px;font-size:13px;color:#3d1f08;
                         background:#fffdf8;resize:none;outline:none;
                         font-family:'Lato',sans-serif;line-height:1.6;"
        >${notes.replace(/\\n/g,'\n')}</textarea>
      </div>
      <div style="margin-bottom:20px;">
        <label style="display:block;font-size:12px;font-weight:600;color:#7a4a28;
                       margin-bottom:6px;letter-spacing:0.06em;">⭐ MY REVIEW</label>
        <textarea id="modal-review" rows="3"
                  placeholder="What did you think?"
                  style="width:100%;padding:12px;border:1.5px solid #e8d5b7;
                         border-radius:12px;font-size:13px;color:#3d1f08;
                         background:#fffdf8;resize:none;outline:none;
                         font-family:'Lato',sans-serif;line-height:1.6;"
        >${review}</textarea>
      </div>
      <div style="display:flex;gap:10px;">
        <button onclick="saveBookData('${id}')"
                style="flex:1;background:#7a4a14;color:#fff;border:none;
                       padding:12px;border-radius:9999px;font-size:14px;font-weight:700;
                       cursor:pointer;font-family:'Lato',sans-serif;transition:background 0.2s;"
                onmouseover="this.style.background='#9b5e1a'"
                onmouseout="this.style.background='#7a4a14'">Save Changes</button>
        <button onclick="removeBook('${id}')"
                style="padding:12px 18px;border:1.5px solid #fca5a5;color:#ef4444;
                       background:none;border-radius:9999px;font-size:13px;font-weight:600;
                       cursor:pointer;font-family:'Lato',sans-serif;">Remove</button>
      </div>
      <p id="modal-save-msg"
         style="display:none;text-align:center;color:#16a34a;font-size:13px;
                margin-top:10px;font-weight:600;">✓ Saved!</p>
    </div>`;

  document.getElementById('modal-overlay').classList.add('open');
  window._currentRating = Number(rating) || 0;
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
}

document.getElementById('modal-overlay').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

function setRating(n) {
  window._currentRating = n;
  for (let i = 1; i <= 5; i++) {
    const s = document.getElementById(`star-${i}`);
    if (s) s.style.color = i <= n ? '#f59e0b' : '#d1d5db';
  }
}

async function updateStatus(status, id) {
  await fetch(`/books/update/${id}`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({readingStatus: status})
  });
}

async function saveBookData(id) {
  const notes  = document.getElementById('modal-notes').value;
  const review = document.getElementById('modal-review').value;
  const status = document.getElementById('modal-status').value;
  try {
    const res  = await fetch(`/books/update/${id}`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({notes, review, rating: window._currentRating, readingStatus: status})
    });
    const json = await res.json();
    if (json.success) {
      const m = document.getElementById('modal-save-msg');
      m.style.display = 'block';
      setTimeout(() => { m.style.display='none'; closeModal(); location.reload(); }, 900);
    }
  } catch(e) { showToast('Failed to save.'); }
}

async function removeBook(id) {
  if (!confirm('Remove this book?')) return;
  await fetch(`/books/remove/${id}`, {method:'POST'});
  closeModal();
  location.reload();
}

function showToast(msg) {
  const t = document.getElementById('shelf-toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}