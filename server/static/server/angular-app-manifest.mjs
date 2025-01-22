
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  assets: {
    'index.csr.html': {size: 1201, hash: 'ea233ac0bd556d95a97bb3f8ed3ba66d649ebf9de3e2afef3a7248b3edb61d1e', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1129, hash: '09f50333cd7506763c35a2ca1777b8629dc7aa7e46bdcd8e00d7903344e21c82', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-22CYXLPO.css': {size: 5588, hash: 'RudPFWZxFlU', text: () => import('./assets-chunks/styles-22CYXLPO_css.mjs').then(m => m.default)}
  },
};
