'use strict';

import { DIDDocument } from 'did-resolver';

export interface ICrudRequest {
  jobId?: string;
  didDocument?: DIDDocument;
  options?: Record<string, unknown>;
  secret?: Record<string, unknown> | string;
}
