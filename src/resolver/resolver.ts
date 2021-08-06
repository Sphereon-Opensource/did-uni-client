'use strict';

import axios = require('axios');

import config = require('../config');

const resolverUrl = process.env.RESOLVER_URL || config.resolverUrl;

export function resolve(identifier: string) {
  const url = `${resolverUrl}/1.0/identifiers/${identifier}`;
  return axios.default.get(url).then((result) => result.data);
}
