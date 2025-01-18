
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  assets: {
    'index.csr.html': {size: 1201, hash: '97a7e9a0a0d64e42f3735b9e59ff7117b94c02acb27c3a9d67c09f7f5c849cef', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1129, hash: 'b2f0e023537643a1f0be49a49d3eb952207dfe68451ed93a10bad7f198793c6d', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-NWX5MGW7.css': {size: 4652, hash: 'tuwqv41WNKs', text: () => import('./assets-chunks/styles-NWX5MGW7_css.mjs').then(m => m.default)}
  },
};
