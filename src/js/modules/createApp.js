import { installDom } from './install/dom.js';
import { installConstants } from './install/constants.js';
import { installRuntime } from './install/runtime.js';
import { toast } from './ui/toast.js';
import { createHelp } from './ui/help.js';

export function createApp() {
  const app = { toast };
  installDom(app);
  installConstants(app);
  Object.assign(app, createHelp(app));
  installRuntime(app);
  return app;
}
