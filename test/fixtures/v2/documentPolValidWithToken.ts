import { SchemaId, v2, WrappedDocument } from "@tradetrust-tt/tradetrust";

interface CustomDocument extends v2.OpenAttestationDocument {
  recipient: {
    name: string;
  };
}

// Wrapped OA v2 document referencing a token registry on Polygon mainnet (chain ID 137).
// tokenRegistry: TitleEscrowFactory address on Polygon from @tradetrust-tt/token-registry-v5 constants.
// identity proof location: example.tradetrust.io (DNS-TXT with netId=137).
// DOCUMENT_INTEGRITY (hash check) passes offline; DOCUMENT_STATUS requires the token to be
// minted on-chain at 0xF94f95014304dC45B097439765A4D321bbE165c7 on Polygon mainnet.
export const documentPolValidWithToken: WrappedDocument<CustomDocument> = {
  version: SchemaId.v2,
  data: {
    version: "eec1ca24-ed2b-4602-b133-5d0e6cb2096a:string:https://schema.openattestation.com/2.0/schema.json",
    issuers: [
      {
        name: "84f99ede-66c9-4c9f-a69f-91ddc7bc80fa:string:TrustVC POL Issuer",
        tokenRegistry: "3e52e205-1051-4616-9311-1cda1cc1f513:string:0xF94f95014304dC45B097439765A4D321bbE165c7",
        identityProof: {
          type: "257c33ed-995b-42d3-bf3f-13719086fd3f:string:DNS-TXT",
          location:
            "4c51ebaf-5f21-4ece-b01a-5d08c5ef81ff:string:example.tradetrust.io",
        },
      },
    ],
    $template: {
      name: "9ecdbb0d-657d-4ac1-b0e0-e88c66144eab:string:GOVTECH_DEMO",
      type: "c07f15e2-1e1d-4fb3-816a-91afc0b164bd:string:EMBEDDED_RENDERER",
      url: "7aa99880-1704-4df8-9282-18473956297d:string:https://demo-renderer.opencerts.io",
    },
    recipient: {
      name: "ee691a7d-1d26-4e40-93a6-e19191041ae6:string:TrustVC POL Test",
    },
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash:
      "cd1b76426bbbe027f1c0201da96ee910bec9982667123f81b8e559f718f5479b",
    proof: [],
    merkleRoot:
      "cd1b76426bbbe027f1c0201da96ee910bec9982667123f81b8e559f718f5479b",
  },
};
