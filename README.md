<h1 align="center">
  <br>
  <a href="https://www.sphereon.com"><img src="https://sphereon.com/content/themes/sphereon/assets/img/logo.svg" alt="Sphereon" width="400"></a>
  <br>Universal DID Registrar/Resolver client 
  <br>
</h1>

[![CI](https://github.com/Sphereon-Opensource/did-uni-client/actions/workflows/main.yml/badge.svg)](https://github.com/Sphereon-Opensource/did-uni-client/actions/workflows/main.yml)  [![codecov](https://codecov.io/gh/Sphereon-Opensource/did-uni-client/branch/develop/graph/badge.svg?token=7J4D2LRZK4)](https://codecov.io/gh/Sphereon-Opensource/did-uni-client) [![NPM Version](https://img.shields.io/npm/v/@sphereon/did-uni-client.svg)](https://npm.im/@sphereon/did-uni-client)

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
import { UniRegistrar, DIDRegistrationRequestBuilder } from '@sphereon/did-uni-client';

const method = 'btcr';
const request = new DIDRegistrationRequestBuilder()
    .withOptions({chain: 'TESTNET'})
    .build();
const registrar = new UniRegistrar();

registrar.create(method, request) 
  .then(result => 'success')
  .catch(error => 'failed');
 ```

##### DID update
 ```typescript
import { UniRegistrar, DIDRegistrationRequestBuilder } from '@sphereon/did-uni-client';

const did = 'did:btcr:xz35-jznz-q6mr-7q6';
const request = new DIDRegistrationRequestBuilder()
    .withOptions({chain: 'TESTNET'})
    .withSecret({token:"ey..."})
    .build();
const registrar = new UniRegistrar();

registrar.update(did, request)
  .then(result => 'success')
  .catch(error => 'failed');
 ```

##### DID deactivation

 ```typescript
import { UniRegistrar, DIDRegistrationRequestBuilder } from '@sphereon/did-uni-client';

const did = 'did:btcr:xz35-jznz-q6mr-7q6';
const request = new DIDRegistrationRequestBuilder()
.withOptions({chain: 'TESTNET'})
.withSecret({token: "ey..."})
.build();
const registrar = new UniRegistrar();

registrar.deactivate(did, request)
.then(result => 'success')
.catch(error => 'failed');
 ```

##### DID resolution
 ```typescript
import { UniResolver } from '@sphereon/did-uni-client';

const did = 'did:btcr:xz35-jznz-q6mr-7q6';
const resolver = new UniResolver();

resolver.resolve(did)
  .then(result => 'success')
  .catch(error => 'failed');
 ```

#### DID resolution, as a DIF did-resolver driver
You can also use this project as a did-resolver driver. This project is developed based on the guidelines of [Decentralized Identity](https://github.com/decentralized-identity/did-resolver/tree/master#implementing-a-did-method)
You can use it simply by calling `getUniResolver('didMethodName')` followed by the respective 'didMethodName' as a function. This has to do with the fact that you typically use the driver as part of another resolver object, and that resolver registers all DID methods by key (see Example 3). 
It is also possible to register multiple methods ad once for use as did-resolver, using the getUniResolvers method.

Examples:
```typescript
import { getUniResolver, UniResolver } from '@sphereon/did-uni-client';

const did = 'did:btcr:xz35-jznz-q6mr-7q6';

// Example 1: Use an option to provide an alternatieve resolution URL for bctr method
const didResolutionResult1 = await getUniResolver('bctr', { resolveUrl: 'https://dev.uniresolver.io/1.0/identifiers'})
  .bctr(did);

// Example 2: Use the standard resolution URL but for method factom
const didResolutionResult2 = await getUniResolver('factom')
  .factom(did);




//
// Example 3: Use it together with other drivers and register 2 method:
//

// 2 other drivers
ethrResolver = ethr.getResolver();
webResolver = web.getResolver();

// 2 times the uni-driver but for different DID-methods
uniResolvers = getUniResolvers(['btcr', 'eosio']);

//If you are using multiple methods using the did-resolver pacakge you need to flatten them into one object
const resolver = new Resolver({
  ...ethrResolver,
  ...webResolver,
  ...uniResolvers
})

// Actual resolution
const didResolutionResult3 = await resolver.resolve(did);

```
### Configuration
To use the library, URL's needs to be available for universal registrar endpoints and universal resolver endpoints. There are three options to configure the URL's.
The library will use a configuration object. If you do not provide one a default configuration object will be used that first checks if there are environment variables, if these are not present it will use default values. It is also possible to overwrite the default URL's by using one of the URL setters in the UniRegistrar and UniResolver.

##### Environment variable
###### Registrar
REGISTRAR_URL_CREATE - Defines the URL for a create endpoint (e.g. https://uniregistrar.io/1.0/create).  
REGISTRAR_URL_UPDATE - Defines the URL for a update endpoint (e.g. https://uniregistrar.io/1.0/update).  
REGISTRAR_URL_DEACTIVATE - Defines the URL for a deactivate endpoint (e.g. https://uniregistrar.io/1.0/deactivate).  

###### Resolver
RESOLVER_URL_RESOLVE - Defines the URL for a resolve endpoint (e.g. https://dev.uniresolver.io/1.0/identifiers).  


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
