import { TTv4, OAv4 } from "@tradetrust/open-attestation";
import sampleTTWrappedSignedIDVC from "../../../../test/fixtures/v4/tt/did-idvc-wrapped-signed.json";
import sampleTTWrappedSignedTamperedIDVC from "../../../../test/fixtures/v4/tt/did-idvc-wrapped-signed-tampered-signature.json";
import sampleTTWrappedSignedRevokedIDVC from "../../../../test/fixtures/v4/tt/did-idvc-wrapped-signed-idvc-revoked.json";
import sampleTTWrappedSignedMissingIDVC from "../../../../test/fixtures/v4/tt/did-idvc-wrapped-signed-missing-idvc.json";
import sampleTTWrappedSignedWrongBindIDVC from "../../../../test/fixtures/v4/tt/did-idvc-wrapped-signed-wrong-binding.json";
import sampleTTWrappedSignedInvalidIDVC from "../../../../test/fixtures/v4/tt/did-idvc-wrapped-signed-idvc-invalid.json";
import sampleTTWrappedSigned from "../../../../test/fixtures/v4/tt/did-wrapped-signed.json";
import sampleOAWrappedSigned from "../../../../test/fixtures/v4/oa/did-signed-wrapped.json";

import { getProvider } from "../../../common/utils";
import { tradeTrustIDVCIdentityProof } from "./idvc";

const v4TTSignedWrappedIDVC = sampleTTWrappedSignedIDVC as TTv4.SignedWrappedDocument;
const v4TTSignedWrappedTamperedIDVC = sampleTTWrappedSignedTamperedIDVC as TTv4.SignedWrappedDocument;
const v4TTSignedWrappedRevokedIDVC = sampleTTWrappedSignedRevokedIDVC as TTv4.SignedWrappedDocument;
const v4TTSignedWrappedMissingIDVC = sampleTTWrappedSignedMissingIDVC as TTv4.SignedWrappedDocument;
const v4TTSignedWrappedInvalidIDVC = sampleTTWrappedSignedInvalidIDVC as TTv4.SignedWrappedDocument;
const v4TTSignedWrappedWrongBindIDVC = sampleTTWrappedSignedWrongBindIDVC as TTv4.SignedWrappedDocument;
const v4TTSignedWrapped = sampleTTWrappedSigned as TTv4.SignedWrappedDocument;
const v4OASignedWrapped = sampleOAWrappedSigned as OAv4.SignedWrappedDocument;

const options = {
  provider: getProvider({ network: "goerli" }),
};

describe("skip", () => {
  it("should return skip message", async () => {
    const message = await tradeTrustIDVCIdentityProof.skip(undefined as any, undefined as any);
    expect(message).toMatchInlineSnapshot(`
      Object {
        "name": "TradeTrustIDVCIdentityProof",
        "reason": Object {
          "code": 0,
          "codeString": "SKIPPED",
          "message": "Document was not issued using IDVC method",
        },
        "status": "SKIPPED",
        "type": "ISSUER_IDENTITY",
      }
    `);
  });
});

describe("test", () => {
  describe("v4", () => {
    it("should return true for tt v4 document with identity proof method IDVC", () => {
      expect(tradeTrustIDVCIdentityProof.test(v4TTSignedWrappedIDVC, options)).toBeTruthy();
    });
    it("should return false for tt v4 document without identity proof method IDVC", () => {
      expect(tradeTrustIDVCIdentityProof.test(v4TTSignedWrapped, options)).toBeFalsy();
    });
    it("should return false for oa v4 alpha document", () => {
      expect(tradeTrustIDVCIdentityProof.test(v4OASignedWrapped, options)).toBeFalsy();
    });
  });
});

describe("verify", () => {
  describe("v4", () => {
    it("should return valid fragment for document with identity proof method IDVC", async () => {
      const fragment = await tradeTrustIDVCIdentityProof.verify(v4TTSignedWrappedIDVC, options);
      expect(fragment).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "didVerificationResult": Object {
              "did": "did:ethr:0xE94E4f16ad40ADc90C29Dc85b42F1213E034947C",
              "verified": true,
            },
            "idvcBoundId": "did:ethr:0xE94E4f16ad40ADc90C29Dc85b42F1213E034947C",
            "idvcRevokedStatus": false,
            "idvcVerificationResult": true,
            "issuerId": "did:ethr:0xE94E4f16ad40ADc90C29Dc85b42F1213E034947C",
            "key": "did:ethr:0xE94E4f16ad40ADc90C29Dc85b42F1213E034947C#controller",
            "status": "VALID",
          },
          "name": "TradeTrustIDVCIdentityProof",
          "status": "VALID",
          "type": "ISSUER_IDENTITY",
        }
      `);
    });
    it("should return invalid fragment for document without identity proof method IDVC", async () => {
      const fragment = await tradeTrustIDVCIdentityProof.verify(v4TTSignedWrapped, options);
      expect(fragment).toMatchInlineSnapshot(`
        Object {
          "data": [Error: document does not have a identity vc],
          "name": "TradeTrustIDVCIdentityProof",
          "reason": Object {
            "code": 7,
            "codeString": "MISSING_IDVC",
            "message": "document does not have a identity vc",
          },
          "status": "ERROR",
          "type": "ISSUER_IDENTITY",
        }
      `);
    });
    it("should return invalid fragment for document with identity proof method IDVC, but tampered signature", async () => {
      const fragment = await tradeTrustIDVCIdentityProof.verify(v4TTSignedWrappedTamperedIDVC, options);
      expect(fragment).toMatchInlineSnapshot(`
        Object {
          "data": [Error: merkle root is not signed correctly by 0xE94E4f16ad40ADc90C29Dc85b42F1213E034947C],
          "name": "TradeTrustIDVCIdentityProof",
          "reason": Object {
            "code": 10,
            "codeString": "TAMPERED",
            "message": "merkle root is not signed correctly by 0xE94E4f16ad40ADc90C29Dc85b42F1213E034947C",
          },
          "status": "ERROR",
          "type": "ISSUER_IDENTITY",
        }
      `);
    });
    it("should return invalid fragment for document with identity proof method IDVC, when the IDVC is revoked", async () => {
      const fragment = await tradeTrustIDVCIdentityProof.verify(v4TTSignedWrappedRevokedIDVC, options);
      expect(fragment).toMatchInlineSnapshot(`
        Object {
          "data": [Error: the idvc in the document has been revoked],
          "name": "TradeTrustIDVCIdentityProof",
          "reason": Object {
            "code": 8,
            "codeString": "REVOKED_IDVC",
            "message": "the idvc in the document has been revoked",
          },
          "status": "ERROR",
          "type": "ISSUER_IDENTITY",
        }
      `);
    });
    it("should return invalid fragment for document with identity proof method IDVC, when the binding between 2 documents is different", async () => {
      const fragment = await tradeTrustIDVCIdentityProof.verify(v4TTSignedWrappedWrongBindIDVC, options);
      expect(fragment).toMatchInlineSnapshot(`
        Object {
          "data": [Error: bound issuer id and idvc credential subject id are different],
          "name": "TradeTrustIDVCIdentityProof",
          "reason": Object {
            "code": 11,
            "codeString": "WRONG_BINDING",
            "message": "bound issuer id and idvc credential subject id are different",
          },
          "status": "ERROR",
          "type": "ISSUER_IDENTITY",
        }
      `);
    });
    it("should return invalid fragment for document with identity proof method IDVC, when there is no idvc within the document, even though the identityProofType is IDVC", async () => {
      const fragment = await tradeTrustIDVCIdentityProof.verify(v4TTSignedWrappedMissingIDVC, options);
      expect(fragment).toMatchInlineSnapshot(`
        Object {
          "data": [Error: document does not have a identity vc],
          "name": "TradeTrustIDVCIdentityProof",
          "reason": Object {
            "code": 7,
            "codeString": "MISSING_IDVC",
            "message": "document does not have a identity vc",
          },
          "status": "ERROR",
          "type": "ISSUER_IDENTITY",
        }
      `);
    });
    it("should return invalid fragment for document with identity proof method IDVC, but the verification of the IDVC is invalid", async () => {
      const fragment = await tradeTrustIDVCIdentityProof.verify(v4TTSignedWrappedInvalidIDVC, options);
      expect(fragment).toMatchInlineSnapshot(`
        Object {
          "data": [Error: the idvc in the document is invalid],
          "name": "TradeTrustIDVCIdentityProof",
          "reason": Object {
            "code": 9,
            "codeString": "INVALID_IDVC",
            "message": "the idvc in the document is invalid",
          },
          "status": "ERROR",
          "type": "ISSUER_IDENTITY",
        }
      `);
    });
  });
});
