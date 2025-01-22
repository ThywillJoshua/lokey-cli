
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  assets: {
    'index.csr.html': {size: 1201, hash: '8ce3efbdfd69981eaf0a0e8f981c4e9285cd5b0408e576bdb2bc9486c7f526d1', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1129, hash: '8be5ece016b2af0cf4c52f2d6a75a1c48a99c0d1a15da0baa90b9b50d65c5e43', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-22CYXLPO.css': {size: 5588, hash: 'RudPFWZxFlU', text: () => import('./assets-chunks/styles-22CYXLPO_css.mjs').then(m => m.default)}
  },
};
