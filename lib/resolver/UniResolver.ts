import fetch from 'cross-fetch';
import { DIDResolutionOptions, DIDResolutionResult, parse, ParsedDID, Resolvable, ResolverRegistry } from 'did-resolver';

import { Constants, DefaultConfig, errorResolutionResult } from '../types/constants';
import { Config, UniDIDResolutionOptions } from '../types/types';


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
  public async resolve(didUrl: string, options?: DIDResolutionOptions): Promise<DIDResolutionResult> {
    const parsedDid = parse(didUrl);
    if (parsedDid === null) {
      return errorResolutionResult('invalidDid');
    }

    const url = `${options?.resolveUrl ? options.resolveUrl : this.config.resolveURL}/${parsedDid.did}`;
    const response = await fetch(url);
    if (response.status >= 400) {
      throw new Error(await response.text());
    } else {
      return await response.json();
    }
  }
}

/**
 * Packaging the resolver as a driver to meet https://github.com/decentralized-identity/did-resolver spec
 */
export function getUniResolver(didMethod: string, opts?: UniDIDResolutionOptions): ResolverRegistry {
  if (!didMethod) {
    throw new Error('Please provide a did method for the uni-resolver client to resolve a DID document for using the method');
  }

  const uniResolver: UniResolver = new UniResolver();
  if (opts?.resolveUrl) {
    uniResolver.setResolveURL(opts.resolveUrl);
  }
  if (opts?.baseUrl) {
    uniResolver.setBaseURL(opts.baseUrl);
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  async function resolve(
    did: string,
    _parsed: ParsedDID,
    _resolver: Resolvable,
    _options: DIDResolutionOptions
  ): Promise<DIDResolutionResult> {
    return uniResolver.resolve(did, opts);
  }

  /* eslint-enable @typescript-eslint/no-unused-vars */

  return { [didMethod]: resolve };
}

export function getUniResolvers(didMethods: string[], opts?: { resolveUrl?: string; baseUrl?: string }): ResolverRegistry[] {
  if (!didMethods || didMethods.length == 0) {
    throw new Error('Please provide at least one DID method for the uni-resolver client to resolve a DID document for using the method');
  }
  return didMethods.map((didMethod) => getUniResolver(didMethod, opts));
}
