/** Bridge para Mutirao.toast (core/toast.js clássico) ou fallback */
export function toast(msg, ic) {
  if (window.Mutirao && typeof Mutirao.toast === 'function') {
    return Mutirao.toast(msg, ic);
  }
  let t = document.querySelector('#toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.hidden = false;
  setTimeout(() => { t.hidden = true; }, 3100);
}
