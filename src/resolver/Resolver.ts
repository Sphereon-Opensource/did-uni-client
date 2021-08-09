'use strict';

const fetch = require('cross-fetch');

const config = require('../config');

/**
 * Class for performing various DID resolving operations.
 */
export class Resolver {
  /** URL associated with the resolver */
  private url: string;

  constructor(url: string = process.env.RESOLVER_URL || config.resolverUrl) {
    this.url = url;
  }

  /**
   * Sets the URL for the resolver.
   *
   * @param type The URL for the resolver.
   */
  setURL(url: string) {
    this.url = url;
  }

  resolve(identifier: string) {
    const url = new URL(`${this.url}/1.0/identifiers/${identifier}`);
    return fetch(url).then((result) => {
      return result.json();
    });
  }
}
