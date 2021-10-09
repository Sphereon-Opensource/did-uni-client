import { DIDDocument, DIDRegistrationRequestBuilder, DidUniConstants, UniRegistrar } from '../src';
import { DefaultConfig } from '../src/types/constants';

const { parse } = require('did-resolver');
const nock = require('nock');

const didDocument: DIDDocument = {
  '@context': 'https://w3id.org/did/v1',
  id: 'did:btcr:xz35-jznz-q6mr-7q6',
  verificationMethod: [
    {
      id: 'did:btcr:xz35-jznz-q6mr-7q6#keys-1',
      type: 'RsaVerificationKey2018',
      controller: 'did:btcr:xz35-jznz-q6mr-7q6',
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
  authentication: ['did:btcr:xz35-jznz-q6mr-7q6#keys-1'],
};

const did = 'did:btcr:xz35-jznz-q6mr-7q6';
const otherDid = 'did:btcr:xz35-jznz-q6mr-7q7';

const request = new DIDRegistrationRequestBuilder()
  .withJobId('6d85bcd0-2ea3-4288-ab00-15afadd8a156')
  .withDidDocument(didDocument)
  .withOptions({ chain: 'TESTNET' })
  .withSecret({ seed: '72WGp7NgFR1Oqdi8zlt7jQQ434XR0cNQ' })
  .build();

describe('setting a url', () => {
  it('should use config / environment url when no url is provided', async () => {
    const registrar = new UniRegistrar();

    expect(registrar.getConfig().createURL).toEqual(DefaultConfig.createURL);
  });

  it('should use given create url when provided by setter', async () => {
    const otherRegistrar = 'https://other.registrar.io/1.0/create';
    const registrar = new UniRegistrar();
    registrar.setCreateURL(otherRegistrar);

    expect(registrar.getConfig().createURL).toEqual(otherRegistrar);
  });

  it('should use given update url when provided by setter', async () => {
    const otherRegistrar = 'https://other.registrar.io/1.0/update';
    const registrar = new UniRegistrar();
    registrar.setUpdateURL(otherRegistrar);

    expect(registrar.getConfig().updateURL).toEqual(otherRegistrar);
  });

  it('should use given deactivate url when provided by setter', async () => {
    const otherRegistrar = 'https://other.registrar.io/1.0/deactivate';
    const registrar = new UniRegistrar();
    registrar.setDeactivateURL(otherRegistrar);

    expect(registrar.getConfig().deactivateURL).toEqual(otherRegistrar);
  });

  it('should use given base url when provided by setter', async () => {
    const otherRegistrar = 'https://other.registrar.io/1.0/create';
    const registrar = new UniRegistrar().setBaseURL('https://other.registrar.io');

    expect(registrar.getConfig().createURL).toEqual(otherRegistrar);
  });
});

describe('create identity', () => {
  const method = 'btcr';
  const otherMethod = 'otherMethod';

  nock(DefaultConfig.createURL)
    .post(`?method=${method}`, { ...request })
    .reply(200, { jobId: '6d85bcd0-2ea3-4288-ab00-15afadd8a156' });

  nock(DefaultConfig.createURL)
    .post(`?method=${otherMethod}`, { ...request })
    .reply(500, 'Unable to create');

  it('should return identity creation job', async () => {
    const registrar = new UniRegistrar();
    registrar.setBaseURL('https://uniregistrar.io');
    const job = await registrar.create(method, request);

    expect(job.jobId).toEqual(request.jobId);
  });

  it('should reject if not successful', async () => {
    const registrar = new UniRegistrar();

    await expect(registrar.create(otherMethod, request)).rejects.toThrow();
  });
});

describe('update identity', () => {
  nock(DefaultConfig.updateURL)
    .post(`?method=${parse(did).method}`, { identifier: did, ...request })
    .reply(200, { jobId: '6d85bcd0-2ea3-4288-ab00-15afadd8a156' });

  nock(DefaultConfig.updateURL)
    .post(`?method=${parse(did).method}`, { identifier: otherDid, ...request })
    .reply(500, 'Unable to update');

  it('should return identity update job', async () => {
    const registrar = new UniRegistrar();
    const job = await registrar.update(did, request);

    expect(job.jobId).toEqual(request.jobId);
  });

  it('should return didResolutionMetadata with invalidDid when providing invalid did', async () => {
    const registrar = new UniRegistrar();
    const job = await registrar.update('abcdefg123456789', request);

    expect(job.didState.state).toEqual(DidUniConstants.INVALID_DID);
  });

  it('should reject if not successful', async () => {
    const registrar = new UniRegistrar();

    await expect(registrar.update(otherDid, request)).rejects.toThrow();
  });
});

describe('deactivate identity', () => {
  nock(DefaultConfig.deactivateURL)
    .post(`?method=${parse(did).method}`, { identifier: did, ...request })
    .reply(200, { jobId: '6d85bcd0-2ea3-4288-ab00-15afadd8a156' });

  nock(DefaultConfig.deactivateURL)
    .post(`?method=${parse(did).method}`, { identifier: otherDid, ...request })
    .reply(500, 'Unable to update');

  it('should return identity deactivation job', async () => {
    const registrar = new UniRegistrar();
    const job = await registrar.deactivate(did, request);

    expect(job.jobId).toEqual(request.jobId);
  });

  it('should return didResolutionMetadata with invalidDid when providing invalid did', async () => {
    const registrar = new UniRegistrar();
    const job = await registrar.deactivate('abcdefg123456789', request);

    expect(job.didState.state).toEqual(DidUniConstants.INVALID_DID);
  });

  it('should reject if not successful', async () => {
    const registrar = new UniRegistrar();

    await expect(registrar.deactivate(otherDid, request)).rejects.toThrow();
  });
});
