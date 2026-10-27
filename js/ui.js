// Header auth controls, language switch, login modal, demo notice and toasts shared by all pages.
(function () {
  const FD = window.FamilyData;
  const { t } = window.I18N;
  let currentUser = null;
  const listeners = [];

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function toast(msg) {
    let el = document.querySelector('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), 2800);
  }

  function openModal(id) { document.getElementById(id).classList.add('open'); }
  function closeModal(id) { document.getElementById(id).classList.remove('open'); }

  function injectLoginModal() {
    const wrap = document.createElement('div');
    wrap.className = 'modal-backdrop';
    wrap.id = 'login-modal';
    wrap.innerHTML = `
      <form class="modal" id="login-form">
        <h2>${t('login_title')}</h2>
        <p class="muted">${t('login_intro')}</p>
        <div class="form-row"><label for="login-email">${t('email')}</label>
          <input id="login-email" type="email" required autocomplete="email" dir="ltr"></div>
        <div class="form-row"><label for="login-password">${t('password')}</label>
          <input id="login-password" type="password" required autocomplete="current-password" dir="ltr"></div>
        <div class="form-error" id="login-error"></div>
        <div class="form-actions">
          <button type="button" class="btn btn-ghost" data-close>${t('cancel')}</button>
          <button type="submit" class="btn">${t('submit_login')}</button>
        </div>
      </form>`;
    document.body.appendChild(wrap);
    wrap.addEventListener('click', (e) => {
      if (e.target === wrap || e.target.hasAttribute('data-close')) closeModal('login-modal');
    });
    wrap.querySelector('form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const err = document.getElementById('login-error');
      const btn = e.target.querySelector('button[type=submit]');
      err.textContent = '';
      btn.disabled = true;
      try {
        await FD.auth.signIn(document.getElementById('login-email').value.trim(), document.getElementById('login-password').value);
        closeModal('login-modal');
        toast(t('logged_in'));
      } catch (ex) {
        err.textContent = ex.message === 'Invalid login credentials' ? t('bad_credentials') : ex.message;
      } finally {
        btn.disabled = false;
      }
    });
  }

  function renderAuth() {
    const area = document.getElementById('auth-area');
    if (!area) return;
    const langBtn = `<button class="btn btn-ghost btn-sm lang-toggle" id="lang-btn">${t('lang_switch')}</button>`;
    if (currentUser) {
      area.innerHTML = `${langBtn}<span class="auth-user" title="${esc(currentUser.email)}">${esc(currentUser.email)}</span>
        <button class="btn btn-ghost btn-sm" id="logout-btn">${t('logout')}</button>`;
      document.getElementById('logout-btn').onclick = async () => {
        await FD.auth.signOut();
        toast(t('logged_out'));
      };
    } else {
      area.innerHTML = `${langBtn}<button class="btn btn-sm" id="login-btn">${t('login')}</button>`;
      document.getElementById('login-btn').onclick = () => {
        if (!FD.live) return toast(t('demo_no_edit'));
        openModal('login-modal');
        document.getElementById('login-email').focus();
      };
    }
    document.getElementById('lang-btn').onclick = window.I18N.switchLang;
  }

  function setUser(u) {
    currentUser = u;
    renderAuth();
    listeners.forEach((cb) => cb(u));
  }

  async function init() {
    if (!FD.live) {
      const note = document.createElement('div');
      note.className = 'demo-banner';
      note.textContent = t('demo_banner');
      document.body.prepend(note);
    }
    injectLoginModal();
    renderAuth();
    FD.auth.onChange(setUser);
    setUser(await FD.auth.user());
  }

  window.UI = {
    esc, toast, openModal, closeModal, init,
    user: () => currentUser,
    onUser(cb) { listeners.push(cb); },
  };
})();
