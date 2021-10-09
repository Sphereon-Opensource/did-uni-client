'use strict';

import { DIDDocument } from 'did-resolver';

import { IDIDRegistrationRequest } from '../types/types';

export class DIDRegistrationRequest implements IDIDRegistrationRequest {
  readonly jobId: string;
  readonly didDocument: DIDDocument;
  readonly options: Record<string, unknown>;
  readonly secret: Record<string, unknown> | string;

  protected constructor(request?: DIDRegistrationRequest) {
    if (request) {
      Object.assign(this, request);
    }
  }
}
