// ─── Search ───────────────────────────────────────────────────────────────────
let searchTimeout;
const searchInput   = document.getElementById('book-search');
const searchResults = document.getElementById('search-results');
const searchList    = document.getElementById('search-list');
const searchLoading = document.getElementById('search-loading');

searchInput.addEventListener('input', function () {
  clearTimeout(searchTimeout);
  const query = this.value.trim();

  if (query.length < 2) {
    searchResults.classList.add('hidden');
    return;
  }

  searchLoading.classList.remove('hidden');
  searchResults.classList.remove('hidden');
  searchList.innerHTML = '';

  searchTimeout = setTimeout(async () => {
    try {
      const res  = await fetch(`/books/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      searchLoading.classList.add('hidden');

      if (!data.books || data.books.length === 0) {
        searchList.innerHTML = `<p class="p-4 text-amber-500 text-sm text-center">
          No books found. Try a different search.</p>`;
        return;
      }

      data.books.forEach(book => {
        const item = document.createElement('div');
        item.className = 'search-result-item flex items-center gap-3 p-3 hover:bg-amber-50 cursor-pointer border-b border-amber-50 last:border-0';
        item.innerHTML = `
          <img src="${book.coverId
            ? `https://covers.openlibrary.org/b/id/${book.coverId}-S.jpg`
            : '/images/fallback-cover.jpg'}"
               alt="${book.title}"
               class="w-10 h-14 object-cover rounded shadow-sm flex-shrink-0"
               onerror="this.src='/images/fallback-cover.jpg'"/>
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-amber-900 text-sm truncate">${book.title}</p>
            <p class="text-amber-600 text-xs">${book.author}</p>
            ${book.year ? `<p class="text-amber-400 text-xs">${book.year}</p>` : ''}
          </div>
          <button onclick="addToShelfFromSearch(event, this)"
                  data-id="${book.id}"
                  data-title="${book.title.replace(/"/g, '&quot;')}"
                  data-author="${book.author}"
                  data-coverid="${book.coverId || ''}"
                  data-coverurl="${book.coverUrl || ''}"
                  class="flex-shrink-0 bg-amber-700 hover:bg-amber-800 text-white
                         text-xs font-semibold px-3 py-1.5 rounded-full transition-colors">
            + Add
          </button>
        `;
        searchList.appendChild(item);
      });
    } catch (err) {
      searchLoading.classList.add('hidden');
      searchList.innerHTML = `<p class="p-4 text-red-500 text-sm text-center">
        Search failed. Please try again.</p>`;
    }
  }, 400); // debounce 400ms
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
    searchResults.classList.add('hidden');
  }
});

// ─── Add to shelf from search dropdown ───────────────────────────────────────
async function addToShelfFromSearch(e, btn) {
  e.stopPropagation();
  const data = {
    openLibraryId: btn.dataset.id,
    title:         btn.dataset.title,
    author:        btn.dataset.author,
    coverId:       btn.dataset.coverid,
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
      btn.classList.replace('bg-amber-700', 'bg-green-600');
      showToast(json.message);
      // Reload after short delay so new book appears on shelf
      setTimeout(() => location.reload(), 1200);
    } else {
      btn.textContent = '+ Add';
      btn.disabled = false;
      showToast(json.message);
    }
  } catch (err) {
    btn.textContent = '+ Add';
    btn.disabled = false;
    showToast('Failed to add book.');
  }
}

// ─── Open book detail modal ───────────────────────────────────────────────────
function openBookModal(id, title, author, coverId, coverUrl, status, notes, review, rating) {
  const coverSrc = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : (coverUrl || '/images/fallback-cover.jpg');

  const stars = [1,2,3,4,5].map(n =>
    `<button onclick="setRating(${n})" id="star-${n}"
             class="text-2xl transition-transform hover:scale-110
             ${Number(rating) >= n ? 'text-amber-400' : 'text-amber-200'}">★</button>`
  ).join('');

  const statusOptions = [
    { value: 'want-to-read',      label: '🔖 Want to Read' },
    { value: 'currently-reading', label: '📖 Currently Reading' },
    { value: 'finished',          label: '✅ Finished' }
  ].map(opt =>
    `<option value="${opt.value}" ${status === opt.value ? 'selected' : ''}>
       ${opt.label}
     </option>`
  ).join('');

  document.getElementById('modal-content').innerHTML = `
    <div class="p-6">
      <!-- Header -->
      <div class="flex items-start gap-5 mb-6">
        <img src="${coverSrc}" alt="${title}"
             class="w-24 h-36 object-cover rounded-xl shadow-md flex-shrink-0"
             onerror="this.src='/images/fallback-cover.jpg'"/>
        <div class="flex-1">
          <h2 class="font-serif text-2xl font-bold text-amber-900 mb-1">${title}</h2>
          <p class="text-amber-600 mb-3">${author}</p>
          <!-- Stars -->
          <div class="flex gap-1 mb-3">${stars}</div>
          <!-- Reading status -->
          <select id="modal-status" onchange="updateStatus(this.value, '${id}')"
                  class="form-input text-sm py-2">
            ${statusOptions}
          </select>
        </div>
        <button onclick="closeModal()"
                class="text-amber-400 hover:text-amber-700 text-2xl leading-none">✕</button>
      </div>

      <!-- Notes -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-amber-800 mb-1.5">📝 My Notes</label>
        <textarea id="modal-notes" rows="4"
                  placeholder="Write your thoughts, summaries, or things you want to remember..."
                  class="form-input resize-none text-sm">${notes.replace(/\\n/g, '\n')}</textarea>
      </div>

      <!-- Review -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-amber-800 mb-1.5">⭐ My Review</label>
        <textarea id="modal-review" rows="3"
                  placeholder="What did you think of this book?"
                  class="form-input resize-none text-sm">${review}</textarea>
      </div>

      <!-- Action buttons -->
      <div class="flex gap-3 flex-wrap">
        <button onclick="saveBookData('${id}')"
                class="btn-primary py-2 px-6 text-sm flex-1">
          Save Changes
        </button>
        <button onclick="removeBook('${id}')"
                class="border border-red-200 text-red-500 hover:bg-red-50
                       font-medium py-2 px-4 rounded-full text-sm transition-colors">
          Remove
        </button>
      </div>

      <p id="modal-save-msg" class="text-center text-green-600 text-sm mt-3 hidden">✓ Saved!</p>
    </div>
  `;

  document.getElementById('book-modal').classList.remove('hidden');
  window._currentRating = Number(rating) || 0;
  window._currentBookId = id;
}

function closeModal() {
  document.getElementById('book-modal').classList.add('hidden');
}

// Close modal on backdrop click
document.getElementById('book-modal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

function setRating(n) {
  window._currentRating = n;
  for (let i = 1; i <= 5; i++) {
    const star = document.getElementById(`star-${i}`);
    star.className = `text-2xl transition-transform hover:scale-110 ${i <= n ? 'text-amber-400' : 'text-amber-200'}`;
  }
}

async function updateStatus(status, bookId) {
  await fetch(`/books/update/${bookId}`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ readingStatus: status })
  });
}

async function saveBookData(bookId) {
  const notes  = document.getElementById('modal-notes').value;
  const review = document.getElementById('modal-review').value;
  const status = document.getElementById('modal-status').value;

  try {
    const res  = await fetch(`/books/update/${bookId}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ notes, review, rating: window._currentRating, readingStatus: status })
    });
    const json = await res.json();
    if (json.success) {
      const msg = document.getElementById('modal-save-msg');
      msg.classList.remove('hidden');
      setTimeout(() => { msg.classList.add('hidden'); location.reload(); }, 1000);
    }
  } catch (e) {
    showToast('Failed to save.');
  }
}

async function removeBook(bookId) {
  if (!confirm('Remove this book from your shelf?')) return;
  await fetch(`/books/remove/${bookId}`, { method: 'POST' });
  closeModal();
  location.reload();
}

function showToast(msg) {
  let toast = document.getElementById('shelf-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'shelf-toast';
    toast.className = 'fixed bottom-6 right-6 bg-amber-900 text-white px-5 py-3 rounded-full shadow-lg text-sm font-medium z-50 transition-all duration-300';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateY(20px)'; }, 3000);
}