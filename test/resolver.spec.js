const nock = require('nock');

const config = require('../dist/config');
const {resolve} = require('../dist/resolver/resolver');

describe('resolve identifier', () => {
  const identifier = 'did:btcr:xz35-jznz-q6mr-7q6';

  nock(config.resolverUrl)
  .get(`/1.0/identifiers/${identifier}`)
  .reply(200, {id: identifier});

  it('should match did document id with identifier', async () => {
    const didDDocument = await resolve(identifier);
    expect(didDDocument.id).toEqual(identifier);
  });
});
