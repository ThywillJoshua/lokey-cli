
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  assets: {
    'index.csr.html': {size: 1201, hash: 'f5ad6312ba6d571542d99356318a0aa5486a5ee9b3b9f46cd44d696658b891a2', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1129, hash: 'f45edd8cc00f1a4d038c079e76314be8644f62caade93b2feca002df79a66700', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-22CYXLPO.css': {size: 5588, hash: 'RudPFWZxFlU', text: () => import('./assets-chunks/styles-22CYXLPO_css.mjs').then(m => m.default)}
  },
};
