import { v2, v3 } from "@tradetrust-tt/tradetrust";
import { providers } from "ethers";
import { documentHederaValidWithDocumentStore } from "../../../../test/fixtures/v2/documentGoerliValidWithDocumentStore";
import { documentGoerliValidWithToken } from "../../../../test/fixtures/v2/documentGoerliValidWithToken";
import { documentMixedIssuance } from "../../../../test/fixtures/v2/documentMixedIssuance";
import { getProvider } from "../../../common/utils";
import { openAttestationDnsTxtIdentityProof } from "./openAttestationDnsTxt";

import v3DidSignedRaw from "../../../../test/fixtures/v3/did-signed.json";
import v3DnsDidSignedRaw from "../../../../test/fixtures/v3/dnsdid-signed.json";
import v3DocumentStoreIssuedRaw from "../../../../test/fixtures/v3/documentStore-issued.json";
import v3TokenRegistryIssuedRaw from "../../../../test/fixtures/v3/tokenRegistry-issued.json";

const v3DidSigned = v3DidSignedRaw as v3.SignedWrappedDocument;
const v3DnsDidSigned = v3DnsDidSignedRaw as v3.SignedWrappedDocument;
const v3DocumentStoreIssued = v3DocumentStoreIssuedRaw as v3.WrappedDocument;
const v3TokenRegistryIssued = v3TokenRegistryIssuedRaw as v3.WrappedDocument;

class CustomJsonRpcProvider extends providers.JsonRpcProvider {
  async detectNetwork() {
      return {
          name: "hedera",
          chainId: 296, 
      };
  }
}

const provider = new CustomJsonRpcProvider("https://testnet-public.mirrornode.hedera.com");


// Construct the options object with the provider
const options = {
  network: "hedera", 
  provider: provider,
};
  
jest.mock('ethers', () => {
  const originalModule = jest.requireActual('ethers');
  return {
      ...originalModule,
      providers: {
          ...originalModule.providers,
          JsonRpcProvider: class extends originalModule.providers.JsonRpcProvider {
              async detectNetwork() {
                  return {
                      name: "hedera",
                      chainId: 296,
                  };
              }
          }
      }
  };
});


describe("verify", () => {
    describe("v2", () => {
      it("should return a valid fragment when document has valid identity and uses document store", async () => {
        const fragment = await openAttestationDnsTxtIdentityProof.verify(documentHederaValidWithDocumentStore, options);
        console.log("Output")
        console.error(JSON.stringify(fragment))
        expect(fragment).toMatchInlineSnapshot(`
          Object {
            "data": Array [
              Object {
                "location": "trustlv.org",
                "status": "VALID",
                "value": "0x3DE43bfd3D771931E46CbBd4EDE0D3d95C85f81A",
              },
            ],
            "name": "OpenAttestationDnsTxtIdentityProof",
            "status": "VALID",
            "type": "ISSUER_IDENTITY",
          }
        `);
      });
    });
  });

