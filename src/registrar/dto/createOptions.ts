'use strict';

import DidDocument from '@decentralized-identity/did-common-typescript/dist/lib/DidDocument';

export interface CreateOptions {
  jobId?: string;
  options?: Record<string, unknown>;
  secret?: Record<string, unknown>;
  didDocument?: DidDocument;
}
