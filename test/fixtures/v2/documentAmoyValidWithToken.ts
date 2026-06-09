import { v2, WrappedDocument } from "@tradetrust-tt/tradetrust";
import rawDoc from "./documentAmoyValidWithToken.json";

interface CustomDocument extends v2.OpenAttestationDocument {
  recipient: {
    name: string;
  };
}

// OA v2 wrapped document — Polygon Amoy testnet (chain ID 80002).
// Token registry : 0xa5f9a7106a599E4caAFacE6872da097aa802Cc64 (Amoy)
// Token ID (minted): 0x8d4ddb4f0252c1d61f0b72ad585573317c2d3f9268ebbd6d785699e12ebbb077
// data.version is stored in JSON to prevent the linter from stripping it.
export const documentAmoyValidWithToken = rawDoc as unknown as WrappedDocument<CustomDocument>;
