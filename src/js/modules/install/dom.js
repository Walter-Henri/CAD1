import * as dom from '../lib/dom.js';
export function installDom(app) {
  Object.assign(app, {
    $: dom.$, esc: dom.esc, icon: dom.icon, norm: dom.norm, hash: dom.hash,
    DAY: dom.DAY, NOW: dom.NOW, isDesk: dom.isDesk, tempo: dom.tempo, fmt: dom.fmt,
  });
}
