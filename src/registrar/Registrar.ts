'use strict';

import { parse } from 'did-resolver';

import { Constants } from '../Constants';

import { CrudRequest } from './rest/CrudRequest';

const fetch = require('cross-fetch');

const config = require('../config');

/**
 * Class for performing various DID resolving operations.
 */
export class Registrar {
  /** Create URL associated with a registrar */
  private createUrl: string;
  /** Update URL associated with a registrar */
  private updateUrl: string;
  /** Deactivate URL associated with a registrar */
  private deactivateUrl: string;

  /** Registrar constructor */
  constructor() {
    this.createUrl = process.env.REGISTRAR_URL_CREATE || config.registrarUrlCreate;
    this.updateUrl = process.env.REGISTRAR_URL_UPDATE || config.registrarUrlUpdate;
    this.deactivateUrl = process.env.REGISTRAR_URL_DEACTIVATE || config.registrarUrlDeactivate;
  }

  /**
   * Sets the base URL for the registrar.
   *
   * @param url The base URL for the registrar.
   * @return this.
   */
  public setBaseURL(url: string): this {
    this.createUrl = `${url}${Constants.URL_PATHNAME_REGEX.exec(this.createUrl)[1]}`;
    this.updateUrl = `${url}${Constants.URL_PATHNAME_REGEX.exec(this.updateUrl)[1]}`;
    this.deactivateUrl = `${url}${Constants.URL_PATHNAME_REGEX.exec(this.deactivateUrl)[1]}`;

    return this;
  }

  /**
   * Sets the create URL for the registrar.
   *
   * @param url The create URL for the registrar.
   * @return this.
   */
  public setCreateURL(url: string): this {
    this.createUrl = url;

    return this;
  }

  /**
   * Gets the URL for the create endpoint.
   * @return string URL.
   */
  public getCreateURL(): string {
    return this.createUrl;
  }

  /**
   * Sets the update URL for the registrar.
   *
   * @param url The update URL for the registrar.
   * @return this.
   */
  public setUpdateURL(url: string): this {
    this.updateUrl = url;

    return this;
  }

  /**
   * Gets the URL for the update endpoint.
   * @return string URL.
   */
  public getUpdateURL(): string {
    return this.updateUrl;
  }

  /**
   * Sets the deactivate URL for the registrar.
   *
   * @param url The deactivate URL for the registrar.
   * @return this.
   */
  public setDeactivateURL(url: string): this {
    this.deactivateUrl = url;

    return this;
  }

  /**
   * Gets the URL for the deactivate endpoint.
   * @return string URL.
   */
  public getDeactivateURL(): string {
    return this.deactivateUrl;
  }

  /**
   * Creates a identity for a specific method.
   *
   * @param method The requested DID method for the operation.
   * @param request Request matching the method needed for creating the identity.
   * @return job result.
   */
  public create(method: string, request: CrudRequest) {
    const url = this.createURL(this.createUrl, method);

    return fetch(url, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    }).then(async (response) => {
      if (response.status >= 400) {
        throw await response.text();
      } else {
        return response.json();
      }
    });
  }

  /**
   * Updates a identity for a specific method.
   *
   * @param did The identifier (did).
   * @param request Request matching the method needed for updating the identity.
   * @return {didResolutionMetadata: {error: string}}, job result.
   */
  public update(did: string, request: CrudRequest) {
    const parsedDid = parse(did);
    if (parsedDid === null) {
      return {
        didResolutionMetadata: { error: Constants.INVALID_DID },
      };
    }

    const url = this.createURL(this.updateUrl, parsedDid.method);

    return fetch(url, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier: parsedDid.did, ...request }),
    })
    .then(async (response) => {
      if (response.status >= 400) {
        throw await response.text();
      } else {
        return response.json();
      }
    })
  }

  /**
   * Deactivates a identity for a specific method.
   *
   * @param did The identifier (did).
   * @param request Request matching the method needed for deactivating the identity.
   * @return {didResolutionMetadata: {error: string}}, job result.
   */
  public deactivate(did: string, request: CrudRequest) {
    const parsedDid = parse(did);
    if (parsedDid === null) {
      return {
        didResolutionMetadata: { error: Constants.INVALID_DID },
      };
    }

    const url = this.createURL(this.deactivateUrl, parsedDid.method);

    return fetch(url, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier: parsedDid.did, ...request }),
    }).then(async (response) => {
      if (response.status >= 400) {
        throw await response.text();
      } else {
        return response.json();
      }
    });
  }

  /**
   * Creates a URL with method query parameter.
   *
   * @param url The URL.
   * @param method The did method.
   * @return string URL with query parameter.
   */
  private createURL(url: string, method: string): string {
    return `${url}?method=${method}`;
  }
}
