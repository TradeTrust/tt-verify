/// <reference types="jest" />
import { documentDidSigned } from "../../../../test/fixtures/v2/documentDidSigned";
import { documentPolValidWithToken } from "../../../../test/fixtures/v2/documentPolValidWithToken";
import { documentPolNotIssuedTokenRegistry } from "../../../../test/fixtures/v2/documentPolNotIssuedTokenRegistry";
import { documentMixedIssuance } from "../../../../test/fixtures/v2/documentMixedIssuance";
import { documentNotIssuedWithDocumentStore } from "../../../../test/fixtures/v2/documentNotIssuedWithDocumentStore";
import { openAttestationEthereumTokenRegistryStatus } from "./ethereumTokenRegistryStatus";
import { generateProvider, getDefaultProvider } from "../../../common/utils";
import { verificationBuilder, openAttestationVerifiers, isValid } from "../../../index";

// Polygon mainnet public RPC — used only to exercise generateProvider() in bootstrap tests.
const POL_RPC_URL = process.env.POL_RPC || "https://rpc.ankr.com/polygon";

// getDefaultProvider normalises "pol" → "matic" and returns a StaticJsonRpcProvider backed by Infura,
// avoiding the eth_chainId auto-detection that JsonRpcProvider performs and which fails on public RPCs.
const options = {
  provider: getDefaultProvider({ network: "pol" }),
};

// ─── POL-specific provider bootstrap ─────────────────────────────────────────

describe("Polygon (POL) — network support", () => {
  describe("generateProvider with network: 'pol'", () => {
    it("should create a provider without throwing", () => {
      expect(() => generateProvider({ network: "pol", providerType: "jsonrpc", url: POL_RPC_URL })).not.toThrow();
    });

    it("should create an infura provider for 'pol' (normalised to matic internally)", () => {
      expect(() => getDefaultProvider({ network: "pol" })).not.toThrow();
    });
  });

  describe("verificationBuilder with network: 'pol'", () => {
    it("should invoke the verifier and return fragments (exercises provider init for pol)", async () => {
      const verifier = verificationBuilder(openAttestationVerifiers, { network: "pol" });
      const fragments = await verifier(documentPolValidWithToken);
      // Hash check is pure computation — valid regardless of RPC availability.
      const hashFragment = fragments.find((f) => f.name === "OpenAttestationHash");
      expect(hashFragment?.status).toBe("VALID");
    });

    it("should have valid DOCUMENT_INTEGRITY and return a DOCUMENT_STATUS fragment", async () => {
      const verifier = verificationBuilder(openAttestationVerifiers, { provider: options.provider });
      const fragments = await verifier(documentPolValidWithToken);
      expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toBe(true);
      const statusFragment = fragments.find((f) => f.name === "OpenAttestationEthereumTokenRegistryStatus");
      expect(statusFragment).toBeDefined();
    });
  });
});

// ─── test() ──────────────────────────────────────────────────────────────────

describe("test", () => {
  describe("v2", () => {
    it("should return true for documents using token registry", () => {
      const shouldVerify = openAttestationEthereumTokenRegistryStatus.test(documentPolValidWithToken, options);
      expect(shouldVerify).toBe(true);
    });

    it("should return false when document does not have data", () => {
      const documentWithoutData: any = { ...documentPolValidWithToken, data: null };
      const shouldVerify = openAttestationEthereumTokenRegistryStatus.test(documentWithoutData, options);
      expect(shouldVerify).toBe(false);
    });

    it("should return false when document does not have issuers", () => {
      const documentWithoutIssuer: any = {
        ...documentPolValidWithToken,
        data: { ...documentPolValidWithToken.data, issuers: null },
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
        ...documentPolNotIssuedTokenRegistry,
        data: {
          ...documentPolNotIssuedTokenRegistry.data,
          issuers: [
            {
              ...documentPolNotIssuedTokenRegistry.data.issuers[0],
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
        ...documentPolNotIssuedTokenRegistry,
        data: {
          ...documentPolNotIssuedTokenRegistry.data,
          issuers: [
            {
              ...documentPolNotIssuedTokenRegistry.data.issuers[0],
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
        documentPolNotIssuedTokenRegistry,
        options
      );
      expect(fragment).toMatchInlineSnapshot(`
        {
          "data": {
            "details": [
              {
                "address": "0x0961d9C2dA9a7105fDFC9DC4ec45951C024F88B0",
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

    // Enable after minting tokenId 0x5382d7c3c19d4b5730537a234b01b2084fdd71c3196dd0f5df00b23d9756d8d0 at 0x0961d9C2dA9a7105fDFC9DC4ec45951C024F88B0 on POL mainnet
    it("should return a valid fragment when document with token registry has been minted", async () => {
      const fragment = await openAttestationEthereumTokenRegistryStatus.verify(documentPolValidWithToken, options);
      expect(fragment).toMatchInlineSnapshot(`
        {
          "data": {
            "details": [
              {
                "address": "0x0961d9C2dA9a7105fDFC9DC4ec45951C024F88B0",
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
        ...documentPolValidWithToken,
        data: {
          ...documentPolValidWithToken.data,
          issuers: [documentPolValidWithToken.data.issuers[0], documentPolValidWithToken.data.issuers[0]],
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
