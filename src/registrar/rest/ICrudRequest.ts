'use strict';

import { IDidDocument } from '@decentralized-identity/did-common-typescript';

export interface ICrudRequest {
  jobId?: string;
  didDocument?: IDidDocument;
  options?: Record<string, unknown>;
  secret?: Record<string, unknown>;
}
