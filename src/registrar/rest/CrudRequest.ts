'use strict';

import { DIDDocument } from 'did-resolver';

import { ICrudRequest } from './ICrudRequest';

export class CrudRequest implements ICrudRequest {
  readonly jobId: string;
  readonly didDocument: DIDDocument;
  readonly options: Record<string, unknown>;
  readonly secret: Record<string, unknown> | string;

  protected constructor(request?: CrudRequest) {
    if (request) {
      Object.assign(this, request);
    }
  }
}
