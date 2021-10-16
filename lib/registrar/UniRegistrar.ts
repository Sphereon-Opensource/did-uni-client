'use strict';

import { parse } from 'did-resolver';

import { Constants, DefaultConfig } from '../types/constants';
import { Config, DIDRegistrationResult } from '../types/types';

import { DIDRegistrationRequest } from './DIDRegistrationRequest';

const fetch = require('cross-fetch');

/**
 * Class for performing various DID registration operations.
 */
export class UniRegistrar {
  private readonly config: Config;

  /** Registrar constructor */
  constructor(config?: Config) {
    this.config = { ...DefaultConfig, ...config };
  }

  /**
   * Sets the base URL for the registrar.
   *
   * @param url The base URL for the registrar.
   * @return this.
   */
  public setBaseURL(url: string): UniRegistrar {
    this.config.createURL = UniRegistrar.setConfigUrl(this.config.createURL, url)
    this.config.updateURL = UniRegistrar.setConfigUrl(this.config.updateURL, url)
    this.config.deactivateURL = UniRegistrar.setConfigUrl(this.config.deactivateURL, url)

    return this
  }

  /**
   * Sets the create URL for the registrar.
   *
   * @param url The create URL for the registrar.
   * @return this.
   */
  public setCreateURL(url: string): UniRegistrar {
    this.config.createURL = url;

    return this;
  }

  /**
   * Gets the config containing the URLs.
   * @return Config The config.
   */
  public getConfig(): Config {
    return this.config;
  }

  /**
   * Sets the update URL for the registrar.
   *
   * @param url The update URL for the registrar.
   * @return this.
   */
  public setUpdateURL(url: string): UniRegistrar {
    this.config.updateURL = url;

    return this;
  }

  /**
   * Sets the deactivate URL for the registrar.
   *
   * @param url The deactivate URL for the registrar.
   * @return this.
   */
  public setDeactivateURL(url: string): UniRegistrar {
    this.config.deactivateURL = url;

    return this;
  }

  /**
   * Creates a identity for a specific method.
   *
   * @param method The requested DID method for the operation.
   * @param request Request matching the method needed for creating the identity.
   * @return job result.
   */
  public async create(method: string, request: DIDRegistrationRequest): Promise<DIDRegistrationResult> {
    return executePost(this.config.createURL, request, { method });
  }

  /**
   * Updates a identity for a specific method.
   *
   * @param did The identifier (did).
   * @param request Request matching the method needed for updating the identity.
   * @return {didResolutionMetadata: {error: string}}, job result.
   */
  public async update(did: string, request: DIDRegistrationRequest): Promise<DIDRegistrationResult> {
    return executePost(this.config.updateURL, request, { did });
  }

  /**
   * Deactivates a identity for a specific method.
   *
   * @param did The identifier (did).
   * @param request Request matching the method needed for deactivating the identity.
   * @return {didResolutionMetadata: {error: string}}, job result.
   */
  public async deactivate(did: string, request: DIDRegistrationRequest): Promise<DIDRegistrationResult> {
    return executePost(this.config.deactivateURL, request, { did });
  }

  private static setConfigUrl(configVal: string, url: string) {
    const path = Constants.URL_PATHNAME_REGEX.exec(configVal);
    if (path && path.length > 1) {
      configVal = `${url}${path[1]}`
    }
    return configVal;
  }
}

/**
 * Creates a URL with method query parameter.
 *
 * @param url The URL.
 * @param method The did method.
 * @return string URL with query parameter.
 */
function createURL(url: string, method: string): string {
  return `${url}?method=${method}`;
}

async function executePost(
  baseUrl: string,
  request: DIDRegistrationRequest,
  opts: { did?: string; method?: string }
): Promise<DIDRegistrationResult> {
  let didMethod = opts?.method;
  const identifier = opts?.did;
  if (identifier) {
    const parsedDid = parse(identifier);
    if (parsedDid === null) {
      return new Promise((resolve) =>
        resolve({
          didState: { state: Constants.INVALID_DID },
        })
      );
    }
    didMethod = parsedDid.method;
  }
  if (!didMethod) {
    throw new Error('No DID method passed or deducted')
  }
  const url = createURL(baseUrl, didMethod);

  return fetch(url, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ identifier, ...request }),
  }).then(async (response: { status: number; text: () => string | PromiseLike<string | undefined> | undefined; json: () => string; }) => {
    if (response.status >= 400) {
      throw new Error(await response.text());
    } else {
      return response.json();
    }
  });
}
