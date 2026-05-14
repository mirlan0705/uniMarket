/* ============================================================
   profile.js  –  UniMarket Profile Page
   ============================================================ */

'use strict';

/* ----------------------------------------------------------------
   CONSTANTS & HELPERS
   ---------------------------------------------------------------- */
const STORAGE_KEY_USER     = 'unimarket_user';
const STORAGE_KEY_LISTINGS = 'unimarket_listings';
const STORAGE_KEY_PURCHASES= 'unimarket_purchases';
const STORAGE_KEY_REVIEWS  = 'unimarket_reviews';

function getUser()      { return JSON.parse(localStorage.getItem(STORAGE_KEY_USER))     || {}; }
function getListings()  { return JSON.parse(localStorage.getItem(STORAGE_KEY_LISTINGS)) || []; }
function getPurchases() { return JSON.parse(localStorage.getItem(STORAGE_KEY_PURCHASES))|| []; }
function getReviews()   { return JSON.parse(localStorage.getItem(STORAGE_KEY_REVIEWS))  || []; }

function saveUser(data) {
  const existing = getUser();
  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify({ ...existing, ...data }));
}

function showToast(msg, type = 'success') {
  const icon = type === 'success' ? 'fa-check-circle' : 'fa-circle-exclamation';
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<i class="fas ${icon}"></i> ${msg}`;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

function getInitials(name) {
  if (!name) return 'U';
  return name.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

/* ----------------------------------------------------------------
   SEED DEMO DATA (first visit only)
   ---------------------------------------------------------------- */
function seedDemoData() {
  if (localStorage.getItem('unimarket_seeded')) return;

  saveUser({
    firstName: 'Jamie',
    lastName:  'Chen',
    email:     'j.chen@university.ac.uk',
    dept:      'Computer Science',
    bio:       'Final year CS student selling old textbooks and electronics.',
    phone:     '+44 7123 456789',
    avatarText: 'JC'
  });

  const listings = [
    { id: 1, title: 'Calculus Textbook',    price: '£12.00', status: 'active',  emoji: '📘', date: '2024-10-01' },
    { id: 2, title: 'Scientific Calculator',price: '£8.50',  status: 'sold',    emoji: '🔬', date: '2024-09-15' },
    { id: 3, title: 'Laptop Stand',         price: '£15.00', status: 'active',  emoji: '💻', date: '2024-11-03' },
    { id: 4, title: 'Algorithms Notes',     price: '£5.00',  status: 'pending', emoji: '📝', date: '2024-11-10' },
  ];
  localStorage.setItem(STORAGE_KEY_LISTINGS, JSON.stringify(listings));

  const purchases = [
    { id: 1, title: 'Data Structures Book', price: '£10.00', seller: 'Alice M.', date: '2024-10-20', emoji: '📗' },
    { id: 2, title: 'USB-C Hub',            price: '£18.00', seller: 'Rob T.',   date: '2024-09-05', emoji: '🔌' },
  ];
  localStorage.setItem(STORAGE_KEY_PURCHASES, JSON.stringify(purchases));

  const reviews = [
    { reviewer: 'Alice M.', initials: 'AM', date: '2024-10-21', rating: 5, text: 'Fast response and item exactly as described. Great seller!' },
    { reviewer: 'Rob T.',   initials: 'RT', date: '2024-09-06', rating: 4, text: 'Item was good but took a couple of days to arrange pickup.' },
  ];
  localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(reviews));

  localStorage.setItem('unimarket_seeded', 'true');
}

/* ----------------------------------------------------------------
   POPULATE SIDEBAR
   ---------------------------------------------------------------- */
function populateSidebar() {
  const user     = getUser();
  const listings = getListings();
  const reviews  = getReviews();

  const fullName = `${user.firstName || 'Student'} ${user.lastName || ''}`.trim();
  const initials = user.avatarText || getInitials(fullName);

  document.getElementById('sidebarName').textContent  = fullName;
  document.getElementById('sidebarEmail').textContent = user.email || '–';
  document.getElementById('navAvatar').textContent    = initials;

  const avatarEl = document.getElementById('avatarDisplay');
  if (user.avatarImg) {
    avatarEl.innerHTML = `<img src="${user.avatarImg}" alt="avatar" />`;
  } else {
    avatarEl.textContent = initials;
  }

  const sold = listings.filter(l => l.status === 'sold').length;
  document.getElementById('statListings').textContent = listings.length;
  document.getElementById('statSold').textContent     = sold;

  if (reviews.length > 0) {
    const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
    document.getElementById('statRating').textContent = avg + '★';
  }
}

/* ----------------------------------------------------------------
   POPULATE EDIT FORM
   ---------------------------------------------------------------- */
function populateForm() {
  const user = getUser();
  document.getElementById('firstName').value    = user.firstName || '';
  document.getElementById('lastName').value     = user.lastName  || '';
  document.getElementById('profileEmail').value = user.email     || '';
  document.getElementById('profileDept').value  = user.dept      || '';
  document.getElementById('profileBio').value   = user.bio       || '';
  document.getElementById('profilePhone').value = user.phone     || '';
  updateBioCount();
}

/* ----------------------------------------------------------------
   RENDER LISTINGS TAB
   ---------------------------------------------------------------- */
function renderListings() {
  const listings  = getListings();
  const grid      = document.getElementById('listingsGrid');
  const empty     = document.getElementById('listingsEmpty');
  const countEl   = document.getElementById('listingCount');

  countEl.textContent = `${listings.length} item${listings.length !== 1 ? 's' : ''}`;
  document.getElementById('statListings').textContent = listings.length;

  if (listings.length === 0) {
    grid.innerHTML  = '';
    grid.style.display  = 'none';
    empty.style.display = 'flex';
    return;
  }

  grid.style.display  = '';
  empty.style.display = 'none';

  grid.innerHTML = listings.map(l => `
    <div class="listing-card" data-id="${l.id}">
      <div class="listing-thumb">${l.image ? `<img src="${l.image}" alt="${l.title}" />` : l.emoji}</div>
      <div class="listing-info">
        <div class="listing-title" title="${l.title}">${l.title}</div>
        <div class="listing-price">${l.price}</div>
        <span class="listing-status ${l.status}">${l.status}</span>
        <div class="listing-actions">
          <button class="btn-icon edit-listing" data-id="${l.id}" title="Edit"><i class="fas fa-pen"></i></button>
          <button class="btn-icon delete delete-listing" data-id="${l.id}" title="Delete"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    </div>
  `).join('');

  // Edit / delete handlers
  grid.querySelectorAll('.edit-listing').forEach(btn => {
    btn.addEventListener('click', () => {
      window.location.href = `sellnow.html?edit=${btn.dataset.id}`;
    });
  });
  grid.querySelectorAll('.delete-listing').forEach(btn => {
    btn.addEventListener('click', () => deleteListing(Number(btn.dataset.id)));
  });
}

function deleteListing(id) {
  if (!confirm('Remove this listing?')) return;
  let listings = getListings().filter(l => l.id !== id);
  localStorage.setItem(STORAGE_KEY_LISTINGS, JSON.stringify(listings));
  renderListings();
  populateSidebar();
  showToast('Listing removed.');
}

/* ----------------------------------------------------------------
   RENDER PURCHASES TAB
   ---------------------------------------------------------------- */
function renderPurchases() {
  const purchases = getPurchases();
  const list  = document.getElementById('purchasesList');
  const empty = document.getElementById('purchasesEmpty');

  if (purchases.length === 0) {
    list.innerHTML  = '';
    list.style.display  = 'none';
    empty.style.display = 'flex';
    return;
  }

  list.style.display  = 'flex';
  empty.style.display = 'none';

  list.innerHTML = purchases.map(p => `
    <a class="purchase-row" href="product.html?id=${p.id}">
      <div class="purchase-thumb">${p.image ? `<img src="${p.image}" alt="${p.title}" />` : p.emoji}</div>
      <div class="purchase-info">
        <div class="purchase-title">${p.title}</div>
        <div class="purchase-seller">Sold by ${p.seller}</div>
        <div class="purchase-date">${formatDate(p.date)}</div>
      </div>
      <div class="purchase-price">${p.price}</div>
    </a>
  `).join('');
}

/* ----------------------------------------------------------------
   RENDER REVIEWS TAB
   ---------------------------------------------------------------- */
function renderReviews() {
  const reviews = getReviews();
  const list  = document.getElementById('reviewsList');
  const empty = document.getElementById('reviewsEmpty');

  if (reviews.length === 0) {
    list.innerHTML  = '';
    list.style.display  = 'none';
    empty.style.display = 'flex';
    return;
  }

  list.style.display  = 'flex';
  empty.style.display = 'none';

  list.innerHTML = reviews.map(r => `
    <div class="review-card">
      <div class="review-header">
        <div class="reviewer-avatar">${r.initials}</div>
        <div>
          <div class="reviewer-name">${r.reviewer}</div>
          <div class="reviewer-date">${formatDate(r.date)}</div>
        </div>
        <div class="stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
      </div>
      <p class="review-text">${r.text}</p>
    </div>
  `).join('');
}

/* ----------------------------------------------------------------
   TABS
   ---------------------------------------------------------------- */
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
    });
  });
}

/* ----------------------------------------------------------------
   SAVE PROFILE FORM
   ---------------------------------------------------------------- */
function initSaveProfile() {
  const bioEl = document.getElementById('profileBio');
  bioEl.addEventListener('input', updateBioCount);

  document.getElementById('saveProfileBtn').addEventListener('click', () => {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName  = document.getElementById('lastName').value.trim();
    const email     = document.getElementById('profileEmail').value.trim();

    if (!firstName || !lastName) { showToast('Please enter your name.', 'error'); return; }
    if (!email.includes('@'))    { showToast('Please enter a valid email.', 'error'); return; }

    saveUser({
      firstName,
      lastName,
      email,
      dept:      document.getElementById('profileDept').value.trim(),
      bio:       bioEl.value.trim(),
      phone:     document.getElementById('profilePhone').value.trim(),
      avatarText: getInitials(`${firstName} ${lastName}`)
    });

    populateSidebar();
    const msg = document.getElementById('saveMsg');
    msg.hidden = false;
    setTimeout(() => { msg.hidden = true; }, 3000);
    showToast('Profile updated successfully!');
  });
}

function updateBioCount() {
  const val = document.getElementById('profileBio').value;
  document.getElementById('bioCount').textContent = val.length;
}

/* ----------------------------------------------------------------
   AVATAR UPLOAD
   ---------------------------------------------------------------- */
function initAvatarUpload() {
  document.getElementById('avatarInput').addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { showToast('Image must be under 2 MB.', 'error'); return; }

    const reader = new FileReader();
    reader.onload = e => {
      const dataUrl = e.target.result;
      saveUser({ avatarImg: dataUrl });
      const avatarEl = document.getElementById('avatarDisplay');
      avatarEl.innerHTML = `<img src="${dataUrl}" alt="avatar" />`;
      document.getElementById('navAvatar').innerHTML = `<img src="${dataUrl}" alt="avatar" style="width:38px;height:38px;border-radius:50%;object-fit:cover;" />`;
      showToast('Profile photo updated!');
    };
    reader.readAsDataURL(file);
  });
}

/* ----------------------------------------------------------------
   LOGOUT
   ---------------------------------------------------------------- */
function initLogout() {
  document.getElementById('logoutBtn').addEventListener('click', e => {
    e.preventDefault();
    if (confirm('Log out of UniMarket?')) {
      // Keep listings/purchases but clear session token
      sessionStorage.removeItem('unimarket_session');
      window.location.href = 'loginregister.html';
    }
  });
}

/* ----------------------------------------------------------------
   UTILITY
   ---------------------------------------------------------------- */
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

/* ----------------------------------------------------------------
   INIT
   ---------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  seedDemoData();
  populateSidebar();
  populateForm();
  renderListings();
  renderPurchases();
  renderReviews();
  initTabs();
  initSaveProfile();
  initAvatarUpload();
  initLogout();
});
