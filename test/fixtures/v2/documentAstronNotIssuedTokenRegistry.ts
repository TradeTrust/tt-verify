import { SchemaId, v2, WrappedDocument } from "@tradetrust-tt/tradetrust";

interface CustomDocument extends v2.OpenAttestationDocument {
  recipient: {
    name: string;
  };
}

export const documentAstronNotIssuedTokenRegistry: WrappedDocument<CustomDocument> = {
  version: SchemaId.v2,
  data: {
    id: "afaecf00-c60e-4b2d-8e89-00058291cc64:string:53b75bbe",
    $template: {
      name: "9aca2fb8-6c44-44ef-b216-1af29fd17900:string:GOVTECH_DEMO",
      type: "762eb970-b6f8-48d1-84f4-658ed4d9e4d8:string:EMBEDDED_RENDERER",
      url: "0a6d97f1-e2c2-4745-9618-43a12d5e5917:string:https://demo-renderer.opencerts.io",
    },
    issuers: [
      {
        name: "f296229f-5787-43f8-b99c-e9a8a4fd83af:string:caict astron",
        tokenRegistry: "99b518eb-d5bd-43d1-b7bd-c33bb6f659ee:string:0x0D5da59B93e8AC9b1781CE5694fbcE626586F4c9",
        identityProof: {
          type: "2c4ebeeb-3add-4253-859f-a1517c71c321:string:DNS-TXT",
          location: "617e3f57-06ad-4db4-ae9c-0f486ad8ea9c:string:astronlayer2.bitfactory.cn",
        },
      },
    ],
    recipient: {
      name: "def72d81-06b0-488e-9823-c025ac6cd48d:string:caict",
    },
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "636f9fdece5c77d2be5278576819d8f1c36e9a594f2c3675327165356b680ec8",
    proof: [],
    merkleRoot: "636f9fdece5c77d2be5278576819d8f1c36e9a594f2c3675327165356b680ec8",
  },
};
