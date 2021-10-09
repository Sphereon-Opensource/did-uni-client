'use strict';

import { DIDDocument } from 'did-resolver';

import { IDIDRegistrationRequest } from '../types/types';

import { DIDRegistrationRequest } from './DIDRegistrationRequest';

export class DIDRegistrationRequestBuilder extends DIDRegistrationRequest implements Partial<IDIDRegistrationRequest> {
  withJobId(value: string): this & Pick<IDIDRegistrationRequest, 'jobId'> {
    return Object.assign(this, { jobId: value });
  }

  withDidDocument(value: DIDDocument): this & Pick<IDIDRegistrationRequest, 'didDocument'> {
    return Object.assign(this, { didDocument: value });
  }

  withOptions(value: Record<string, unknown>): this & Pick<IDIDRegistrationRequest, 'options'> {
    return Object.assign(this, { options: value });
  }

  withSecret(value: Record<string, unknown> | string): this & Pick<IDIDRegistrationRequest, 'secret'> {
    return Object.assign(this, { secret: value });
  }

  build() {
    return new DIDRegistrationRequest(this);
  }
}
