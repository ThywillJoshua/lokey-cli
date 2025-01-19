
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  assets: {
    'index.csr.html': {size: 1201, hash: '467f7e302b558456e262ca5bf43b9b1c25dcbb9350f640a3211a2a59ff57db6e', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1129, hash: '1d2b9ac2b78ce31d9f42749d546407416336964c48c9ac82e537c6ab908e28c4', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-NWX5MGW7.css': {size: 4652, hash: 'tuwqv41WNKs', text: () => import('./assets-chunks/styles-NWX5MGW7_css.mjs').then(m => m.default)}
  },
};
