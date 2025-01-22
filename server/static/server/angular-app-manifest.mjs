
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  assets: {
    'index.csr.html': {size: 1201, hash: '79195c5adb8072883b8fc2783f94d9b5ebb0469a8248f72e008087a1931f9241', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1129, hash: '284e81b32b802da569269f0d849745b0c2926abeac45ab04b8a3131f0b679021', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-22CYXLPO.css': {size: 5588, hash: 'RudPFWZxFlU', text: () => import('./assets-chunks/styles-22CYXLPO_css.mjs').then(m => m.default)}
  },
};
