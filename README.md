<h1 align="center">
  <br>
  <a href="https://www.sphereon.com"><img src="https://sphereon.com/content/themes/sphereon/assets/img/logo.svg" alt="Sphereon" width="400"></a>
  <br>
</h1>

### Did-uni-client
The did-uni-client library is a library to call the universal registrar (e.g. https://uniregistrar.sphereon.io) to create, update and deactivate decentralized identifiers. 
And to call the universal resolver (e.g https://uniresolver.sphereon.io) to resolve decentralized identifiers to did documents. It is written in Typescript and can be compiled to any target JavaScript version.

### Supported actions
 * Creating a decentralized identifier (DID)
 * Updating a decentralized identifier (DID)
 * Deactivating a decentralized identifier (DID)
 * Resolving a decentralized identifier (DID)

##### DID creation
 ```typescript
const {create} = require('did-uni-client');

const options = {
  chain: 'TESTNET',
};

create('btcr', options)
  .then(result => 'success')
  .catch(error => 'failed');
 ```

##### DID updating
 ```typescript
const {update} = require('did-uni-client');

const options = {
  identifier: "did:btcr:xz35-jznz-q6mr-7q6",
  options: {chain:"TESTNET"},
  secret:{token:"ey..."}
};

update('btcr', options)
  .then(result => 'success')
  .catch(error => 'failed');
 ```

##### DID deactivating
 ```typescript
const {deactivate} = require('did-uni-client');

const options = {
  identifier: "did:btcr:xz35-jznz-q6mr-7q6",
  options: {chain:"TESTNET"},
  secret:{token:"ey..."}
};

deactivate('btcr', options)
  .then(result => 'success')
  .catch(error => 'failed');
 ```

##### DID resolution
 ```typescript
const {resolve} = require('did-uni-client');

resolve('did:btcr:xz35-jznz-q6mr-7q6')
  .then(result => 'success')
  .catch(error => 'failed');
 ```

### Configuration
To use the library, a URL needs to be available for the universal registrar and universal resolver. There are two options to configure the URL's.
The library will first check if there is an environment variable, if this is not present it will look in the config file.

##### Environment variable
REGISTRAR_URL - Defines the URL for the universal registrar (e.g https://uniregistrar.sphereon.io)  
RESOLVER_URL - Defines the URL for the universal resolver (e.g https://uniresolver.sphereon.io)  

##### Config file
A config file is available here 'src/config.ts'.

registrarUrl - Defines the URL for the universal registrar (e.g https://uniregistrar.sphereon.io)  
resolverUrl - Defines the URL for the universal resolver (e.g https://uniresolver.sphereon.io)  

### Build
```shell
yarn build
```

### Test
The test command runs:
* `eslint`
* `prettier`
* `unit`

You can also run only a single section of these tests, using for example `yarn test:unit`.
```shell
yarn test
```

### Utility scripts
There are several other utility scripts that help with development.

* `yarn fix` - runs `eslint --fix` as well as `prettier` to fix code style
* `yarn cov` - generates code coverage report
