/// <reference types="jest" />
import { documentPolValidWithToken } from "../../../../test/fixtures/v3/documentPolValidWithToken";
import { openAttestationEthereumTokenRegistryStatus } from "./ethereumTokenRegistryStatus";
import { generateProvider, getDefaultProvider } from "../../../common/utils";
import { verificationBuilder, openAttestationVerifiers, isValid } from "../../../index";

// Polygon mainnet public RPC — no API key required for read-only calls.
const POL_RPC_URL = process.env.POL_RPC || "https://polygon-rpc.com";

const options = {
  provider: generateProvider({
    network: "pol",
    providerType: "jsonrpc",
    url: POL_RPC_URL,
  }),
};

jest.setTimeout(300_000);

// ─── Network / provider bootstrap ────────────────────────────────────────────

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
    it("should run the full pipeline and return a fragment for every verifier", async () => {
      const verifier = verificationBuilder(openAttestationVerifiers, { network: "pol" });
      const fragments = await verifier(documentPolValidWithToken as any);
      // Every OA verifier skips W3C VC documents — all fragments must be SKIPPED.
      expect(fragments.every((f) => f.status === "SKIPPED")).toBe(true);
      // isValid requires at least one VALID per type; all-SKIPPED → false.
      expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toBe(false);
    });

    it("should return a SKIPPED status fragment for OpenAttestationEthereumTokenRegistryStatus", async () => {
      const verifier = verificationBuilder(openAttestationVerifiers, { network: "pol" });
      const fragments = await verifier(documentPolValidWithToken as any);
      const statusFragment = fragments.find((f) => f.name === "OpenAttestationEthereumTokenRegistryStatus");
      expect(statusFragment).toBeDefined();
      expect(statusFragment?.status).toBe("SKIPPED");
      expect(statusFragment?.type).toBe("DOCUMENT_STATUS");
    });
  });
});

// ─── test() ──────────────────────────────────────────────────────────────────

describe("test", () => {
  it("should return false for a W3C VC document (not OA v2/v3 format)", () => {
    // documentPolValidWithToken is a W3C Verifiable Credential; test() only recognises OA v2/v3.
    const shouldVerify = openAttestationEthereumTokenRegistryStatus.test(documentPolValidWithToken as any, options);
    expect(shouldVerify).toBe(false);
  });

  it("should return false when credentialStatus is removed", () => {
    const documentWithoutCredentialStatus: any = { ...documentPolValidWithToken, credentialStatus: undefined };
    const shouldVerify = openAttestationEthereumTokenRegistryStatus.test(documentWithoutCredentialStatus, options);
    expect(shouldVerify).toBe(false);
  });

  it("should return false when credentialStatus type is not TransferableRecords", () => {
    const documentWithDocumentStore: any = {
      ...documentPolValidWithToken,
      credentialStatus: { ...(documentPolValidWithToken as any).credentialStatus, type: "DocumentStore" },
    };
    const shouldVerify = openAttestationEthereumTokenRegistryStatus.test(documentWithDocumentStore, options);
    expect(shouldVerify).toBe(false);
  });

  it("should return false when tokenRegistry address is removed", () => {
    const documentWithoutRegistry: any = {
      ...documentPolValidWithToken,
      credentialStatus: { ...(documentPolValidWithToken as any).credentialStatus, tokenRegistry: undefined },
    };
    const shouldVerify = openAttestationEthereumTokenRegistryStatus.test(documentWithoutRegistry, options);
    expect(shouldVerify).toBe(false);
  });

  it("should return false for an empty object", () => {
    const shouldVerify = openAttestationEthereumTokenRegistryStatus.test({} as any, options);
    expect(shouldVerify).toBe(false);
  });
});

// ─── verify() ────────────────────────────────────────────────────────────────

describe("verify", () => {
  it("should return an error fragment for W3C VC documents (UNRECOGNIZED_DOCUMENT)", async () => {
    const fragment = await openAttestationEthereumTokenRegistryStatus.verify(documentPolValidWithToken as any, options);
    expect(fragment).toMatchInlineSnapshot(`
      {
        "data": [Error: Document does not match either v2 or v3 formats. Consider using \`utils.diagnose\` from open-attestation to find out more.],
        "name": "OpenAttestationEthereumTokenRegistryStatus",
        "reason": {
          "code": 9,
          "codeString": "UNRECOGNIZED_DOCUMENT",
          "message": "Document does not match either v2 or v3 formats. Consider using \`utils.diagnose\` from open-attestation to find out more.",
        },
        "status": "ERROR",
        "type": "DOCUMENT_STATUS",
      }
    `);
  });

  it("should return an error fragment for an empty object (UNRECOGNIZED_DOCUMENT)", async () => {
    const fragment = await openAttestationEthereumTokenRegistryStatus.verify({} as any, options);
    expect(fragment).toMatchInlineSnapshot(`
      {
        "data": [Error: Document does not match either v2 or v3 formats. Consider using \`utils.diagnose\` from open-attestation to find out more.],
        "name": "OpenAttestationEthereumTokenRegistryStatus",
        "reason": {
          "code": 9,
          "codeString": "UNRECOGNIZED_DOCUMENT",
          "message": "Document does not match either v2 or v3 formats. Consider using \`utils.diagnose\` from open-attestation to find out more.",
        },
        "status": "ERROR",
        "type": "DOCUMENT_STATUS",
      }
    `);
  });
});

// ─── skip() ──────────────────────────────────────────────────────────────────

describe("skip", () => {
  it("should return the skip fragment", async () => {
    const fragment = await openAttestationEthereumTokenRegistryStatus.skip(documentPolValidWithToken as any, options);
    expect(fragment).toMatchInlineSnapshot(`
      {
        "name": "OpenAttestationEthereumTokenRegistryStatus",
        "reason": {
          "code": 4,
          "codeString": "SKIPPED",
          "message": "Document issuers doesn't have "tokenRegistry" property or TOKEN_REGISTRY method",
        },
        "status": "SKIPPED",
        "type": "DOCUMENT_STATUS",
      }
    `);
  });
});
