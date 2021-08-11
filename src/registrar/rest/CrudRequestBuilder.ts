'use strict';

import { DIDDocument } from 'did-resolver';

import { CrudRequest } from './CrudRequest';
import { ICrudRequest } from './ICrudRequest';

export class CrudRequestBuilder implements Partial<ICrudRequest> {
  jobId?: string;
  didDocument?: DIDDocument;
  options?: Record<string, unknown>;
  secret?: Record<string, unknown> | string;

  withJobId(value: string): this & Pick<ICrudRequest, 'jobId'> {
    return Object.assign(this, { jobId: value });
  }

  withDidDocument(value: DIDDocument): this & Pick<ICrudRequest, 'didDocument'> {
    return Object.assign(this, { didDocument: value });
  }

  withOptions(value: Record<string, unknown>): this & Pick<ICrudRequest, 'options'> {
    return Object.assign(this, { options: value });
  }

  withSecret(value: Record<string, unknown> | string): this & Pick<ICrudRequest, 'secret'> {
    return Object.assign(this, { secret: value });
  }

  build(this: CrudRequest) {
    return new CrudRequest(this);
  }
}
