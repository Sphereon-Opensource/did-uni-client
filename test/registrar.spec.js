const {describe, expect, it} = require('@jest/globals');
const nock = require('nock');
const config = require('../src/config');
const {Registrar} = require('../src/registrar/Registrar');
const {CrudRequestBuilder} = require('../src/registrar/rest/CrudRequestBuilder');
const {Constants} = require('../src/Constants');
const {parse} = require('did-resolver');

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
const did = 'did:btcr:xz35-jznz-q6mr-7q6';
const otherDid = 'did:btcr:xz35-jznz-q6mr-7q7';

const request = new CrudRequestBuilder()
  .withJobId('6d85bcd0-2ea3-4288-ab00-15afadd8a156')
  .withDidDocument(didDocument)
  .withOptions({chain: 'TESTNET'})
  .withSecret({seed: '72WGp7NgFR1Oqdi8zlt7jQQ434XR0cNQ'})
  .build();

describe('setting a url', () => {
  it('should use config / environment url when no url is provided', async () => {
    const registrar = new Registrar();
    expect(registrar.getCreateURL()).toEqual(config.registrarUrlCreate);
  });

  it('should use given create url when provided by setter', async () => {
    const otherRegistrar = 'https://other.registrar.io/1.0/create';
    const registrar = new Registrar();
    registrar.setCreateURL(otherRegistrar);
    expect(registrar.getCreateURL()).toEqual(otherRegistrar);
  });

  it('should use given update url when provided by setter', async () => {
    const otherRegistrar = 'https://other.registrar.io/1.0/update';
    const registrar = new Registrar();
    registrar.setUpdateURL(otherRegistrar);
    expect(registrar.getUpdateURL()).toEqual(otherRegistrar);
  });

  it('should use given deactivate url when provided by setter', async () => {
    const otherRegistrar = 'https://other.registrar.io/1.0/deactivate';
    const registrar = new Registrar();
    registrar.setDeactivateURL(otherRegistrar);
    expect(registrar.getDeactivateURL()).toEqual(otherRegistrar);
  });

  it('should use given base url when provided by setter', async () => {
    const otherRegistrar = 'https://other.registrar.io/1.0/create';
    const registrar = new Registrar().setBaseURL('https://other.registrar.io');
    expect(registrar.getCreateURL()).toEqual(otherRegistrar);
  });
});

describe('create identity', () => {
  const method = 'btcr';
  const otherMethod = 'otherMethod';

  nock(config.registrarUrlCreate)
    .post(`?method=${method}`, {...request})
    .reply(200, {jobId: '6d85bcd0-2ea3-4288-ab00-15afadd8a156'});

  nock(config.registrarUrlCreate)
    .post(`?method=${otherMethod}`, {...request})
    .reply(500, 'Unable to create');

  it('should return identity creation job', async () => {
    const registrar = new Registrar();
    registrar.setBaseURL('https://uniregistrar.io');
    const job = await registrar.create(method, request);

    expect(job.jobId).toEqual(request.jobId);
  });

  it('should throw error if not successful', async () => {
    const registrar = new Registrar();
    await registrar.create(otherMethod, request)
      .catch(error => expect(error).toEqual('Unable to create'));
  });
});

describe('update identity', () => {
  nock(config.registrarUrlUpdate)
    .post(`?method=${parse(did).method}`, {identifier: did, ...request})
    .reply(200, {jobId: '6d85bcd0-2ea3-4288-ab00-15afadd8a156'});

  nock(config.registrarUrlUpdate)
    .post(`?method=${parse(did).method}`, {identifier: otherDid, ...request})
    .reply(500, 'Unable to update');

  it('should return identity update job', async () => {
    const registrar = new Registrar();
    const job = await registrar.update(did, request);

    expect(job.jobId).toEqual(request.jobId);
  });

  it('should return didResolutionMetadata with invalidDid when providing invalid did', async () => {
    const registrar = new Registrar();
    const job = await registrar.update('abcdefg123456789', request);

    expect(job.didResolutionMetadata.error).toEqual(Constants.INVALID_DID);
  });

  it('should throw error if not successful', async () => {
    const registrar = new Registrar();
    await registrar.update(otherDid, request)
      .catch(error => expect(error).toEqual('Unable to update'));
  });
});

describe('deactivate identity', () => {
  nock(config.registrarUrlDeactivate)
    .post(`?method=${parse(did).method}`, {identifier: did, ...request})
    .reply(200, {jobId: '6d85bcd0-2ea3-4288-ab00-15afadd8a156'});

  nock(config.registrarUrlDeactivate)
    .post(`?method=${parse(did).method}`, {identifier: otherDid, ...request})
    .reply(500, 'Unable to update');

  it('should return identity deactivation job', async () => {
    const registrar = new Registrar();
    const job = await registrar.deactivate(did, request);

    expect(job.jobId).toEqual(request.jobId);
  });

  it('should return didResolutionMetadata with invalidDid when providing invalid did', async () => {
    const registrar = new Registrar();
    const job = await registrar.deactivate('abcdefg123456789', request);

    expect(job.didResolutionMetadata.error).toEqual(Constants.INVALID_DID);
  });

  it('should throw error if not successful', async () => {
    const registrar = new Registrar();
    await registrar.deactivate(otherDid, request)
      .catch(error => expect(error).toEqual('Unable to update'));
  });
});
