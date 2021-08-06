const nock = require('nock');

const config = require('../dist/config');
const {create, update, deactivate} = require('../dist/registrar/registrar');

describe('create identity', () => {
  const method = 'btcr';
  const options = {
    jobId: "6d85bcd0-2ea3-4288-ab00-15afadd8a156",
    options: {chain: 'TESTNET'},
    secret: {seed: "72WGp7NgFR1Oqdi8zlt7jQQ434XR0cNQ"}
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
    secret: {token: "ey..."}
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

  };

  nock(`${config.registrarUrl}/1.0/deactivate`)
    .post(`?method=${method}`, options)
    .reply(200, {jobId: '6d85bcd0-2ea3-4288-ab00-15afadd8a156'});

  it('should return identity creation job', async () => {
    const job = await deactivate(method, options);
    expect(job.jobId).toEqual(options.jobId);
  });
});
