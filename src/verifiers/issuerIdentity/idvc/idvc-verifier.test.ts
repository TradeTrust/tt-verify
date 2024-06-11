import { verify, getRevokeStatus } from "./idvc-verifier";
import notRevokedIDVC from "../../../../test/fixtures/v4/tt/idvc/idvc-not-revoked.json";
import revokedIDVC from "../../../../test/fixtures/v4/tt/idvc/idvc-revoked.json";
import tamperedIDVC from "../../../../test/fixtures/v4/tt/idvc/idvc-tampered.json";

describe("verify idvc", () => {
  describe("checking signature", () => {
    it("should return false when we are not able to verify with the signature", async () => {
      const verificationResult = await verify(tamperedIDVC);
      expect(verificationResult).toBeDefined();
      expect(verificationResult.verified).toEqual(false);
    });
    it("should return true when we are able to verify with the signature", async () => {
      const verificationResult = await verify(notRevokedIDVC);
      expect(verificationResult).toBeDefined();
      expect(verificationResult.verified).toEqual(true);
    });
  });

  describe("checking revocation status", () => {
    it("should return false when IDVC is not revoked", async () => {
      const verificationResult = await verify(notRevokedIDVC);
      expect(verificationResult).toBeDefined();
      expect(verificationResult.verified).toEqual(true);
      const revokedStatus = await getRevokeStatus(notRevokedIDVC);
      expect(revokedStatus).toBe(false);
    });
    it("should return true when IDVC is revoked", async () => {
      const verificationResult = await verify(revokedIDVC);
      expect(verificationResult).toBeDefined();
      expect(verificationResult.verified).toEqual(true);
      const revokedStatus = await getRevokeStatus(revokedIDVC);
      expect(revokedStatus).toBe(true);
    });
  });
});
