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
   */
  public setBaseURL(url: string): this {
    this.createUrl = `${url}${new URL(this.createUrl).pathname}`;
    this.updateUrl = `${url}${new URL(this.updateUrl).pathname}`;
    this.deactivateUrl = `${url}${new URL(this.deactivateUrl).pathname}`;

    return this;
  }

  /**
   * Sets the create URL for the registrar.
   *
   * @param url The create URL for the registrar.
   */
  public setCreateURL(url: string): this {
    this.createUrl = url;

    return this;
  }

  /**
   * Gets the URL for the create endpoint.
   */
  public getCreateURL(): string {
    return this.createUrl;
  }

  /**
   * Sets the update URL for the registrar.
   *
   * @param url The update URL for the registrar.
   */
  public setUpdateURL(url: string): this {
    this.updateUrl = url;

    return this;
  }

  /**
   * Gets the URL for the update endpoint.
   */
  public getUpdateURL(): string {
    return this.updateUrl;
  }

  /**
   * Sets the deactivate URL for the registrar.
   *
   * @param url The deactivate URL for the registrar.
   */
  public setDeactivateURL(url: string): this {
    this.deactivateUrl = url;

    return this;
  }

  /**
   * Gets the URL for the deactivate endpoint.
   */
  public getDeactivateURL(): string {
    return this.deactivateUrl;
  }

  /**
   * Creates a identity for a specific method.
   *
   * @param method The requested DID method for the operation.
   * @param request Request matching the method needed for creating the identity.
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
    }).then((result) => result.json());
  }

  /**
   * Updates a identity for a specific method.
   *
   * @param did The identifier (did).
   * @param request Request matching the method needed for updating the identity.
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
    }).then((result) => result.json());
  }

  /**
   * Deactivates a identity for a specific method.
   *
   * @param did The identifier (did).
   * @param request Request matching the method needed for deactivating the identity.
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
    }).then((result) => result.json());
  }

  private createURL(url: string, method: string): URL {
    const newUrl = new URL(url);
    newUrl.searchParams.append('method', method);

    return newUrl;
  }
}
