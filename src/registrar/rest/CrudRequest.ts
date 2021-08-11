'use strict';

import { DIDDocument } from 'did-resolver';

export class CrudRequest {
  public jobId: string;
  public didDocument: DIDDocument;
  public options: Record<string, unknown>;
  public secret: Record<string, unknown> | string;

  protected constructor(request: CrudRequest) {
    Object.assign(this, request);
  }
}
