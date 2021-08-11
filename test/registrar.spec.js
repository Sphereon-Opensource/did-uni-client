const {describe, expect, it} = require('@jest/globals');
const nock = require('nock');
const config = require('../src/config');
const {Registrar} = require('../src/registrar/Registrar');
const {CrudRequestBuilder} = require('../src/registrar/rest/CrudRequestBuilder');

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
    const resolver = new Registrar();
    expect(resolver.createUrl).toEqual(config.registrarUrlCreate);
  });

  it('should use given create url when provided by setter', async () => {
    const otherResolver = 'https://other.registrar.io/1.0/create';
    const registrar = new Registrar();
    registrar.setCreateURL(otherResolver);
    expect(registrar.createUrl).toEqual(otherResolver);
  });

  it('should use given create url when provided by setter', async () => {
    const otherResolver = 'https://other.registrar.io/1.0/update';
    const registrar = new Registrar();
    registrar.setUpdateURL(otherResolver);
    expect(registrar.updateUrl).toEqual(otherResolver);
  });

  it('should use given deactivate url when provided by setter', async () => {
    const otherResolver = 'https://other.registrar.io/1.0/deactivate';
    const registrar = new Registrar();
    registrar.setDeactivateURL(otherResolver);
    expect(registrar.deactivateUrl).toEqual(otherResolver);
  });
});

describe('create identity', () => {
  const method = 'btcr';
  const request = new CrudRequestBuilder()
    .withJobId('6d85bcd0-2ea3-4288-ab00-15afadd8a156')
    .withDidDocument(didDocument)
    .withOptions({chain: 'TESTNET'})
    .withSecret({seed: '72WGp7NgFR1Oqdi8zlt7jQQ434XR0cNQ'})
    .build();

  nock(config.registrarUrlCreate)
    .post(`?method=${method}`, {...request})
    .reply(200, {jobId: '6d85bcd0-2ea3-4288-ab00-15afadd8a156'});

  it('should return identity creation job', async () => {
    const registrar = new Registrar();
    const job = await registrar.create(method, request);

    expect(job.jobId).toEqual(request.jobId);
  });
});

describe('update identity', () => {
  const method = 'btcr';
  const did = 'did:btcr:xz35-jznz-q6mr-7q6';
  const request = new CrudRequestBuilder()
    .withJobId('6d85bcd0-2ea3-4288-ab00-15afadd8a156')
    .withDidDocument(didDocument)
    .withOptions({chain: 'TESTNET'})
    .withSecret({seed: '72WGp7NgFR1Oqdi8zlt7jQQ434XR0cNQ'})
    .build();

  nock(config.registrarUrlUpdate)
    .post(`?method=${method}`, {did, ...request})
    .reply(200, {jobId: '6d85bcd0-2ea3-4288-ab00-15afadd8a156'});

  it('should return identity creation job', async () => {
    const registrar = new Registrar();
    const job = await registrar.update(method, did, request);

    expect(job.jobId).toEqual(request.jobId);
  });
});

describe('deactivate identity', () => {
  const method = 'btcr';
  const did = 'did:btcr:xz35-jznz-q6mr-7q6';
  const request = new CrudRequestBuilder()
    .withJobId('6d85bcd0-2ea3-4288-ab00-15afadd8a156')
    .withDidDocument(didDocument)
    .withOptions({chain: 'TESTNET'})
    .withSecret({seed: '72WGp7NgFR1Oqdi8zlt7jQQ434XR0cNQ'})
    .build();

  nock(config.registrarUrlDeactivate)
    .post(`?method=${method}`, {did, ...request})
    .reply(200, {jobId: '6d85bcd0-2ea3-4288-ab00-15afadd8a156'});

  it('should return identity creation job', async () => {
    const registrar = new Registrar();
    const job = await registrar.deactivate(method, did, request);

    expect(job.jobId).toEqual(request.jobId);
  });
});
