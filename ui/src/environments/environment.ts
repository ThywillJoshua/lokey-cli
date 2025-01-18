import { isEmbedded, prefix } from './environment.development';

export const env = {
  backendApi: (prefix as string).includes('ui')
    ? `https://d1qq4jkpje1gtx.cloudfront.net${prefix.replace('ui', '/server')}`
    : `https://d1qq4jkpje1gtx.cloudfront.net/prod`,
  isEmbedded,
};
