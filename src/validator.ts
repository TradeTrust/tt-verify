import { VerificationFragment, VerificationFragmentType } from "./types/core";
import * as utils from "./common/utils";

export const isValid = (
  verificationFragments: VerificationFragment[],
  types: VerificationFragmentType[] = ["DOCUMENT_STATUS", "DOCUMENT_INTEGRITY", "ISSUER_IDENTITY"]
) => {
  if (verificationFragments.length < 1) {
    throw new Error("Please provide at least one verification fragment to check");
  }
  if (types.length < 1) {
    throw new Error("Please provide at least one type to check");
  }
  return types.every((type) => {
    const verificationFragmentsForType = verificationFragments.filter((fragment) => fragment.type === type);
    // return true if at least one fragment is valid
    // and all fragments are valid or skipped
    return (
      verificationFragmentsForType.some((fragment) => fragment.status === "VALID") &&
      verificationFragmentsForType.every((fragment) => fragment.status === "VALID" || fragment.status === "SKIPPED")
    );
  });
};

export const isRendered = (
  verificationFragments: VerificationFragment[],
  types: VerificationFragmentType[] = ["DOCUMENT_STATUS", "DOCUMENT_INTEGRITY", "ISSUER_IDENTITY"]
) => {
  if (verificationFragments.length < 1) {
    throw new Error("Please provide at least one verification fragment to check");
  }
  if (types.length < 1) {
    throw new Error("Please provide at least one type to check");
  }

  const hashValid = isValid(verificationFragments, ["DOCUMENT_INTEGRITY"]);
  const issuedValid = isValid(verificationFragments, ["DOCUMENT_STATUS"]);
  const identityValid = isValid(verificationFragments, ["ISSUER_IDENTITY"]);

  if (hashValid && issuedValid) {
    if (!identityValid) {
      const TradeTrustIDVCIdentityProofFragment = utils.getTradeTrustIDVCIdentityProofFragment(verificationFragments);
      if (
        TradeTrustIDVCIdentityProofFragment?.reason?.codeString === "REVOKED_IDVC" ||
        TradeTrustIDVCIdentityProofFragment?.reason?.codeString === "EXPIRED_IDVC"
      )
        // issuer identity is not valid, reason being revoked idvc or expired idvc
        return true;
      // issuer identity is not valid, reason being different from above
      return false;
    }
    // document integrity, document status, issuer identity are all valid
    return true;
  }
  // document integrity or document status not valid
  return false;
};

export const renderedErrorMessageForIDVC = (verificationFragments: VerificationFragment[]) => {
  const TradeTrustIDVCIdentityProofFragment = utils.getTradeTrustIDVCIdentityProofFragment(verificationFragments);
  return TradeTrustIDVCIdentityProofFragment?.reason?.message;
};
