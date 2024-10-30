import { SchemaId, v2, WrappedDocument } from "@tradetrust-tt/tradetrust";

interface CustomDocument extends v2.OpenAttestationDocument {
  recipient: {
    name: string;
  };
}

export const documentAstronValidWithToken: WrappedDocument<CustomDocument> = {
  version: SchemaId.v2,
  data: {
    id: "dca1ce12-d96e-4969-8849-13ce5c7a0bb0:string:53b75bbe",
    $template: {
      name: "f4c6f2e9-4d70-45df-b811-f9a1131c23ee:string:GOVTECH_DEMO",
      type: "e7a91e7a-f68b-437c-85bc-f27925e1306c:string:EMBEDDED_RENDERER",
      url: "d3383e4c-9132-46de-9aff-a900bc1acc26:string:https://demo-renderer.opencerts.io",
    },
    issuers: [
      {
        name: "273d6f8c-da18-46cf-b4d6-df87177f0816:string:caict astron",
        tokenRegistry: "d3c8f3e7-577d-4abe-9b75-4ea9e9570f44:string:0x0D5da59B93e8AC9b1781CE5694fbcE626586F4c9",
        identityProof: {
          type: "7f16acb8-eff4-4dc7-b80d-6abd006f8930:string:DNS-TXT",
          location: "15414aad-d0f8-47f0-8a21-1f7f2775ce2f:string:astronlayer2.bitfactory.cn",
        },
      },
    ],
    recipient: {
      name: "a3ba2c31-a8fe-4489-a478-f0050ce3654e:string:caict",
    },
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "af1e44ff058bde3770776d09d5a1b9f8eb210ca62f8c1cf93cff3c0ba0ec575a",
    proof: [],
    merkleRoot: "af1e44ff058bde3770776d09d5a1b9f8eb210ca62f8c1cf93cff3c0ba0ec575a",
  },
};
