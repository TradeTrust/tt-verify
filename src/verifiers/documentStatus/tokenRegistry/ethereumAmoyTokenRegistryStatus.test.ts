/// <reference types="jest" />
import { documentDidSigned } from "../../../../test/fixtures/v2/documentDidSigned";
import { documentAmoyValidWithToken } from "../../../../test/fixtures/v2/documentAmoyValidWithToken";
import { documentAmoyNotIssuedTokenRegistry } from "../../../../test/fixtures/v2/documentAmoyNotIssuedTokenRegistry";
import { documentMixedIssuance } from "../../../../test/fixtures/v2/documentMixedIssuance";
import { documentNotIssuedWithDocumentStore } from "../../../../test/fixtures/v2/documentNotIssuedWithDocumentStore";
import { openAttestationEthereumTokenRegistryStatus } from "./ethereumTokenRegistryStatus";
import { generateProvider } from "../../../common/utils";
import { verificationBuilder, openAttestationVerifiers } from "../../../index";

// Polygon Amoy public RPC — no auth required.
const AMOY_RPC_URL = process.env.AMOY_RPC || "https://rpc-amoy.polygon.technology/";

const options = {
  provider: generateProvider({ network: "amoy", providerType: "jsonrpc", url: AMOY_RPC_URL }),
};

// ─── Amoy-specific provider bootstrap ────────────────────────────────────────

describe("Polygon Amoy — network support", () => {
  describe("generateProvider with network: 'amoy'", () => {
    it("should create a provider without throwing", () => {
      expect(() => generateProvider({ network: "amoy", providerType: "jsonrpc", url: AMOY_RPC_URL })).not.toThrow();
    });
  });

  describe("verificationBuilder with network: 'amoy'", () => {
    it("should invoke the verifier and return fragments for an Amoy document", async () => {
      const verifier = verificationBuilder(openAttestationVerifiers, { provider: options.provider });
      const fragments = await verifier(documentAmoyValidWithToken);
      const hashFragment = fragments.find((f) => f.name === "OpenAttestationHash");
      expect(hashFragment?.status).toBe("VALID");
    });

    it("should return a DOCUMENT_STATUS fragment for the Amoy document", async () => {
      const verifier = verificationBuilder(openAttestationVerifiers, { provider: options.provider });
      const fragments = await verifier(documentAmoyValidWithToken);
      const statusFragment = fragments.find((f) => f.name === "OpenAttestationEthereumTokenRegistryStatus");
      expect(statusFragment).toBeDefined();
    });
  });
});

// ─── test() ──────────────────────────────────────────────────────────────────

describe("test", () => {
  describe("v2", () => {
    it("should return true for documents using token registry", () => {
      const shouldVerify = openAttestationEthereumTokenRegistryStatus.test(documentAmoyValidWithToken, options);
      expect(shouldVerify).toBe(true);
    });

    it("should return false when document does not have data", () => {
      const documentWithoutData: any = { ...documentAmoyValidWithToken, data: null };
      const shouldVerify = openAttestationEthereumTokenRegistryStatus.test(documentWithoutData, options);
      expect(shouldVerify).toBe(false);
    });

    it("should return false when document does not have issuers", () => {
      const documentWithoutIssuer: any = {
        ...documentAmoyValidWithToken,
        data: { ...documentAmoyValidWithToken.data, issuers: null },
      };
      const shouldVerify = openAttestationEthereumTokenRegistryStatus.test(documentWithoutIssuer, options);
      expect(shouldVerify).toBe(false);
    });

    it("should return false when document uses document store", () => {
      const shouldVerify = openAttestationEthereumTokenRegistryStatus.test(documentNotIssuedWithDocumentStore, options);
      expect(shouldVerify).toBe(false);
    });

    it("should return false when document uses did signing", () => {
      const shouldVerify = openAttestationEthereumTokenRegistryStatus.test(documentDidSigned, options);
      expect(shouldVerify).toBe(false);
    });
  });
});

// ─── verify() ────────────────────────────────────────────────────────────────

describe("verify", () => {
  describe("v2", () => {
    it("should return an invalid fragment when token registry is invalid", async () => {
      const documentWithInvalidTokenRegistry: any = {
        ...documentAmoyNotIssuedTokenRegistry,
        data: {
          ...documentAmoyNotIssuedTokenRegistry.data,
          issuers: [
            {
              ...documentAmoyNotIssuedTokenRegistry.data.issuers[0],
              tokenRegistry: "0fb5b63a-aaa5-4e6e-a6f4-391c0f6ba423:string:0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            },
          ],
        },
      };

      const fragment = await openAttestationEthereumTokenRegistryStatus.verify(
        documentWithInvalidTokenRegistry,
        options
      );
      expect(fragment).toMatchInlineSnapshot(`
        {
          "data": {
            "details": [
              {
                "address": "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                "minted": false,
                "reason": {
                  "code": 1,
                  "codeString": "DOCUMENT_NOT_MINTED",
                  "message": "Token registry is not found",
                },
              },
            ],
            "mintedOnAll": false,
          },
          "name": "OpenAttestationEthereumTokenRegistryStatus",
          "reason": {
            "code": 1,
            "codeString": "DOCUMENT_NOT_MINTED",
            "message": "Token registry is not found",
          },
          "status": "INVALID",
          "type": "DOCUMENT_STATUS",
        }
      `);
    });

    it("should return an invalid fragment when token registry does not exist", async () => {
      const documentWithMissingTokenRegistry: any = {
        ...documentAmoyNotIssuedTokenRegistry,
        data: {
          ...documentAmoyNotIssuedTokenRegistry.data,
          issuers: [
            {
              ...documentAmoyNotIssuedTokenRegistry.data.issuers[0],
              tokenRegistry: "0fb5b63a-aaa5-4e6e-a6f4-391c0f6ba423:string:0x0000000000000000000000000000000000000000",
            },
          ],
        },
      };

      const fragment = await openAttestationEthereumTokenRegistryStatus.verify(
        documentWithMissingTokenRegistry,
        options
      );
      expect(fragment).toMatchInlineSnapshot(`
        {
          "data": {
            "details": [
              {
                "address": "0x0000000000000000000000000000000000000000",
                "minted": false,
                "reason": {
                  "code": 1,
                  "codeString": "DOCUMENT_NOT_MINTED",
                  "message": "Token registry is not found",
                },
              },
            ],
            "mintedOnAll": false,
          },
          "name": "OpenAttestationEthereumTokenRegistryStatus",
          "reason": {
            "code": 1,
            "codeString": "DOCUMENT_NOT_MINTED",
            "message": "Token registry is not found",
          },
          "status": "INVALID",
          "type": "DOCUMENT_STATUS",
        }
      `);
    });

    it("should return an invalid fragment when document with token registry has not been minted", async () => {
      const fragment = await openAttestationEthereumTokenRegistryStatus.verify(
        documentAmoyNotIssuedTokenRegistry,
        options
      );
      expect(fragment).toMatchInlineSnapshot(`
        {
          "data": {
            "details": [
              {
                "address": "0xa5f9a7106a599E4caAFacE6872da097aa802Cc64",
                "minted": false,
                "reason": {
                  "code": 1,
                  "codeString": "DOCUMENT_NOT_MINTED",
                  "message": "Document has not been issued under token registry",
                },
              },
            ],
            "mintedOnAll": false,
          },
          "name": "OpenAttestationEthereumTokenRegistryStatus",
          "reason": {
            "code": 1,
            "codeString": "DOCUMENT_NOT_MINTED",
            "message": "Document has not been issued under token registry",
          },
          "status": "INVALID",
          "type": "DOCUMENT_STATUS",
        }
      `);
    });

    it("should return a valid fragment when document with token registry has been minted", async () => {
      const fragment = await openAttestationEthereumTokenRegistryStatus.verify(documentAmoyValidWithToken, options);
      expect(fragment).toMatchInlineSnapshot(`
        {
          "data": {
            "details": [
              {
                "address": "0xa5f9a7106a599E4caAFacE6872da097aa802Cc64",
                "minted": true,
              },
            ],
            "mintedOnAll": true,
          },
          "name": "OpenAttestationEthereumTokenRegistryStatus",
          "status": "VALID",
          "type": "DOCUMENT_STATUS",
        }
      `);
    });

    it("should return an error fragment when document has 2 issuers with token registry", async () => {
      const documentHasTwoIssuersWithTokenRegistry: any = {
        ...documentAmoyValidWithToken,
        data: {
          ...documentAmoyValidWithToken.data,
          issuers: [documentAmoyValidWithToken.data.issuers[0], documentAmoyValidWithToken.data.issuers[0]],
        },
      };

      const fragment = await openAttestationEthereumTokenRegistryStatus.verify(
        documentHasTwoIssuersWithTokenRegistry,
        options
      );
      expect(fragment).toMatchInlineSnapshot(`
        {
          "data": [Error: Only one issuer is allowed for tokens],
          "name": "OpenAttestationEthereumTokenRegistryStatus",
          "reason": {
            "code": 5,
            "codeString": "INVALID_ISSUERS",
            "message": "Only one issuer is allowed for tokens",
          },
          "status": "ERROR",
          "type": "DOCUMENT_STATUS",
        }
      `);
    });

    it("should return an error fragment when used with other issuance methods", async () => {
      const fragment = await openAttestationEthereumTokenRegistryStatus.verify(documentMixedIssuance, options);
      expect(fragment).toMatchInlineSnapshot(`
        {
          "data": [Error: Only one issuer is allowed for tokens],
          "name": "OpenAttestationEthereumTokenRegistryStatus",
          "reason": {
            "code": 5,
            "codeString": "INVALID_ISSUERS",
            "message": "Only one issuer is allowed for tokens",
          },
          "status": "ERROR",
          "type": "DOCUMENT_STATUS",
        }
      `);
    });
  });
});
