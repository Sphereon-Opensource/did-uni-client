<h1 align="center">
  <br>
  <a href="https://www.sphereon.com"><img src="https://sphereon.com/content/themes/sphereon/assets/img/logo.svg" alt="Sphereon" width="400"></a>
  <br>
</h1>

[![CI](https://github.com/Sphereon-Opensource/did-uni-client/actions/workflows/main.yml/badge.svg)](https://github.com/Sphereon-Opensource/did-uni-client/actions/workflows/main.yml)

### Did-uni-client
The did-uni-client is a library to call a universal registrar (e.g. https://uniregistrar.io) to create, update and deactivate decentralized identifiers (DIDs). 
And to call a universal resolver (e.g. https://dev.uniresolver.io) to resolve decentralized identifiers to DID Documents. It is written in Typescript and can be compiled to any target JavaScript version.

### Supported actions
 * Creating a decentralized identifier (DID).
 * Updating a decentralized identifier (DID).
 * Deactivating a decentralized identifier (DID).
 * Resolving a decentralized identifier (DID).

#### Examples

##### DID creation
 ```typescript
const {Registrar, CrudRequestBuilder} = require('@sphereon/did-uni-client');

const method = 'btcr';
const request = new CrudRequestBuilder()
    .withOptions({chain: 'TESTNET'})
    .build();
const registrar = new Registrar();

registrar.create(method, request) 
  .then(result => 'success')
  .catch(error => 'failed');
 ```

##### DID update
 ```typescript
const {Registrar, CrudRequestBuilder} = require('@sphereon/did-uni-client');

const did = 'did:btcr:xz35-jznz-q6mr-7q6';
const request = new CrudRequestBuilder()
    .withOptions({chain: 'TESTNET'})
    .withSecret({token:"ey..."})
    .build();
const registrar = new Registrar();

registrar.update(did, request)
  .then(result => 'success')
  .catch(error => 'failed');
 ```

##### DID deactivation
 ```typescript
const {Registrar, CrudRequestBuilder} = require('@sphereon/did-uni-client');

const did = 'did:btcr:xz35-jznz-q6mr-7q6';
const request = new CrudRequestBuilder()
    .withOptions({chain: 'TESTNET'})
    .withSecret({token:"ey..."})
    .build();
const registrar = new Registrar();

registrar.deactivate(did, request)
  .then(result => 'success')
  .catch(error => 'failed');
 ```

##### DID resolution
 ```typescript
const {Resolver} = require('@sphereon/did-uni-client');

const did = 'did:btcr:xz35-jznz-q6mr-7q6';
const resolver = new Resolver();

resolver.resolve(did)
  .then(result => 'success')
  .catch(error => 'failed');
 ```

#### DID resolution, as a DIF did-resolver driver
You can also use this project as a did-resolver driver. This project is developed based on the guidelines of [Decentralized Identity](https://github.com/decentralized-identity/did-resolver/tree/master#implementing-a-did-method)
You can use it simply by calling `getResolver()`:
```typescript
const { getResolver, Resolver } = require('../src/resolver/Resolver');

const did = 'did:btcr:xz35-jznz-q6mr-7q6';

// Use an option to provide an alternatieve resolution URL
const didResolutionResult1 = await getResolver({ 'resolveUrl': 'https://dev.uniresolver.io/1.0/identifiers'})
  .resolve(did);

// Use the standard resolution URL
const didResolutionResult2 = await getResolver()
  .resolve(did);

//
// Use it together with other drivers:
//
ethrResolver = ethr.getResolver();
webResolver = web.getResolver();
uniResolver = getResolver();
//If you are using multiple methods you need to flatten them into one object
const resolver = new Resolver({
  ...ethrResolver,
  ...webResolver,
  ...uniResolver
})
const didResolutionResult3 = await resolver.resolve(did);

```
### Configuration
To use the library, URL's needs to be available for universal registrar endpoints and universal resolver endpoints. There are three options to configure the URL's.
The library will first check if there is an environment variable, if this is not present it will look in the config file. It is also possible to overwrite the default URL's by using one of the URL setters.

##### Environment variable
###### Registrar
REGISTRAR_URL_CREATE - Defines the URL for a create endpoint (e.g. https://uniregistrar.io/1.0/create).  
REGISTRAR_URL_UPDATE - Defines the URL for a update endpoint (e.g. https://uniregistrar.io/1.0/update).  
REGISTRAR_URL_DEACTIVATE - Defines the URL for a deactivate endpoint (e.g. https://uniregistrar.io/1.0/deactivate).  

###### Resolver
RESOLVER_URL_RESOLVE - Defines the URL for a resolve endpoint (e.g. https://dev.uniresolver.io/1.0/identifiers).  

##### Config file
A config file is available here 'src/config.ts'.

### Build
```shell
yarn build
```

### Test
The test command runs:
* `eslint`
* `prettier`
* `unit`
* `coverage`

You can also run only a single section of these tests, using for example `yarn test:unit`.
```shell
yarn test
```

### Utility scripts
There are several other utility scripts that help with development.

* `yarn fix` - runs `eslint --fix` as well as `prettier` to fix code style.
* `yarn cov` - generates code coverage report.
