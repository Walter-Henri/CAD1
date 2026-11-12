import * as C from '../lib/constants.js';
export function installConstants(app) {
  Object.assign(app, {
    CATS: C.CATS, STATUS: C.STATUS, RPA: C.RPA, MORRO: C.MORRO,
    shape: C.shape, stChip: C.stChip, catChip: C.catChip,
  });
}
