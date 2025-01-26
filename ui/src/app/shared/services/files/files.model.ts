export type IFiles = {
  fileName: string;
  content: Record<string, any>;
  parsedContent?: Record<string, string>;
};

const dt = {
  from: 'English',
  to: 'Portuguese',
  keyValues: {
    'analytics.session.duration': 'Can you call me?',
    'analytics.session.text': 'I love you',
  },
};

export interface IGetTranslation {
  from: string;
  to: string;
  keyValues: Record<string, string>;
}

export interface IUpdateValue {
  filename: string;
  key: string;
  newValue: string;
}

export interface IUpdateKey {
  filename: string;
  newKey: string;
  prevKey: string;
}

export interface ITranslationRequest {
  from: string;
  to: string;
  keyValues: Record<string, string>;
}
export interface ITranslationResponse {
  translatedKeyValues: Record<string, string>;
  errors?: Record<string, string>;
}

export interface IGenerateTranslationsRequest {
  requests: ITranslationRequest[];
}

export interface IGenerateTranslationsResponse {
  responses: ITranslationResponse[];
}
