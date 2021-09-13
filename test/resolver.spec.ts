import {Resolver as DIFResolver} from 'did-resolver';

const nock = require('nock');

const { Constants } = require('../src/Constants');
const config = require('../src/config');
const { getResolver, Resolver } = require('../src/resolver/Resolver');

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
  }]
};

describe('setting a url', () => {
  it('should use config / environment url when no url is provided', async () => {
    const resolver = new Resolver();

    expect(resolver.getResolveURL()).toEqual(config.resolverUrlResolve);
  });

  it('should use given resolve url when provided by setter', async () => {
    const otherResolver = 'https://other.resolver.io/1.0/identifiers';
    const resolver = new Resolver();
    resolver.setResolveURL(otherResolver);

    expect(resolver.getResolveURL()).toEqual(otherResolver);
  });

  it('should use given base url when provided by setter', async () => {
    const otherResolver = 'https://other.resolver.io/1.0/identifiers';
    const resolver = new Resolver().setBaseURL('https://other.resolver.io');

    expect(resolver.getResolveURL()).toEqual(otherResolver);
  });


});

describe('did resolving', () => {
  const did = 'did:btcr:xz35-jznz-q6mr-7q6';
  const otherDid = 'did:btcr:xz35-jznz-q6mr-7q7';
  nock(config.resolverUrlResolve)
    .get(`/${did}`)
    .reply(200, {
      didResolutionMetadata: {},
      didDocument,
      didDocumentMetadata: {}
    }
    );

  nock(config.resolverUrlResolve)
    .get(`/${otherDid}`)
    .reply(500, 'Unable to resolve did');

  it('should resolve did to did document', async () => {
    const resolver = new Resolver();
    const didResolutionResult = await resolver.resolve(did);

    expect(didResolutionResult.didDocument.id).toEqual(did);
  });

  it('should result in didResolutionMetadata with error when providing invalid did', async () => {
    const resolver = new Resolver();
    const didResolutionResult = await resolver.resolve('abcdefg123456789');

    expect(didResolutionResult.didResolutionMetadata.error).toEqual(Constants.INVALID_DID);
  });

  it('should reject if not successful', async () => {
    const resolver = new Resolver();

    await expect(resolver.resolve(otherDid)).rejects.toThrow();
  });
});
describe('did resolution as driver directly', () => {
  const did = 'did:btcr:xz35-jznz-q6mr-7q6';
  nock(config.resolverUrlResolve)
    .get(`/${did}`)
    .reply(200, {
      didResolutionMetadata: {},
      didDocument,
      didDocumentMetadata: {}
    }
    );

  it('should resolve the did', async () => {
    const didResolutionResult = await getResolver('btcr', { 'resolveUrl': 'https://dev.uniresolver.io/1.0/identifiers' })
      .btcr('did:btcr:xz35-jznz-q6mr-7q6');
    expect(didResolutionResult.didDocument.id).toEqual(did);
  });

  it('should reject the call', async () => {
    const resolver = getResolver('btcr', { 'resolveUrl': 'https://other.resolver.io/1.0/identifiers' })
      await expect(resolver.btcr('did:btcr:xz35-jznz-q6mr-7q6')).rejects.toThrow();
  });

});
describe('did resolution as driver in resolver', () => {
  const did = 'did:btcr:xz35-jznz-q6mr-7q6';
  nock(config.resolverUrlResolve)
  .get(`/${did}`)
  .thrice()
  .reply(200, {
        didResolutionMetadata: {},
        didDocument,
        didDocumentMetadata: {}
      }
  );

  it('should resolve the did', async () => {
    const btcrResolver = getResolver('btcr', { 'baseUrl': 'https://dev.uniresolver.io' });
    const resolver = new DIFResolver(btcrResolver);
    const didResolutionResult = await resolver.resolve('did:btcr:xz35-jznz-q6mr-7q6');
    expect(didResolutionResult.didDocument.id).toEqual(did);
  });

  it('should not resolve the did because of wrong method', async () => {
    const ethrResolver = getResolver('ethr', { 'resolveUrl': 'https://dev.uniresolver.io/1.0/identifiers' });
    const resolver = new DIFResolver(ethrResolver);
    const didResolutionResult = await resolver.resolve('did:btcr:xz35-jznz-q6mr-7q6');
    await expect(didResolutionResult.didResolutionMetadata.error).toEqual("unsupportedDidMethod");
  });

  it('should not resolve the did because of no method', async () => {
    expect(() => getResolver(null, { 'resolveUrl': 'https://dev.uniresolver.io/1.0/identifiers' })).toThrowError();
  });

});
