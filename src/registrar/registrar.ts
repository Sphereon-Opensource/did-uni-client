'use strict';

import config = require('../config');

import { CreateOptions } from './dto/createOptions';
import { DeactivateOptions } from './dto/deactivateOptions';
import { UpdateOptions } from './dto/updateOptions';

const fetch = require('cross-fetch');

const registrarUrl = process.env.REGISTRAR_URL || config.registrarUrl;

export function create(method: string, options: CreateOptions) {
  const url = new URL(`${registrarUrl}/1.0/create?method=${method}`);
  return fetch(url, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options),
  }).then((result) => result.json());
}

export function update(method: string, options: UpdateOptions) {
  const url = new URL(`${registrarUrl}/1.0/update?method=${method}`);
  return fetch(url, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options),
  }).then((result) => result.json());
}

export function deactivate(method: string, options: DeactivateOptions) {
  const url = new URL(`${registrarUrl}/1.0/deactivate?method=${method}`);
  return fetch(url, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options),
  }).then((result) => result.json());
}
