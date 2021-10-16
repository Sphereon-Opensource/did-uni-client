import {
  DIDResolutionOptions,
  DIDResolutionResult,
  DIDDocument as DIFDIDDocument,
  VerificationMethod as DIFVerificationMethod,
  ParsedDID,
  Resolver,
} from 'did-resolver';

export type Extensible = Record<string, unknown>;

export type RegistrarMetadata = Extensible;
export type MethodMetadata = Extensible;
export type Options = Extensible;
export type Secret = string | Extensible;

export interface Config {
  createURL: string;
  updateURL: string;
  deactivateURL: string;

  /** Resolver URL's*/
  resolveURL: string;
}

export interface VerificationMethod extends DIFVerificationMethod {
  publicKeyPem?: string;
  publicKeyMultibase?: string;
}

/**
 * Extending because of additions to the verification method
 */
export interface DIDDocument extends DIFDIDDocument {
  verificationMethod?: VerificationMethod[];
  authentication?: (string | VerificationMethod)[];
  assertionMethod?: (string | VerificationMethod)[];
  keyAgreement?: (string | VerificationMethod)[];
  capabilityInvocation?: (string | VerificationMethod)[];
  capabilityDelegation?: (string | VerificationMethod)[];
}

export interface DIDRegistrationResult {
  jobId?: string;
  didState: IDIDState;
  registrarMetadata?: RegistrarMetadata;
  methodMetadata?: MethodMetadata;
}

export interface IDIDState extends Extensible {
  state: string;
  identifier?: string;
  secret?: string | unknown;
  didDocument?: DIDDocument;
}

export interface IDIDRegistrationRequest {
  jobId?: string;
  didDocument?: DIDDocument;
  options?: Options;
  secret?: Secret;
}

export type DifResolver = {
  [method: string]: (did: string, _parsed: ParsedDID, _didResolver: Resolver, _options: DIDResolutionOptions) => Promise<DIDResolutionResult>;
};
