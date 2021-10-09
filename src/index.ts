import { DIDResolutionResult } from 'did-resolver';

import { DIDRegistrationRequestBuilder } from './registrar/DIDRegistrationRequestBuilder';
import { UniRegistrar } from './registrar/UniRegistrar';
import { UniResolver } from './resolver/UniResolver';
import { Constants as DidUniConstants } from './types/constants';
import { Config } from './types/types';
import { DIDRegistrationResult } from './types/types';
import { DIDDocument, DifResolver, VerificationMethod } from './types/types';

export { DifResolver, DIDDocument, VerificationMethod };
export { DIDResolutionResult };
export { DIDRegistrationResult };

export { UniResolver };
export { UniRegistrar };
export { DIDRegistrationRequestBuilder };
export { Config };
export { DidUniConstants };
