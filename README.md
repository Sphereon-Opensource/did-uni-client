<h1 align="center">
  <br>
  <a href="https://www.sphereon.com"><img src="https://sphereon.com/content/themes/sphereon/assets/img/logo.svg" alt="Sphereon" width="400"></a>
  <br>
</h1>

### Did-uni-client
The did-uni-client is a library to call a universal registrar (e.g. https://uniregistrar.sphereon.io) to create, update and deactivate decentralized identifiers. 
And to call a universal resolver (e.g https://uniresolver.sphereon.io) to resolve decentralized identifiers to did documents. It is written in Typescript and can be compiled to any target JavaScript version.

### Supported actions
 * Creating a decentralized identifier (DID)
 * Updating a decentralized identifier (DID)
 * Deactivating a decentralized identifier (DID)
 * Resolving a decentralized identifier (DID)

#### Examples

##### DID creation
 ```typescript
const {Registrar, CrudRequestBuilder} = require('did-uni-client');

const method = 'btcr';
const request = new CrudRequestBuilder()
    .withOptions({chain: 'TESTNET'})
    .build();
const registrar = new Registrar();

registrar.create(method, request) 
  .then(result => 'success')
  .catch(error => 'failed');
 ```

##### DID updating
 ```typescript
const {Registrar, CrudRequestBuilder} = require('did-uni-client');

const method = 'btcr';
const identifier = 'did:btcr:xz35-jznz-q6mr-7q6';
const request = new CrudRequestBuilder()
    .withOptions({chain: 'TESTNET'})
    .withSecret({token:"ey..."})
    .build();
const registrar = new Registrar();

registrar.update(method, identifier, request)
  .then(result => 'success')
  .catch(error => 'failed');
 ```

##### DID deactivating
 ```typescript
const {Registrar, CrudRequestBuilder} = require('did-uni-client');

const method = 'btcr';
const identifier = 'did:btcr:xz35-jznz-q6mr-7q6';
const request = new CrudRequestBuilder()
    .withOptions({chain: 'TESTNET'})
    .withSecret({token:"ey..."})
    .build();
const registrar = new Registrar();

registrar.deactivate(method, identifier, request)
  .then(result => 'success')
  .catch(error => 'failed');
 ```

##### DID resolution
 ```typescript
const {Resolver} = require('did-uni-client');

const identifier = 'did:btcr:xz35-jznz-q6mr-7q6';
const resolver = new Resolver();

resolver.resolve(identifier)
  .then(result => 'success')
  .catch(error => 'failed');
 ```

### Configuration
To use the library, URL's needs to be available for universal registrar endpoints and universal resolver endpoints. There are three options to configure the URL's.
The library will first check if there is an environment variable, if this is not present it will look in the config file. It is also possible to overwrite the default URL's by using one of the url setters.

##### Environment variable
###### Registrar
REGISTRAR_URL_CREATE - Defines the URL for a universal registrar create endpoint (e.g https://uniregistrar.io/1.0/create)  
REGISTRAR_URL_UPDATE - Defines the URL for a universal registrar update endpoint (https://uniregistrar.io/1.0/update)  
REGISTRAR_URL_DEACTIVATE - Defines the URL for a universal registrar deactivate endpoint (https://uniregistrar.io/1.0/deactivate)  

###### Resolver
RESOLVER_URL_RESOLVE - Defines the URL for a universal resolve resolve endpoint (https://dev.uniresolver.io/1.0/identifiers)  

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

* `yarn fix` - runs `eslint --fix` as well as `prettier` to fix code style
* `yarn cov` - generates code coverage report
