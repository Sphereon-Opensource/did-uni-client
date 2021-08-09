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
  /** URL associated with the registrar */
  private url: string;

  constructor(url: string = process.env.REGISTRAR_URL || config.registrarUrl) {
    this.url = url;
  }

  /**
   * Sets the URL for the registrar.
   *
   * @param type The URL for the registrar.
   */
  setURL(url: string) {
    this.url = url;
  }

  create(method: string, options: CreateOptions) {
    const url = new URL(`${this.url}/1.0/create`);
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

  update(method: string, options: UpdateOptions) {
    const url = new URL(`${this.url}/1.0/update`);
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

  deactivate(method: string, options: DeactivateOptions) {
    const url = new URL(`${this.url}/1.0/deactivate`);
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
}
