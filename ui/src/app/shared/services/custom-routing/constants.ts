import { env } from '../../../../environments/environment';

export const ROUTER_NAME = 'echo';

export function getRouterLink(url: string) {
  return env.isEmbedded
    ? ['/', { outlets: { [ROUTER_NAME]: url } }]
    : ['/', ...url.split('/')];
}
