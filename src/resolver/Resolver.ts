import { DIDResolutionOptions, DIDResolutionResult, Resolver as DrResolver, parse, ParsedDID } from 'did-resolver';

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
    this.resolveUrl = `${url}${Constants.URL_PATHNAME_REGEX.exec(this.resolveUrl)[1]}`;

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
   * @return string URL.
   */
  public getResolveURL(): string {
    return this.resolveUrl;
  }

  /**
   * Resolves a given did to did document.
   *
   * @param did The identifier (did).
   * @return {didResolutionMetadata: {error: string}, didDocumentMetadata: {}, didDocument: null}, resolution result.
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

    const url = `${this.resolveUrl}/${parsedDid.did}`;
    return fetch(url).then(async (response) => {
      if (response.status >= 400) {
        return Promise.reject(new Error(await response.text()));
      } else {
        return response.json();
      }
    });
  }
}

/**
 * Packaging the resolver as a driver to meet https://github.com/decentralized-identity/did-resolver spec
 */
export function getResolver(opt?: any) {
  const resolver: Resolver = new Resolver();
  if (opt && opt['resolveUrl']) {
    resolver.setResolveURL(opt['resolveUrl']);
  }
  async function resolve(
    did: string,
    _parsed: ParsedDID,
    _didResolver: DrResolver,
    _options: DIDResolutionOptions
  ): Promise<DIDResolutionResult> {
    return resolver.resolve(did);
  }

  return { resolve: resolve };
}
