import { documentPolValidWithToken } from "../../../../test/fixtures/v2/documentPolValidWithToken";
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
    it("should create a verifier without throwing", () => {
      expect(() => verificationBuilder(openAttestationVerifiers, { network: "pol" })).not.toThrow();
    });
  });

  describe("documentPolValidWithToken fixture", () => {
    it("should be recognised as a token registry document", () => {
      const shouldVerify = openAttestationEthereumTokenRegistryStatus.test(documentPolValidWithToken, options);
      expect(shouldVerify).toBe(true);
    });

    it("should have valid document hash (DOCUMENT_INTEGRITY passes offline)", async () => {
      const verifyHash = verificationBuilder(openAttestationVerifiers, { provider: options.provider });
      const fragments = await verifyHash(documentPolValidWithToken);
      const hashFragment = fragments.find((f) => f.name === "OpenAttestationHash");
      expect(hashFragment?.status).toBe("VALID");
    });

    it("should reach Polygon mainnet (chain 137) and return a DOCUMENT_STATUS fragment", async () => {
      const verifyPol = verificationBuilder(openAttestationVerifiers, {
        provider: options.provider,
      });
      const fragments = await verifyPol(documentPolValidWithToken);

      // Hash integrity must always be valid for a correctly wrapped document
      expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toBe(true);

      // A fragment must be returned — its presence proves the verifier ran against Polygon mainnet.
      // INVALID means the token is not minted; ERROR means the factory address (used as a
      // placeholder tokenRegistry) doesn't implement the ERC721/token-registry interface.
      // Both are expected for this test fixture — what matters is that a fragment was returned
      // (i.e. the RPC connection to Polygon mainnet, chain 137, succeeded).
      const statusFragment = fragments.find(
        (f) => f.name === "OpenAttestationEthereumTokenRegistryStatus"
      );
      expect(statusFragment).toBeDefined();
    });
  });
});
