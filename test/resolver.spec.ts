import { Resolver as DIFResolver } from 'did-resolver';
import nock from 'nock';

import { getUniResolvers } from '../src/resolver/UniResolver';
import { DefaultConfig } from '../src/types/constants';

const { getUniResolver, UniResolver } = require('../src/resolver/UniResolver');
const { Constants } = require('../src/types/constants');

const didDocument = {
  '@context': 'https://w3id.org/did/v1',
  id: 'did:btcr:xz35-jznz-q6mr-7q6',
  publicKey: [
    {
      id: 'did:btcr:xz35-jznz-q6mr-7q6#keys-1',
      type: 'RsaVerificationKey2018',
      owner: 'did:btcr:xz35-jznz-q6mr-7q6',
      publicKeyPem: '-----BEGIN PUBLIC KEY...END PUBLIC KEY-----\r\n',
    },
  ],
  service: [
    {
      id: 'did:btcr:xz35-jznz-q6mr-7q6#agent',
      type: 'AgentService',
      serviceEndpoint: 'https://agent.example.com/8377464',
    },
    {
      id: 'did:btcr:xz35-jznz-q6mr-7q6#messages',
      type: 'MessagingService',
      serviceEndpoint: 'https://example.com/messages/8377464',
    },
  ],
  authentication: [
    {
      type: 'RsaSignatureAuthentication2018',
      publicKey: 'did:btcr:xz35-jznz-q6mr-7q6#keys-1',
    },
  ],
};

describe('setting a url', () => {
  it('should use config / environment url when no url is provided', async () => {
    const resolver = new UniResolver();

    expect(resolver.getConfig().resolveURL).toEqual(DefaultConfig.resolveURL);
  });

  it('should use given resolve url when provided by setter', async () => {
    const otherResolver = 'https://other.resolver.io/1.0/identifiers';
    const resolver = new UniResolver();
    resolver.setResolveURL(otherResolver);

    expect(resolver.getConfig().resolveURL).toEqual(otherResolver);
  });

  it('should use given base url when provided by setter', async () => {
    const otherResolver = 'https://other.resolver.io/1.0/identifiers';
    const resolver = new UniResolver().setBaseURL('https://other.resolver.io');

    expect(resolver.getConfig().resolveURL).toEqual(otherResolver);
  });
});

describe('did resolving', () => {
  const did = 'did:btcr:xz35-jznz-q6mr-7q6';
  const otherDid = 'did:btcr:xz35-jznz-q6mr-7q7';
  nock(DefaultConfig.resolveURL).get(`/${did}`).reply(200, {
    didResolutionMetadata: {},
    didDocument,
    didDocumentMetadata: {},
  });

  nock(DefaultConfig.resolveURL).get(`/${otherDid}`).reply(500, 'Unable to resolve did');

  it('should resolve did to did document', async () => {
    const resolver = new UniResolver();
    const didResolutionResult = await resolver.resolve(did);

    expect(didResolutionResult.didDocument.id).toEqual(did);
  });

  it('should result in didResolutionMetadata with error when providing invalid did', async () => {
    const resolver = new UniResolver();
    const didResolutionResult = await resolver.resolve('abcdefg123456789');

    expect(didResolutionResult.didResolutionMetadata.error).toEqual(Constants.INVALID_DID);
  });

  it('should reject if not successful', async () => {
    const resolver = new UniResolver();

    await expect(resolver.resolve(otherDid)).rejects.toThrow();
  });
});
describe('did resolution as driver directly', () => {
  const did = 'did:btcr:xz35-jznz-q6mr-7q6';
  nock(DefaultConfig.resolveURL).get(`/${did}`).reply(200, {
    didResolutionMetadata: {},
    didDocument,
    didDocumentMetadata: {},
  });

  it('should resolve the did', async () => {
    const didResolutionResult = await getUniResolver('btcr', { resolveUrl: 'https://dev.uniresolver.io/1.0/identifiers' }).btcr(
      'did:btcr:xz35-jznz-q6mr-7q6'
    );
    expect(didResolutionResult.didDocument.id).toEqual(did);
  });

  it('should reject the call', async () => {
    const resolver = getUniResolver('btcr', { resolveUrl: 'https://other.resolver.io/1.0/identifiers' });
    await expect(resolver.btcr('did:btcr:xz35-jznz-q6mr-7q6')).rejects.toThrow();
  });
});
describe('did resolution as single driver in DIF resolver', () => {
  const did = 'did:btcr:xz35-jznz-q6mr-7q6';
  nock(DefaultConfig.resolveURL).get(`/${did}`).times(4).reply(200, {
    didResolutionMetadata: {},
    didDocument,
    didDocumentMetadata: {},
  });

  it('should resolve the did without options', async () => {
    const btcrResolver = getUniResolver('btcr');
    const resolver = new DIFResolver(btcrResolver);
    const didResolutionResult = await resolver.resolve('did:btcr:xz35-jznz-q6mr-7q6');
    expect(didResolutionResult.didDocument.id).toEqual(did);
  });

  it('should resolve the did with base url', async () => {
    const btcrResolver = getUniResolver('btcr', { baseUrl: 'https://dev.uniresolver.io' });
    const resolver = new DIFResolver(btcrResolver);
    const didResolutionResult = await resolver.resolve('did:btcr:xz35-jznz-q6mr-7q6');
    expect(didResolutionResult.didDocument.id).toEqual(did);
  });

  it('should not resolve the did because of wrong method', async () => {
    const ethrResolver = getUniResolver('ethr', { resolveUrl: 'https://dev.uniresolver.io/1.0/identifiers' });
    const resolver = new DIFResolver(ethrResolver);
    const didResolutionResult = await resolver.resolve('did:btcr:xz35-jznz-q6mr-7q6');
    await expect(didResolutionResult.didResolutionMetadata.error).toEqual('unsupportedDidMethod');
  });

  it('should not resolve the did because of no method', async () => {
    expect(() => getUniResolver(null, { resolveUrl: 'https://dev.uniresolver.io/1.0/identifiers' })).toThrowError();
  });
});
describe('did resolution for multiple methods as driver in DIF resolver', () => {
  const did = 'did:btcr:xz35-jznz-q6mr-7q6';
  nock(DefaultConfig.resolveURL).get(`/${did}`).times(1).reply(200, {
    didResolutionMetadata: {},
    didDocument,
    didDocumentMetadata: {},
  });

  it('should resolve the did without options', async () => {
    const resolvers = getUniResolvers(['btcr', 'ethr']);
    const resolver = new DIFResolver(...resolvers);
    const didResolutionResult = await resolver.resolve('did:btcr:xz35-jznz-q6mr-7q6');
    expect(didResolutionResult.didDocument.id).toEqual(did);
  });

  it('should not resolve the did because of a null method', async () => {
    expect(() => getUniResolvers(null)).toThrowError();
  });

  it('should not resolve the did because of no method', async () => {
    expect(() => getUniResolvers([])).toThrowError();
  });
});
