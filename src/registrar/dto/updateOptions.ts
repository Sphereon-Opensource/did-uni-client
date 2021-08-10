'use strict';

import { IDidDocument } from '@decentralized-identity/did-common-typescript';

export interface UpdateOptions {
  jobId?: string;
  options?: Record<string, unknown>;
  secret?: Record<string, unknown>;
  didDocument?: IDidDocument;
}
