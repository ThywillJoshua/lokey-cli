
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  assets: {
    'index.csr.html': {size: 1201, hash: '3c8849bd7dab0eb58a22ae3be4cb6fe813ed259d09d42bd601cb7be590001334', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1129, hash: '3d5d520f9bfec3366a704b1dfed7218980b3849fb66f7d3a0762a0803a8170cb', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-NWX5MGW7.css': {size: 4652, hash: 'tuwqv41WNKs', text: () => import('./assets-chunks/styles-NWX5MGW7_css.mjs').then(m => m.default)}
  },
};
