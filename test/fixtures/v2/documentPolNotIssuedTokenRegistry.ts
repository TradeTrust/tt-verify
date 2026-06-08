import { SchemaId, v2, WrappedDocument } from "@tradetrust-tt/tradetrust";

interface CustomDocument extends v2.OpenAttestationDocument {
  recipient: {
    name: string;
  };
}

// OA v2 wrapped document — Polygon mainnet (chain ID 137).
// Uses the same token registry as documentPolValidWithToken but a different merkle root
// that has NOT been minted, so verify() should always return INVALID.
// Update `tokenRegistry` to match your deployed TradeTrustToken address (same as the valid fixture).
export const documentPolNotIssuedTokenRegistry: WrappedDocument<CustomDocument> = {
  version: SchemaId.v2,
  data: {
    id: "e5c04ef4-b42f-4251-ad18-6a0254f3495f:string:pol-not-issued",
    $template: {
      name: "6a016890-7e4e-40e4-a533-d74fd0d44408:string:GOVTECH_DEMO",
      type: "793afd56-4fde-4bbf-a58f-c38f408229c7:string:EMBEDDED_RENDERER",
      url: "237c9e87-4da6-448e-98b9-9e566cda969b:string:https://demo-renderer.opencerts.io",
    },
    issuers: [
      {
        name: "84f99ede-66c9-4c9f-a69f-91ddc7bc80fa:string:TrustVC POL Issuer",
        tokenRegistry: "3e52e205-1051-4616-9311-1cda1cc1f513:string:0x0961d9C2dA9a7105fDFC9DC4ec45951C024F88B0",
        identityProof: {
          type: "257c33ed-995b-42d3-bf3f-13719086fd3f:string:DNS-TXT",
          location: "4c51ebaf-5f21-4ece-b01a-5d08c5ef81ff:string:example.tradetrust.io",
        },
      },
    ],
    recipient: {
      name: "39526f35-2c57-44ac-81b5-a53e3aa4f0ce:string:TrustVC POL Test",
    },
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "2aa34ea6672556041d802989ca5f39f92694716023bb272610ff68d0f54e4d92",
    proof: [],
    merkleRoot: "2aa34ea6672556041d802989ca5f39f92694716023bb272610ff68d0f54e4d92",
  },
};
