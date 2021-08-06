'use strict';

import axios = require('axios');

import config = require('../config');

import { DeactivateOptions } from './dto/deactivateOptions';
import { RegisterOptions } from './dto/registerOptions';
import { UpdateOptions } from './dto/updateOptions';

const registrarUrl = process.env.REGISTRAR_URL || config.registrarUrl;

export function create(method: string, options: RegisterOptions) {
  const url = `${registrarUrl}/1.0/create`;
  return axios.default.post(url, options, { params: { method } }).then((result) => result.data);
}

export function update(method: string, options: UpdateOptions) {
  const url = `${registrarUrl}/1.0/update`;
  return axios.default.post(url, options, { params: { method } }).then((result) => result.data);
}

export function deactivate(method: string, options: DeactivateOptions) {
  const url = `${registrarUrl}/1.0/deactivate`;
  return axios.default.post(url, options, { params: { method } }).then((result) => result.data);
}
