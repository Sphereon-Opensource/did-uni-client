'use strict';

import { CreateOptions } from './dto/createOptions';
import { DeactivateOptions } from './dto/deactivateOptions';
import { UpdateOptions } from './dto/updateOptions';

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
  setCreateURL(url: string) {
    this.createUrl = url;
  }

  /**
   * Sets the update URL for the registrar.
   *
   * @param url The update URL for the registrar.
   */
  setUpdateURL(url: string) {
    this.updateUrl = url;
  }

  /**
   * Sets the deactivate URL for the registrar.
   *
   * @param url The deactivate URL for the registrar.
   */
  setDeactivateURL(url: string) {
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
  create(method: string, options: CreateOptions) {
    const url = new URL(this.createUrl);
    url.searchParams.append('method', method);

    return fetch(url, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
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
  update(method: string, identifier: string, options: UpdateOptions) {
    const url = new URL(this.updateUrl);
    url.searchParams.append('method', method);
    return fetch(url, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...options, identifier }),
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
  deactivate(method: string, identifier: string, options: DeactivateOptions) {
    const url = new URL(this.deactivateUrl);
    url.searchParams.append('method', method);
    return fetch(url, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...options, identifier }),
    }).then((result) => result.json());
  }
}
