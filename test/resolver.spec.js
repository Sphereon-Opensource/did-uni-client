const {Resolver} = require('../src/resolver/Resolver');

const nock = require('nock');

const config = require('../src/config');

describe('setting a url', () => {
  it('should use config / environment url when no url is provided', async () => {
    const resolver = new Resolver();
    expect(resolver.resolveUrl).toEqual(config.resolverUrlResolve);
  });

  it('should use given resolve url when provided by setter', async () => {
    const otherResolver = 'https://other.resolver.io/1.0/identifiers';
    const resolver = new Resolver();
    resolver.setResolveUrl(otherResolver);
    expect(resolver.resolveUrl).toEqual(otherResolver);
  });
});

describe('identifier resolving', () => {
  const identifier = 'did:btcr:xz35-jznz-q6mr-7q6';

  nock(config.resolverUrlResolve)
    .get(`/${identifier}`)
    .reply(200, {id: identifier});

  it('should resolve identifier to did document', async () => {
    const resolver = new Resolver();
    const didDocument = await resolver.resolve(identifier);
    expect(didDocument.id).toEqual(identifier);
  });
});
