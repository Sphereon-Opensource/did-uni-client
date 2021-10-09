'use strict';

import { DIDDocument } from 'did-resolver';

import { IDIDRegistrationRequest } from '../types/types';

import { DIDRegistrationRequest } from './DIDRegistrationRequest';

export class DIDRegistrationRequestBuilder extends DIDRegistrationRequest implements Partial<IDIDRegistrationRequest> {
  withJobId(jobId: string): this & Pick<IDIDRegistrationRequest, 'jobId'> {
    return Object.assign(this, { jobId: jobId });
  }

  withDidDocument(didDocument: DIDDocument): this & Pick<IDIDRegistrationRequest, 'didDocument'> {
    return Object.assign(this, { didDocument: didDocument });
  }

  withOptions(options: Record<string, unknown>): this & Pick<IDIDRegistrationRequest, 'options'> {
    return Object.assign(this, { options: options });
  }

  withSecret(secret: Record<string, unknown> | string): this & Pick<IDIDRegistrationRequest, 'secret'> {
    return Object.assign(this, { secret: secret });
  }

  build() {
    return new DIDRegistrationRequest(this);
  }
}
