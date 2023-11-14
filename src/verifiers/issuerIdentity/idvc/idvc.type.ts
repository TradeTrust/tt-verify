import { Literal, Record, Static, String, Union, Boolean } from "runtypes";
import {
  ErrorVerificationFragment,
  InvalidVerificationFragment,
  SkippedVerificationFragment,
  ValidVerificationFragment,
} from "../../../types/core";
import { ValidDidVerificationStatus, DidVerificationStatus } from "../../../did/verifier";

/**
 * IDVC verification status
 */
export const ValidIDVCVerificationStatus = Record({
  status: Literal("VALID"),
  didVerificationResult: ValidDidVerificationStatus,
  idvcVerificationResult: Literal(true),
  idvcRevokedStatus: Literal(false),
  issuerId: String,
  idvcBoundId: String,
  key: String,
});
export type ValidIDVCVerificationStatus = Static<typeof ValidIDVCVerificationStatus>;

export const InvalidIDVCVerificationStatus = Record({
  status: String,
  didVerificationResult: DidVerificationStatus,
  idvcVerificationResult: Boolean,
  idvcRevokedStatus: Boolean,
  issuerId: String,
  idvcBoundId: String,
  key: String,
});
export type InvalidIDVCVerificationStatus = Static<typeof InvalidIDVCVerificationStatus>;

export const IDVCVerificationStatus = Union(ValidIDVCVerificationStatus, InvalidIDVCVerificationStatus);
export type IDVCVerificationStatus = Static<typeof IDVCVerificationStatus>;

/**
 * Fragments
 */
export type TradeTrustIDVCIdentityProofValidFragmentV4 = ValidVerificationFragment<ValidIDVCVerificationStatus>;
export type TradeTrustIDVCIdentityProofInvalidFragmentV4 = InvalidVerificationFragment<InvalidIDVCVerificationStatus>;
export type TradeTrustIDVCIdentityProofErrorFragment = ErrorVerificationFragment<any>;
export type TradeTrustIDVCIdentityProofVerificationFragment =
  | TradeTrustIDVCIdentityProofValidFragmentV4
  | TradeTrustIDVCIdentityProofInvalidFragmentV4
  | TradeTrustIDVCIdentityProofErrorFragment
  | SkippedVerificationFragment;
