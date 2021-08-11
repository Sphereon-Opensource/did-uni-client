'use strict';

import { IDidDocument } from '@decentralized-identity/did-common-typescript';

import { CrudRequest } from './CrudRequest';
import { ICrudRequest } from './ICrudRequest';

export class CrudRequestBuilder implements Partial<ICrudRequest> {
  jobId?: string;
  didDocument?: IDidDocument;
  options?: Record<string, unknown>;
  secret?: Record<string, unknown>;

  withJobId(value: string): this & Pick<ICrudRequest, 'jobId'> {
    return Object.assign(this, { jobId: value });
  }

  withDidDocument(value: IDidDocument): this & Pick<ICrudRequest, 'didDocument'> {
    return Object.assign(this, { didDocument: value });
  }

  withOptions(value: Record<string, unknown>): this & Pick<ICrudRequest, 'options'> {
    return Object.assign(this, { options: value });
  }

  withSecret(value: Record<string, unknown>): this & Pick<ICrudRequest, 'secret'> {
    return Object.assign(this, { secret: value });
  }

  build(this: CrudRequest) {
    return new CrudRequest(this);
  }
}
