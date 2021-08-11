const {describe, expect, it} = require('@jest/globals');
const nock = require('nock');
const config = require('../src/config');
const {Registrar} = require('../src/registrar/Registrar');
const {CrudRequestBuilder} = require('../src/registrar/rest/CrudRequestBuilder');
const {Constants} = require('../src/registrar/Constants');
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

describe('setting a url', () => {
  it('should use config / environment url when no url is provided', async () => {
    const registrar = new Registrar();
    expect(registrar.createUrl).toEqual(config.registrarUrlCreate);
  });

  it('should use given create url when provided by setter', async () => {
    const otherRegistrar = 'https://other.registrar.io/1.0/create';
    const registrar = new Registrar();
    registrar.setCreateURL(otherRegistrar);
    expect(registrar.createUrl).toEqual(otherRegistrar);
  });

  it('should use given update url when provided by setter', async () => {
    const otherRegistrar = 'https://other.registrar.io/1.0/update';
    const registrar = new Registrar();
    registrar.setUpdateURL(otherRegistrar);
    expect(registrar.updateUrl).toEqual(otherRegistrar);
  });

  it('should use given deactivate url when provided by setter', async () => {
    const otherRegistrar = 'https://other.registrar.io/1.0/deactivate';
    const registrar = new Registrar();
    registrar.setDeactivateURL(otherRegistrar);
    expect(registrar.deactivateUrl).toEqual(otherRegistrar);
  });

  it('should use given base url when provided by setter', async () => {
    const otherRegistrar = 'https://other.registrar.io/1.0/create';
    const registrar = new Registrar().setBaseURL('https://other.registrar.io');
    expect(registrar.createUrl).toEqual(otherRegistrar);
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
    registrar.setBaseURL('https://uniregistrar.io');
    const job = await registrar.create(method, request);

    expect(job.jobId).toEqual(request.jobId);
  });
});

describe('update identity', () => {
  const request = new CrudRequestBuilder()
    .withJobId('6d85bcd0-2ea3-4288-ab00-15afadd8a156')
    .withDidDocument(didDocument)
    .withOptions({chain: 'TESTNET'})
    .withSecret({seed: '72WGp7NgFR1Oqdi8zlt7jQQ434XR0cNQ'})
    .build();

  nock(config.registrarUrlUpdate)
    .post(`?method=${parse(did).method}`, {identifier: did, ...request})
    .reply(200, {jobId: '6d85bcd0-2ea3-4288-ab00-15afadd8a156'});

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
});

describe('deactivate identity', () => {
  const request = new CrudRequestBuilder()
    .withJobId('6d85bcd0-2ea3-4288-ab00-15afadd8a156')
    .withDidDocument(didDocument)
    .withOptions({chain: 'TESTNET'})
    .withSecret({seed: '72WGp7NgFR1Oqdi8zlt7jQQ434XR0cNQ'})
    .build();

  nock(config.registrarUrlDeactivate)
    .post(`?method=${parse(did).method}`, {identifier: did, ...request})
    .reply(200, {jobId: '6d85bcd0-2ea3-4288-ab00-15afadd8a156'});

  it('should return identity deactivation job', async () => {
    const registrar = new Registrar();
    const job = await registrar.deactivate(did, request);

    expect(job.jobId).toEqual(request.jobId);
  });

  it('should return didResolutionMetadata with invalidDid when providing invalid did', async () => {
    const registrar = new Registrar();
    const job = await registrar.deactivate('abcdefg123456789', request);

    expect(job.didResolutionMetadata.error).toEqual('invalidDid');
  });
});
