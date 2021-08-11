const {describe, expect, it} = require('@jest/globals');
const nock = require('nock');
const config = require('../src/config');
const {Resolver} = require('../src/resolver/Resolver');

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
    .reply(200, {
        didResolutionMetadata: {},
        didDocument: {id: identifier},
        didDocumentMetadata: {}}
      );

  it('should resolve identifier to did document', async () => {
    const resolver = new Resolver();
    const didResolutionResult = await resolver.resolve(identifier);
    expect(didResolutionResult.didDocument.id).toEqual(identifier);
  });

  it('should result in didResolutionMetadata with error when providing invalid identifier', async () => {
    const resolver = new Resolver();
    const didResolutionResult = await resolver.resolve('abcdefg123456789');
    expect(didResolutionResult.didResolutionMetadata.error).toEqual('invalidDid');
  });
});
