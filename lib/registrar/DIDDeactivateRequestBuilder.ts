'use strict';

import { IDIDDeactivateRequest } from '../types/types';

import { DIDDeactivateRequest } from './DIDDeactivateRequest';

export class DIDDeactivateRequestBuilder extends DIDDeactivateRequest implements Partial<IDIDDeactivateRequest> {
  withJobId(jobId: string): this & Pick<IDIDDeactivateRequest, 'jobId'> {
    return Object.assign(this, { jobId: jobId });
  }

  withDid(did: string): this & Pick<IDIDDeactivateRequest, 'did'> {
    return Object.assign(this, { did: did });
  }

  withOptions(options: Record<string, unknown>): this & Pick<IDIDDeactivateRequest, 'options'> {
    return Object.assign(this, { options: options });
  }

  withSecret(secret: Record<string, unknown> | string): this & Pick<IDIDDeactivateRequest, 'secret'> {
    return Object.assign(this, { secret: secret });
  }

  build() {
    if (!this.did) {
      throw new Error('Cannot build request: DID is required.');
    }
    return new DIDDeactivateRequest(this);
  }
}
