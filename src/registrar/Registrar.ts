'use strict';

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
   * Sets the create URL for the registrar.
   *
   * @param url The create URL for the registrar.
   */
  public setCreateURL(url: string): void {
    this.createUrl = url;
  }

  /**
   * Sets the update URL for the registrar.
   *
   * @param url The update URL for the registrar.
   */
  public setUpdateURL(url: string): void {
    this.updateUrl = url;
  }

  /**
   * Sets the deactivate URL for the registrar.
   *
   * @param url The deactivate URL for the registrar.
   */
  public setDeactivateURL(url: string): void {
    this.deactivateUrl = url;
  }

  //TODO update method
  /**
   * Creates a identity for a specific method.
   *
   * @param method The identifier (did).
   * @param identifier The identifier (did).
   * @param options Options matching the method needed for creating the identity.
   */
  public create(method: string, request: CrudRequest) {
    //TODO return type
    const url = new URL(this.createUrl);
    url.searchParams.append('method', method);

    return fetch(url, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    }).then((result) => result.json());
  }

  //TODO update method
  /**
   * Updates a identity for a specific method.
   *
   * @param method The identifier (did).
   * @param identifier The identifier (did).
   * @param options Options matching the method needed for updating the identity.
   */
  public update(method: string, identifier: string, request: CrudRequest) {
    //TODO return type
    const url = new URL(this.updateUrl);
    url.searchParams.append('method', method);
    return fetch(url, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier, ...request }),
    }).then((result) => result.json());
  }

  //TODO update method
  /**
   * Deactivates a identity for a specific method.
   *
   * @param method .
   * @param identifier The identifier (did).
   * @param options Options matching the method needed for deactivating the identity.
   */
  public deactivate(method: string, identifier: string, request: CrudRequest) {
    //TODO return type
    const url = new URL(this.deactivateUrl);
    url.searchParams.append('method', method);
    return fetch(url, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier, ...request }),
    }).then((result) => result.json());
  }
}
