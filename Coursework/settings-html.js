/* ============================================================
   settings.js  –  UniMarket Settings Page
   ============================================================ */

'use strict';

/* ----------------------------------------------------------------
   HELPERS
   ---------------------------------------------------------------- */
const STORAGE_KEY_USER     = 'unimarket_user';
const STORAGE_KEY_SETTINGS = 'unimarket_settings';
const STORAGE_KEY_LISTINGS = 'unimarket_listings';
const STORAGE_KEY_CARDS    = 'unimarket_cards';

function getUser()      { return JSON.parse(localStorage.getItem(STORAGE_KEY_USER))     || {}; }
function getSettings()  { return JSON.parse(localStorage.getItem(STORAGE_KEY_SETTINGS)) || {}; }
function getCards()     { return JSON.parse(localStorage.getItem(STORAGE_KEY_CARDS))    || []; }

function saveSetting(key, value) {
  const s = getSettings();
  s[key] = value;
  localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(s));
}

function showToast(msg, type = 'success') {
  const icon = type === 'success' ? 'fa-check-circle' : 'fa-circle-exclamation';
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<i class="fas ${icon}"></i> ${msg}`;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

function confirm(title, body, onConfirm) {
  const overlay = document.getElementById('confirmModal');
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').textContent  = body;
  overlay.classList.remove('hidden');

  const confBtn   = document.getElementById('modalConfirm');
  const cancelBtn = document.getElementById('modalCancel');

  function cleanup() {
    overlay.classList.add('hidden');
    confBtn.removeEventListener('click', handleConfirm);
    cancelBtn.removeEventListener('click', cleanup);
  }
  function handleConfirm() { cleanup(); onConfirm(); }

  confBtn.addEventListener('click', handleConfirm);
  cancelBtn.addEventListener('click', cleanup);
  overlay.addEventListener('click', e => { if (e.target === overlay) cleanup(); }, { once: true });
}

/* ----------------------------------------------------------------
   POPULATE NAVBAR AVATAR
   ---------------------------------------------------------------- */
function populateNav() {
  const user = getUser();
  const navAv = document.getElementById('navAvatar');
  if (user.avatarImg) {
    navAv.innerHTML = `<img src="${user.avatarImg}" alt="avatar" style="width:38px;height:38px;border-radius:50%;object-fit:cover;" />`;
  } else {
    navAv.textContent = user.avatarText || 'U';
  }
}

/* ================================================================
   SIDEBAR NAVIGATION
   ================================================================ */
function initSideNav() {
  document.querySelectorAll('.snav-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const sec = link.dataset.sec;

      document.querySelectorAll('.snav-link').forEach(l => l.classList.remove('active'));
      document.querySelectorAll('.settings-section').forEach(s => s.classList.remove('active'));

      link.classList.add('active');
      document.getElementById(`sec-${sec}`).classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

/* ================================================================
   SECTION: ACCOUNT & SECURITY
   ================================================================ */

/* --- Email change --- */
function initEmailChange() {
  const user = getUser();
  const curEl = document.getElementById('currentEmail');
  if (curEl) curEl.value = user.email || '';

  document.getElementById('changeEmailBtn')?.addEventListener('click', () => {
    const newEmail = document.getElementById('newEmail').value.trim();
    if (!newEmail) { showToast('Please enter a new email.', 'error'); return; }
    if (!newEmail.includes('@') || !newEmail.includes('.ac.uk')) {
      showToast('Must be a university .ac.uk email address.', 'error'); return;
    }
    const existing = getUser();
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify({ ...existing, email: newEmail }));
    document.getElementById('currentEmail').value = newEmail;
    document.getElementById('newEmail').value     = '';
    showToast('Email address updated!');
  });
}

/* --- Password change --- */
function initPasswordChange() {
  const newPwdEl = document.getElementById('newPwd');
  newPwdEl?.addEventListener('input', () => updateStrength(newPwdEl.value));

  document.getElementById('changePwdBtn')?.addEventListener('click', () => {
    const cur     = document.getElementById('currentPwd').value;
    const newPwd  = document.getElementById('newPwd').value;
    const confirm = document.getElementById('confirmPwd').value;

    if (!cur)             { showToast('Enter your current password.', 'error'); return; }
    if (newPwd.length < 8){ showToast('New password must be at least 8 characters.', 'error'); return; }
    if (newPwd !== confirm){ showToast('Passwords do not match.', 'error'); return; }

    // In a real app this would hit the API; here we store a hash flag
    saveSetting('pwdChanged', Date.now());
    document.getElementById('currentPwd').value = '';
    document.getElementById('newPwd').value      = '';
    document.getElementById('confirmPwd').value  = '';
    updateStrength('');
    showToast('Password changed successfully!');
  });
}

function updateStrength(pwd) {
  const bar   = document.getElementById('strengthBar');
  const label = document.getElementById('strengthLabel');
  if (!bar || !label) return;

  let score = 0;
  if (pwd.length >= 8)              score++;
  if (/[A-Z]/.test(pwd))            score++;
  if (/[0-9]/.test(pwd))            score++;
  if (/[^A-Za-z0-9]/.test(pwd))    score++;

  const configs = [
    { w: '0%',   bg: 'transparent', text: '' },
    { w: '25%',  bg: '#ef4444',     text: 'Weak',        colour: '#ef4444' },
    { w: '50%',  bg: '#f97316',     text: 'Fair',        colour: '#f97316' },
    { w: '75%',  bg: '#eab308',     text: 'Good',        colour: '#eab308' },
    { w: '100%', bg: '#22c55e',     text: 'Strong',      colour: '#22c55e' },
  ];

  const c = configs[pwd.length === 0 ? 0 : score] || configs[0];
  bar.style.width      = c.w;
  bar.style.background = c.bg;
  label.textContent    = c.text;
  label.style.color    = c.colour || '';
}

/* --- Password show/hide toggles --- */
function initPwdToggles() {
  document.querySelectorAll('.pwd-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = document.getElementById(btn.dataset.target);
      if (!input) return;
      const isText = input.type === 'text';
      input.type = isText ? 'password' : 'text';
      btn.querySelector('i').className = `fas fa-eye${isText ? '' : '-slash'}`;
    });
  });
}

/* --- 2FA toggle --- */
function init2FA() {
  const toggle  = document.getElementById('toggle2fa');
  const setup   = document.getElementById('tfaSetup');
  if (!toggle) return;

  toggle.checked = getSettings().twoFA || false;
  if (toggle.checked) setup?.classList.remove('hidden');

  toggle.addEventListener('change', () => {
    saveSetting('twoFA', toggle.checked);
    if (toggle.checked) {
      setup?.classList.remove('hidden');
      showToast('Two-factor authentication enabled.');
    } else {
      setup?.classList.add('hidden');
      showToast('Two-factor authentication disabled.');
    }
  });
}

/* ================================================================
   SECTION: NOTIFICATIONS
   ================================================================ */
function initNotifications() {
  const settings = getSettings();

  document.querySelectorAll('.notif-toggle').forEach(toggle => {
    const key = toggle.dataset.key;
    toggle.checked = settings[key] !== undefined ? settings[key] : toggle.hasAttribute('checked');
    toggle.addEventListener('change', () => saveSetting(key, toggle.checked));
  });

  const freqEl = document.getElementById('emailFreq');
  if (freqEl) {
    freqEl.value = settings.emailFreq || 'daily';
    document.getElementById('saveNotifBtn')?.addEventListener('click', () => {
      saveSetting('emailFreq', freqEl.value);
      showToast('Notification preferences saved!');
    });
  }
}

/* ================================================================
   SECTION: PRIVACY
   ================================================================ */
function initPrivacy() {
  const settings = getSettings();

  document.querySelectorAll('.priv-toggle').forEach(toggle => {
    const key = toggle.dataset.key;
    toggle.checked = settings[key] !== undefined ? settings[key] : toggle.hasAttribute('checked');
    toggle.addEventListener('change', () => saveSetting(key, toggle.checked));
  });

  document.getElementById('savePrivacyBtn')?.addEventListener('click', () => {
    document.querySelectorAll('.priv-toggle').forEach(t => saveSetting(t.dataset.key, t.checked));
    showToast('Privacy settings saved!');
  });

  document.getElementById('exportDataBtn')?.addEventListener('click', () => {
    const data = {
      user:      getUser(),
      listings:  JSON.parse(localStorage.getItem('unimarket_listings') || '[]'),
      purchases: JSON.parse(localStorage.getItem('unimarket_purchases') || '[]'),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'unimarket_data_export.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data export downloaded!');
  });
}

/* ================================================================
   SECTION: APPEARANCE
   ================================================================ */
function initAppearance() {
  const settings = getSettings();

  // Theme
  const savedTheme = settings.theme || 'light';
  applyTheme(savedTheme);
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === savedTheme);
    btn.addEventListener('click', () => {
      document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyTheme(btn.dataset.theme);
      saveSetting('theme', btn.dataset.theme);
      showToast(`Theme set to ${btn.dataset.theme}.`);
    });
  });

  // Accent colour
  const savedAccent = settings.accent || '#2563eb';
  applyAccent(savedAccent);
  document.querySelectorAll('.swatch').forEach(sw => {
    sw.classList.toggle('active', sw.dataset.colour === savedAccent);
    sw.addEventListener('click', () => {
      document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
      sw.classList.add('active');
      applyAccent(sw.dataset.colour);
      saveSetting('accent', sw.dataset.colour);
      showToast('Accent colour updated!');
    });
  });

  // Font size
  const fsRange = document.getElementById('fontSizeRange');
  const fsValue = document.getElementById('fontSizeValue');
  if (fsRange) {
    fsRange.value = settings.fontSize || 15;
    applyFontSize(fsRange.value);
    fsRange.addEventListener('input', () => {
      applyFontSize(fsRange.value);
      saveSetting('fontSize', Number(fsRange.value));
    });
  }
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else if (theme === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : '');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

function applyAccent(colour) {
  document.documentElement.style.setProperty('--primary', colour);
  // Darken by ~10% for hover
  document.documentElement.style.setProperty('--primary-dark', shadeColour(colour, -15));
}

function applyFontSize(size) {
  document.documentElement.style.fontSize = `${size}px`;
  const el = document.getElementById('fontSizeValue');
  if (el) el.textContent = `${size}px`;
}

function shadeColour(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r   = Math.max(0, Math.min(255, (num >> 16) + percent));
  const g   = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + percent));
  const b   = Math.max(0, Math.min(255, (num & 0xff) + percent));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/* ================================================================
   SECTION: PAYMENT METHODS
   ================================================================ */
function initPayment() {
  renderCards();

  document.getElementById('addCardBtn')?.addEventListener('click', () => {
    document.getElementById('addCardBtn').classList.add('hidden');
    document.getElementById('addCardForm').classList.remove('hidden');
  });

  document.getElementById('cancelCardBtn')?.addEventListener('click', () => {
    document.getElementById('addCardForm').classList.add('hidden');
    document.getElementById('addCardBtn').classList.remove('hidden');
    clearCardForm();
  });

  // Card number formatting
  document.getElementById('cardNumber')?.addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
  });

  // Expiry formatting
  document.getElementById('cardExpiry')?.addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '$1 / $2').slice(0, 7);
  });

  document.getElementById('saveCardBtn')?.addEventListener('click', saveCard);

  // Bank details
  const settings = getSettings();
  if (settings.bankSort)    document.getElementById('bankSort').value    = settings.bankSort;
  if (settings.bankAccount) document.getElementById('bankAccount').value = settings.bankAccount;

  document.getElementById('saveBankBtn')?.addEventListener('click', () => {
    const sort = document.getElementById('bankSort').value.trim();
    const acc  = document.getElementById('bankAccount').value.trim();
    if (!sort || !acc) { showToast('Enter both sort code and account number.', 'error'); return; }
    saveSetting('bankSort', sort);
    saveSetting('bankAccount', acc);
    showToast('Bank details saved!');
  });
}

function renderCards() {
  const cards = getCards();
  const list  = document.getElementById('cardsList');
  if (!list) return;

  if (cards.length === 0) {
    list.innerHTML = '<p class="text-muted">No saved cards. Add one below.</p>';
    return;
  }

  list.innerHTML = cards.map((c, i) => `
    <div class="card-row" data-idx="${i}">
      <div class="card-icon"><i class="fas fa-credit-card"></i></div>
      <div class="card-info">
        <div class="card-number">•••• •••• •••• ${c.last4}</div>
        <div class="card-expiry">Expires ${c.expiry}</div>
      </div>
      ${i === 0 ? '<span class="card-default-badge">Default</span>' : ''}
      <button class="card-delete" data-idx="${i}" title="Remove card"><i class="fas fa-trash-can"></i></button>
    </div>
  `).join('');

  list.querySelectorAll('.card-delete').forEach(btn => {
    btn.addEventListener('click', () => deleteCard(Number(btn.dataset.idx)));
  });
}

function saveCard() {
  const number = document.getElementById('cardNumber').value.replace(/\s/g, '');
  const expiry = document.getElementById('cardExpiry').value.trim();
  const cvc    = document.getElementById('cardCvc').value.trim();
  const name   = document.getElementById('cardName').value.trim();

  if (!name)               { showToast('Enter cardholder name.', 'error'); return; }
  if (number.length !== 16){ showToast('Enter a valid 16-digit card number.', 'error'); return; }
  if (!expiry.includes('/'))  { showToast('Enter a valid expiry date.', 'error'); return; }
  if (cvc.length < 3)      { showToast('Enter a valid CVC.', 'error'); return; }

  const cards = getCards();
  cards.push({ name, last4: number.slice(-4), expiry: expiry.replace(' ', '') });
  localStorage.setItem(STORAGE_KEY_CARDS, JSON.stringify(cards));

  document.getElementById('addCardForm').classList.add('hidden');
  document.getElementById('addCardBtn').classList.remove('hidden');
  clearCardForm();
  renderCards();
  showToast('Card saved securely!');
}

function deleteCard(idx) {
  confirm(
    'Remove Card',
    'Are you sure you want to remove this card from your account?',
    () => {
      const cards = getCards();
      cards.splice(idx, 1);
      localStorage.setItem(STORAGE_KEY_CARDS, JSON.stringify(cards));
      renderCards();
      showToast('Card removed.');
    }
  );
}

function clearCardForm() {
  ['cardName','cardNumber','cardExpiry','cardCvc'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

/* ================================================================
   SECTION: DANGER ZONE
   ================================================================ */
function initDangerZone() {
  document.getElementById('deactivateBtn')?.addEventListener('click', () => {
    confirm(
      'Deactivate Account',
      'Your profile and listings will be hidden until you log back in. Are you sure?',
      () => {
        showToast('Account deactivated. Redirecting…');
        setTimeout(() => window.location.href = 'loginregister.html', 1800);
      }
    );
  });

  document.getElementById('deleteListingsBtn')?.addEventListener('click', () => {
    confirm(
      'Delete All Listings',
      'This will permanently remove all your listings. This cannot be undone.',
      () => {
        localStorage.removeItem('unimarket_listings');
        showToast('All listings deleted.');
      }
    );
  });

  document.getElementById('deleteAccountBtn')?.addEventListener('click', () => {
    confirm(
      'Delete Account Permanently',
      'All your data, listings, and purchase history will be erased forever. There is no way to recover your account.',
      () => {
        [STORAGE_KEY_USER, STORAGE_KEY_SETTINGS, 'unimarket_listings',
         'unimarket_purchases', 'unimarket_reviews', 'unimarket_seeded',
         STORAGE_KEY_CARDS].forEach(k => localStorage.removeItem(k));
        showToast('Account deleted. Goodbye!');
        setTimeout(() => window.location.href = 'loginregister.html', 2000);
      }
    );
  });
}

/* ================================================================
   INIT
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  populateNav();
  initSideNav();
  initEmailChange();
  initPasswordChange();
  initPwdToggles();
  init2FA();
  initNotifications();
  initPrivacy();
  initAppearance();
  initPayment();
  initDangerZone();
});
