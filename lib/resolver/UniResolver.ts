import { Resolver as AdditionalResolver, DIDResolutionOptions, DIDResolutionResult, parse, ParsedDID, Resolvable } from 'did-resolver';

import { Constants, DefaultConfig, errorResolutionResult } from '../types/constants';
import { Config, DifResolver } from '../types/types';

const fetch = require('cross-fetch');

/**
 * Class for performing various DID resolving operations.
 */
export class UniResolver implements Resolvable {
  /** Resolve URL associated with a resolver */
  private readonly config: Config;

  /** Resolver constructor */
  constructor(config?: Config) {
    this.config = { ...DefaultConfig, ...config };
  }

  /**
   * Sets the base URL for the registrar.
   *
   * @param url The base URL for the registrar.
   * @return this.
   */
  public setBaseURL(url: string): this {
    const path = Constants.URL_PATHNAME_REGEX.exec(this.config.resolveURL);
    if (path) {
      this.config.resolveURL = `${url}${path[1]}`;
    }

    return this;
  }

  /**
   * Sets the URL for the resolve endpoint.
   *
   * @param url The URL for the resolve endpoint.
   * @return this.
   */
  public setResolveURL(url: string): this {
    this.config.resolveURL = url;

    return this;
  }

  /**
   * Gets the configuration.
   * @return Config The config.
   */
  public getConfig(): Config {
    return this.config;
  }

  /**
   * Resolves a given did to did document.
   *
   * @param did The identifier (did).
   * @return Promise<DIDResolutionResult>, resolution result.
   */
  public resolve(did: string): Promise<DIDResolutionResult> {
    const parsedDid = parse(did);
    if (parsedDid === null) {
      return errorResolutionResult('invalidDid');
    }

    const url = `${this.config.resolveURL}/${parsedDid.did}`;
    return fetch(url).then(async (response: { status: number; text: () => string | PromiseLike<string | undefined> | undefined; json: () => string; }) => {
      if (response.status >= 400) {
        throw new Error(await response.text());
      } else {
        return response.json();
      }
    });
  }
}

/**
 * Packaging the resolver as a driver to meet https://github.com/decentralized-identity/did-resolver spec
 */
export function getUniResolver(didMethod: string, opts?: { resolveUrl?: string; baseUrl?: string }): DifResolver {
  if (!didMethod) {
    throw new Error('Please provide a did method for the uni-resolver client to resolve a DID document for using the method');
  }

  const resolver: UniResolver = new UniResolver();
  if (opts?.resolveUrl) {
    resolver.setResolveURL(opts.resolveUrl);
  }
  if (opts?.baseUrl) {
    resolver.setBaseURL(opts.baseUrl);
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  async function resolve(
    did: string,
    _parsed: ParsedDID,
    _didResolver: AdditionalResolver,
    _options: DIDResolutionOptions
  ): Promise<DIDResolutionResult> {
    return resolver.resolve(did);
  }

  /* eslint-enable @typescript-eslint/no-unused-vars */

  return { [didMethod]: resolve };
}

export function getUniResolvers(didMethods: string[], opts?: { resolveUrl?: string; baseUrl?: string }): DifResolver[] {
  if (!didMethods || didMethods.length == 0) {
    throw new Error('Please provide at least one DID method for the uni-resolver client to resolve a DID document for using the method');
  }
  return didMethods.map((didMethod) => getUniResolver(didMethod, opts));
}
