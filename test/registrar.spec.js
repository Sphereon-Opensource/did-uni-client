const nock = require('nock');

const config = require('../dist/config');
const {create, update, deactivate} = require('../dist/registrar/registrar');

describe('create identity', () => {
  const method = 'btcr';
  const options = {chain: 'TESTNET'};

  nock(`${config.registrarUrl}/1.0/create` )
    .post(`?method=${method}`, {options})
    .reply(200, {jobId: 'b4fcc246-f503-11eb-9a03-0242ac130003'});

  it('should return identity creation job', async () => {
    const job = await create(method, options);
    expect(job.jobId).toEqual;
  });
});

describe('update identity', () => {
  const method = 'btcr';
  const options = {identifier: 'did:btcr:xz35-jznz-q6mr-7q6'};

  nock(`${config.registrarUrl}/1.0/update` )
  .post(`?method=${method}`, {options})
  .reply(200, {jobId: 'b4fcc246-f503-11eb-9a03-0242ac130003'}); //TODO fix this

  it('should return identity creation job', async () => {
    const job = await update(method, options);
    expect(job.jobId).toEqual;
  });
});

describe('deactivate identity', () => {
  const method = 'btcr';
  const options = {identifier: 'did:btcr:xz35-jznz-q6mr-7q6'};

  nock(`${config.registrarUrl}/1.0/deactivate` )
  .post(`?method=${method}`, {options})
  .reply(200, {jobId: 'b4fcc246-f503-11eb-9a03-0242ac130003'}); //TODO fix this

  it('should return identity creation job', async () => {
    const job = await deactivate(method, options);
    expect(job.jobId).toEqual;
  });
});
