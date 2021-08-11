const {describe, expect, it} = require('@jest/globals');
const nock = require('nock');
const config = require('../src/config');
const {Resolver} = require('../src/resolver/Resolver');

const didDocument = {
  '@context': 'https://w3id.org/did/v1',
  id: 'did:btcr:xz35-jznz-q6mr-7q6',
  publicKey: [{
    id: 'did:btcr:xz35-jznz-q6mr-7q6#keys-1',
    type: 'RsaVerificationKey2018',
    owner: 'did:btcr:xz35-jznz-q6mr-7q6',
    publicKeyPem: '-----BEGIN PUBLIC KEY...END PUBLIC KEY-----\r\n'
  }],
  service: [{
    id: 'did:btcr:xz35-jznz-q6mr-7q6#agent',
    type: 'AgentService',
    serviceEndpoint: 'https://agent.example.com/8377464'
  }, {
    id: 'did:btcr:xz35-jznz-q6mr-7q6#messages',
    type: 'MessagingService',
    serviceEndpoint: 'https://example.com/messages/8377464'
  }],
  authentication: [{
    type: 'RsaSignatureAuthentication2018',
    publicKey: 'did:btcr:xz35-jznz-q6mr-7q6#keys-1'
  }],
};

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

describe('did resolving', () => {
  const did = 'did:btcr:xz35-jznz-q6mr-7q6';

  nock(config.resolverUrlResolve)
    .get(`/${did}`)
    .reply(200, {
        didResolutionMetadata: {},
        didDocument,
        didDocumentMetadata: {}}
      );

  it('should resolve did to did document', async () => {
    const resolver = new Resolver();
    const didResolutionResult = await resolver.resolve(did);
    expect(didResolutionResult.didDocument.id).toEqual(did);
  });

  it('should result in didResolutionMetadata with error when providing invalid did', async () => {
    const resolver = new Resolver();
    const didResolutionResult = await resolver.resolve('abcdefg123456789');
    expect(didResolutionResult.didResolutionMetadata.error).toEqual('invalidDid');
  });
});
