'use strict';

import config = require('../config');

const fetch = require('cross-fetch');

const resolverUrl = process.env.RESOLVER_URL || config.resolverUrl;

//todo add constructor and set the url to the above.

export function resolve(identifier: string) {
  const url = new URL(`${resolverUrl}/1.0/identifiers/${identifier}`);
  return fetch(url).then((result) => {
    return result.json();
  });
}
