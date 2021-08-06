'use strict';

import DidDocument from '@decentralized-identity/did-common-typescript/dist/lib/DidDocument';

export interface DeactivateOptions {
  jobId?: string;
  identifier: string;
  options?: Record<string, unknown>;
  secret?: Record<string, unknown>;
  didDocument?: DidDocument;
}
