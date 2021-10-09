import { DIDResolutionResult } from 'did-resolver';

import { Config } from './types';

export const Constants = {
  INVALID_DID: 'invalidDid',
  URL_PATHNAME_REGEX: /.+?:\/\/.+?(\/.+?)(?:#|\?|$)/,
};

export const DefaultURLs = {
  /** Registrar URL's*/
  CREATE: 'https://uniregistrar.io/1.0/create',
  UPDATE: 'https://uniregistrar.io/1.0/update',
  DEACTIVATE: 'https://uniregistrar.io/1.0/deactivate',

  /** Resolver URL's*/
  RESOLVE: 'https://dev.uniresolver.io/1.0/identifiers',
};

export const DefaultConfig: Config = {
  createURL: process.env.REGISTRAR_URL_CREATE || DefaultURLs.CREATE,
  updateURL: process.env.REGISTRAR_URL_UPDATE || DefaultURLs.UPDATE,
  deactivateURL: process.env.REGISTRAR_URL_DEACTIVATE || DefaultURLs.DEACTIVATE,
  resolveURL: process.env.RESOLVER_URL_RESOLVE || DefaultURLs.RESOLVE,
};

const EMPTY_RESULT: DIDResolutionResult = {
  didResolutionMetadata: {},
  didDocument: null,
  didDocumentMetadata: {},
};

export const errorResolutionResult = (error: string): Promise<DIDResolutionResult> => {
  return new Promise<DIDResolutionResult>((resolve) => {
    resolve({
      ...EMPTY_RESULT,
      didResolutionMetadata: { error },
    });
  });
};
