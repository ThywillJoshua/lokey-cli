
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  assets: {
    'index.csr.html': {size: 1201, hash: 'f3f7c08e00d46214247e5b2b7e9529c731137351e68ea6f665d97838b8658278', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1129, hash: '345a32266f31c961873236124d6e754e7e608f4ece231c65fc3ba78a54a9f0d7', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-22CYXLPO.css': {size: 5588, hash: 'RudPFWZxFlU', text: () => import('./assets-chunks/styles-22CYXLPO_css.mjs').then(m => m.default)}
  },
};
