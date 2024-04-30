import { IDIDDeactivateRequest } from '../types/types';

export class DIDDeactivateRequest implements IDIDDeactivateRequest {
  did!: string;
  jobId?: string;
  readonly options?: Record<string, unknown>;
  readonly secret?: Record<string, unknown> | string;

  public constructor(request?: IDIDDeactivateRequest) {
    if (request) {
      this.jobId = request.jobId
      if (!request.did) {
        throw new Error('No DID parameter passed.')
      }
      this.did = request.did
      this.options = request.options
      this.secret = request.secret
    }
  }
}