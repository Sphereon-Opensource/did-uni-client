const nock = require('nock');

const config = require('../src/config');
const {create, update, deactivate} = require('../src/registrar/registrar');

const didDocument = {
  '@context': 'https://w3id.org/did/v1',
  id: 'dd4160e2-f6aa-11eb-9a03-0242ac130003',
  publicKey: [{
    id: "did:btcr:xz35-jznz-q6mr-7q6#keys-1",
    type: "RsaVerificationKey2018",
    owner: "did:btcr:xz35-jznz-q6mr-7q6",
    publicKeyPem: "-----BEGIN PUBLIC KEY...END PUBLIC KEY-----\r\n"
  }],
  service: [{
    id: "did:btcr:xz35-jznz-q6mr-7q6#agent",
    type: "AgentService",
    serviceEndpoint: "https://agent.example.com/8377464"
  }, {
    id: "did:btcr:xz35-jznz-q6mr-7q6#messages",
    type: "MessagingService",
    serviceEndpoint: "https://example.com/messages/8377464"
  }],
  authentication: [{
    type: "RsaSignatureAuthentication2018",
    publicKey: "did:btcr:xz35-jznz-q6mr-7q6#keys-1"
  }],
};

describe('create identity', () => {
  const method = 'btcr';
  const options = {
    jobId: "6d85bcd0-2ea3-4288-ab00-15afadd8a156",
    options: {chain: 'TESTNET'},
    secret: {seed: "72WGp7NgFR1Oqdi8zlt7jQQ434XR0cNQ"},
    didDocument
  };

  nock(`${config.registrarUrl}/1.0/create`)
    .post(`?method=${method}`, options)
    .reply(200, {jobId: '6d85bcd0-2ea3-4288-ab00-15afadd8a156'});

  it('should return identity creation job', async () => {
    const job = await create(method, options);
    expect(job.jobId).toEqual(options.jobId);
  });
});

describe('update identity', () => {
  const method = 'btcr';
  const options = {
    jobId: "6d85bcd0-2ea3-4288-ab00-15afadd8a156",
    identifier: "did:btcr:xz35-jznz-q6mr-7q6",
    options: {chain: "TESTNET"},
    secret: {token: "ey..."},
    didDocument
  };

  nock(`${config.registrarUrl}/1.0/update`)
    .post(`?method=${method}`, options)
    .reply(200, {jobId: '6d85bcd0-2ea3-4288-ab00-15afadd8a156'});

  it('should return identity creation job', async () => {
    const job = await update(method, options);
    expect(job.jobId).toEqual(options.jobId);
  });
});

describe('deactivate identity', () => {
  const method = 'btcr';
  const options = {
    jobId: "6d85bcd0-2ea3-4288-ab00-15afadd8a156",
    identifier: "did:btcr:xz35-jznz-q6mr-7q6",
    options: {chain: "TESTNET"},
    secret: {token: "ey..."},
    didDocument
  };

  nock(`${config.registrarUrl}/1.0/deactivate`)
    .post(`?method=${method}`, options)
    .reply(200, {jobId: '6d85bcd0-2ea3-4288-ab00-15afadd8a156'});

  it('should return identity creation job', async () => {
    const job = await deactivate(method, options);
    expect(job.jobId).toEqual(options.jobId);
  });
});
