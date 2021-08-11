'use strict';

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
   * @example 'https://uniresolver.io/1.0/identifiers'.
   */
  public setResolveUrl(url: string): void {
    this.resolveUrl = url;
  }

  /**
   * Resolves a given identifier to did document.
   *
   * @param identifier The identifier (did).
   * returns did resolution.
   */
  public resolve(identifier: string) {
    const url = new URL(`${this.resolveUrl}/${identifier}`);
    return fetch(url).then((result) => {
      return result.json();
    });
  }
}
