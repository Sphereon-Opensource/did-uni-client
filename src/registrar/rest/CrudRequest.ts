'use strict';

import { IDidDocument } from '@decentralized-identity/did-common-typescript';

export class CrudRequest {
  public jobId: string;
  public didDocument: IDidDocument;
  public options: Record<string, unknown>;
  public secret: Record<string, unknown>;

  constructor(request: CrudRequest) {
    Object.assign(this, request);
  }
}
