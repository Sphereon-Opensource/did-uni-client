'use strict';

import { DIDResolutionResult, parse } from 'did-resolver';

import { Constants } from '../Constants';

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
   * Sets the base URL for the registrar.
   *
   * @param url The base URL for the registrar.
   * @return this.
   */
  public setBaseURL(url: string): this {
    this.resolveUrl = `${url}${new URL(this.resolveUrl).pathname}`;

    return this;
  }

  /**
   * Sets the URL for the resolve endpoint.
   *
   * @param url The URL for the resolve endpoint.
   * @return this.
   */
  public setResolveURL(url: string): this {
    this.resolveUrl = url;

    return this;
  }

  /**
   * Gets the URL for the resolve endpoint.
   * @return resolve URL.
   */
  public getResolveURL(): string {
    return this.resolveUrl;
  }

  /**
   * Resolves a given did to did document.
   *
   * @param did The identifier (did).
   * @return did resolution result.
   */
  public resolve(did: string): DIDResolutionResult {
    const parsedDid = parse(did);
    if (parsedDid === null) {
      return {
        didDocument: null,
        didDocumentMetadata: {},
        didResolutionMetadata: { error: Constants.INVALID_DID },
      };
    }

    const url = new URL(`${this.resolveUrl}/${parsedDid.did}`);
    return fetch(url).then((result) => {
      return result.json();
    });
  }
}
