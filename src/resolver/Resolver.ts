'use strict';

import { DIDResolutionResult, parse } from 'did-resolver';

const fetch = require('cross-fetch');

const config = require('../config');

/**
 * Class for performing various DID resolving operations.
 */
export class Resolver {
  /** Resolve URL associated with a resolver */
  private resolveUrl: string;

  /** Resolver constructor */
  constructor() {
    this.resolveUrl = process.env.RESOLVER_URL_RESOLVE || config.resolverUrlResolve;
  }

  /**
   * Sets the URL for the resolve endpoint.
   *
   * @param url The URL for the resolve endpoint.
   */
  public setResolveUrl(url: string): void {
    this.resolveUrl = url;
  }

  /**
   * Resolves a given identifier to did document.
   *
   * @param identifier The identifier (did).
   * returns did resolution result.
   */
  public resolve(identifier: string): DIDResolutionResult {
    const parsedIdentifier = parse(identifier);
    if (parsedIdentifier === null) {
      return {
        didDocument: null,
        didDocumentMetadata: {},
        didResolutionMetadata: { error: 'invalidDid' },
      };
    }

    const url = new URL(`${this.resolveUrl}/${parsedIdentifier.did}`);
    return fetch(url).then((result) => {
      return result.json();
    });
  }
}
