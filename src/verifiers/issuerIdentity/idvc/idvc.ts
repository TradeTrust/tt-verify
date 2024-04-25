import { utils, TTv4 } from "@tradetrust-tt/tradetrust";
import { VerificationFragmentType, Verifier, VerifierOptions } from "../../../types/core";
import { TradeTrustIDVCCode } from "../../../types/error";
import { withCodedErrorHandler } from "../../../common/errorHandler";
import { CodedError } from "../../../common/error";
import { TradeTrustIDVCIdentityProofVerificationFragment, ValidIDVCVerificationStatus } from "./idvc.type";
import { verifyCredential, getRevokeStatus } from "./idvc-verifier";
import { ValidDidVerificationStatus, verifySignature } from "../../../did/verifier";

const name = "TradeTrustIDVCIdentityProof";
const type: VerificationFragmentType = "ISSUER_IDENTITY";
type VerifierType = Verifier<TradeTrustIDVCIdentityProofVerificationFragment>;

const skip: VerifierType["skip"] = async () => {
  return {
    status: "SKIPPED",
    type,
    name,
    reason: {
      code: TradeTrustIDVCCode.SKIPPED,
      codeString: TradeTrustIDVCCode[TradeTrustIDVCCode.SKIPPED],
      message: `Document was not issued using IDVC method`,
    },
  };
};

const test: VerifierType["test"] = (document) => {
  if (utils.isWrappedTTV4Document(document)) {
    return document.issuer.identityProof.identityProofType === TTv4.IdentityProofType.Idvc;
  }
  return false;
};

/**
 * The verification of IDVC is just a vanilla w3c verifiable
 * credential verification.
 * Instead of relying on the NDI module, you can replace this
 * with the generic way of verifying a w3c vc.
 *  */
const verifyIDVC = async (idvc: TTv4.IdentityVCData): Promise<[boolean, boolean]> => {
  const revokedStatus = await getRevokeStatus(idvc);
  if (revokedStatus) {
    throw new CodedError(
      "The Identity VC in the document has been revoked",
      TradeTrustIDVCCode.REVOKED_IDVC,
      TradeTrustIDVCCode[TradeTrustIDVCCode.REVOKED_IDVC]
    );
  }
  const { verified: verificationResult } = await verifyCredential(idvc);
  if (!verificationResult) {
    throw new CodedError(
      "the idvc in the document is invalid",
      TradeTrustIDVCCode.INVALID_IDVC,
      TradeTrustIDVCCode[TradeTrustIDVCCode.INVALID_IDVC]
    );
  }
  return [revokedStatus, verificationResult];
};

/**
 * Verification of Document with IDVC identity proof is as
 * follows:
 * 1. verify that outer signature is valid
 * 2. verify that inner vanilla vc (IDVC) is valid, via
 *    generic w3c verifiable credentials verification
 *    algorithm. Refer to:
 *    https://www.w3.org/TR/vc-data-model-2.0/#validation
 * 3. verify that the binding between issuer.id of outer
 *    combined document is the same as the one attested by
 *    the IDVC (credentialSubject.id).
 *
 * For more information read up:
 * https://github.com/TradeTrust/ndi-tradex-poc/tree/master/docs
 */
const verifyV4 = async (
  document: TTv4.SignedWrappedDocument,
  options: VerifierOptions
): Promise<TradeTrustIDVCIdentityProofVerificationFragment> => {
  if (!utils.isSignedWrappedTTV4Document(document))
    throw new CodedError(
      "document is not signed",
      TradeTrustIDVCCode.UNSIGNED,
      TradeTrustIDVCCode[TradeTrustIDVCCode.UNSIGNED]
    );

  const merkleRoot = `0x${document.proof.merkleRoot}`;
  const { key, signature } = document.proof;
  const did = document.issuer.id;
  if (!did)
    throw new CodedError(
      "id is missing in issuer",
      TradeTrustIDVCCode.DID_MISSING,
      TradeTrustIDVCCode[TradeTrustIDVCCode.DID_MISSING]
    );
  if (!key) {
    throw new CodedError(
      "Key is not present",
      TradeTrustIDVCCode.MALFORMED_IDENTITY_PROOF,
      TradeTrustIDVCCode[TradeTrustIDVCCode.MALFORMED_IDENTITY_PROOF]
    );
  }

  // Here we are performing a check whether the signature in
  // the combined document is valid.
  const verifySignatureStatus = await verifySignature({
    key,
    merkleRoot,
    signature,
    did,
    resolver: options.resolver,
  });
  if (!ValidDidVerificationStatus.guard(verifySignatureStatus)) {
    throw new CodedError(
      verifySignatureStatus.reason.message,
      TradeTrustIDVCCode.TAMPERED,
      TradeTrustIDVCCode[TradeTrustIDVCCode.TAMPERED]
    );
  }

  if (!document.issuer.identityProof.identityVC) {
    throw new CodedError(
      "document does not have a identity vc",
      TradeTrustIDVCCode.MISSING_IDVC,
      TradeTrustIDVCCode[TradeTrustIDVCCode.MISSING_IDVC]
    );
  }
  const idvc = document.issuer.identityProof.identityVC.data;
  
  if (!idvc.credentialSubject.id) {
    throw new CodedError(
      "document does not have a bound issuer id in the idvc",
      TradeTrustIDVCCode.DID_MISSING,
      TradeTrustIDVCCode[TradeTrustIDVCCode.DID_MISSING]
    );
  }
  const doBindingsMatch = did === idvc.credentialSubject.id;
  if (!doBindingsMatch) {
    throw new CodedError(
      "bound issuer id and idvc credential subject id are different",
      TradeTrustIDVCCode.WRONG_BINDING,
      TradeTrustIDVCCode[TradeTrustIDVCCode.WRONG_BINDING]
    );
  }

  const [revokedStatus, verificationResult] = await verifyIDVC(idvc);
  if (!idvc.expirationDate || Date.parse(idvc.expirationDate) < new Date().getTime()) {
    throw new CodedError(
      "The Identity VC in the document has expired",
      TradeTrustIDVCCode.EXPIRED_IDVC,
      TradeTrustIDVCCode[TradeTrustIDVCCode.EXPIRED_IDVC]
    );
  }


  const verificationStatus = {
    status:
      verificationResult && verifySignatureStatus.verified && doBindingsMatch && !revokedStatus ? "VALID" : "INVALID",
    didVerificationResult: verifySignatureStatus,
    idvcVerificationResult: verificationResult,
    idvcRevokedStatus: revokedStatus,
    idvcBoundId: idvc.credentialSubject.id,
    issuerId: did,
    key,
  };

  if (ValidIDVCVerificationStatus.guard(verificationStatus)) {
    return {
      name,
      type,
      data: verificationStatus,
      status: "VALID",
    };
  }

  // This might not be reachable since we mostly abort if we
  // encounter any errors previously.
  return {
    name,
    type,
    data: verificationStatus,
    status: "INVALID",
    reason: {
      message: "Verification failed, look at data to diagnose.",
      code: TradeTrustIDVCCode.INVALID_IDENTITY,
      codeString: "INVALID_IDENTITY",
    },
  };
};

const verify: VerifierType["verify"] = async (document, options) => {
  if (utils.isSignedWrappedTTV4Document(document)) return verifyV4(document, options);
  throw new CodedError(
    "Document does not match tt v4 format. Consider using `utils.diagnose` from open-attestation to find out more.",
    TradeTrustIDVCCode.UNRECOGNIZED_DOCUMENT,
    TradeTrustIDVCCode[TradeTrustIDVCCode.UNRECOGNIZED_DOCUMENT]
  );
};

export const tradeTrustIDVCIdentityProof: VerifierType = {
  skip,
  test,
  verify: withCodedErrorHandler(verify, {
    name,
    type,
    unexpectedErrorCode: TradeTrustIDVCCode.UNEXPECTED_ERROR,
    unexpectedErrorString: TradeTrustIDVCCode[TradeTrustIDVCCode.UNEXPECTED_ERROR],
  }),
};
