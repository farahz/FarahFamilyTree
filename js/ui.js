// Header auth controls, login modal, demo notice and toasts shared by all pages.
(function () {
  const FD = window.FamilyData;
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
        <h2>تسجيل الدخول</h2>
        <p class="muted">تسجيل الدخول متاح لأفراد العائلة المخوّلين بتحديث الشجرة.</p>
        <div class="form-row"><label for="login-email">البريد الإلكتروني</label>
          <input id="login-email" type="email" required autocomplete="email" dir="ltr"></div>
        <div class="form-row"><label for="login-password">كلمة المرور</label>
          <input id="login-password" type="password" required autocomplete="current-password" dir="ltr"></div>
        <div class="form-error" id="login-error"></div>
        <div class="form-actions">
          <button type="button" class="btn btn-ghost" data-close>إلغاء</button>
          <button type="submit" class="btn">دخول</button>
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
        toast('تم تسجيل الدخول');
      } catch (ex) {
        err.textContent = ex.message === 'Invalid login credentials' ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : ex.message;
      } finally {
        btn.disabled = false;
      }
    });
  }

  function renderAuth() {
    const area = document.getElementById('auth-area');
    if (!area) return;
    if (currentUser) {
      area.innerHTML = `<span class="auth-user" title="${esc(currentUser.email)}">${esc(currentUser.email)}</span>
        <button class="btn btn-ghost btn-sm" id="logout-btn">خروج</button>`;
      document.getElementById('logout-btn').onclick = async () => {
        await FD.auth.signOut();
        toast('تم تسجيل الخروج');
      };
    } else {
      area.innerHTML = `<button class="btn btn-sm" id="login-btn">دخول</button>`;
      document.getElementById('login-btn').onclick = () => {
        if (!FD.live) return toast('وضع العرض التجريبي: التعديل غير مفعّل بعد');
        openModal('login-modal');
        document.getElementById('login-email').focus();
      };
    }
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
      note.textContent = 'نسخة تجريبية — البيانات للعرض فقط';
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
