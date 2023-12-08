import { TTv4 } from "@tradetrust-tt/tradetrust";
import { verify, getRevokeStatus } from "./idvc-verifier";

const ndi: TTv4.IdentityVCData = {
  "@context": [
    "https://w3id.org/security/bbs/v1",
    "https://www.w3.org/2018/credentials/v1",
    "https://stg.issuer.myinfo.gov.sg/myinfobusiness/schema/corporatebasicdetails/v1",
    "https://w3id.org/vc/status-list/2021/v1",
  ],
  id: "https://sbl.alwaysdata.net/oa/credentials/123456789",
  type: ["VerifiableCredential"],
  issuer: "did:web:sbl.alwaysdata.net:oa",
  credentialSubject: {
    uen: "198801234E",
    companyname: "My Own Company Pte Ltd",
    type: ["CorporateBasicDetails"],
    id: "did:ethr:0xE94E4f16ad40ADc90C29Dc85b42F1213E034947C",
  },
  expirationDate: "2023-11-01T06:45:43Z",
  credentialStatus: {
    id: "https://sbl.alwaysdata.net/oa/status/1#325",
    type: "StatusList2021Entry",
    statusListIndex: 325,
    statusListCredential: "https://sbl.alwaysdata.net/oa/status/1/325",
  },
  issuanceDate: "2023-22-13T01:35:08Z",
  proof: {
    type: "BbsBlsSignature2020",
    created: "2023-10-18T07:14:46Z",
    proofPurpose: "assertionMethod",
    proofValue:
      "tqvUVZOPaY/A+7Wu47HZIYbboPU/MPGhb1EPLUKKPRwmRe8QJ/dzjRviQ5fAbR88TjSalqLbaBeopNocjrl7TmzCOlLQxGeNC4El1TCICu5tiX0HxGSNAPY4t5CglTLMTsdu5kg4f0a5MGQTnFgwyw==",
    verificationMethod: "did:web:sbl.alwaysdata.net:oa#didkey",
  },
};

const gleif: TTv4.IdentityVCData = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://didrp-test.esatus.com/schemas/basic-did-lei-mapping/v1",
    "https://w3id.org/vc/status-list/2021/v1",
    "https://w3id.org/security/suites/bls12381-2020/v1",
    "https://w3id.org/security/bbs/v1",
  ],
  id: "https://example.org/credentials/XYZ",
  issuanceDate: "2023-11-29T17:36:11Z",
  expirationDate: "2024-11-28T17:36:10.359965700Z",
  type: ["VerifiableCredential"],
  issuer: "did:web:didrp-test.esatus.com",
  credentialSubject: {
    lei: "391200WCZAYD47QIKX37",
    entityName: "IMDA_active",
    id: "did:ethr:0x433097a1c1b8a3e9188d8c54ecc057b1d69f1638#controller",
    type: ["BasicDIDLEIMapping"],
  },
  proof: {
    proofValue:
      "zRDcWf6h2Tfa7Uegw2q53KmoNEmcW2Wa1NeSfdHSaMvXMLAwT8R44MKxVe4nBpF4MgHKtQFG4DZZdbnN17UALgkPRJqMphNWZtciEqFxr4ukaVbugxbJjnobz8PFCTJ4dFXRE6WvKs21NA4T5X1fJg1955",
    created: "2023-11-29T17:36:11Z",
    proofPurpose: "assertionMethod",
    type: "BbsBlsSignature2020",
    verificationMethod: "did:web:didrp-test.esatus.com#keys-1",
    "@context": "https://w3id.org/security/bbs/v1",
  },
  credentialStatus: {
    statusPurpose: "revocation",
    statusListIndex: 42901,
    id: "https://didrp-test.esatus.com/credentials/statuslist/1#42901",
    type: "StatusList2021Entry",
    statusListCredential: "https://didrp-test.esatus.com/credentials/statuslist/1",
  },
};

describe("verify", () => {
  describe("v4", () => {
    it("should return valid fragment for document with identity proof method NDI", async () => {
      const verificationResult = await verify(ndi);
      expect(verificationResult.verified).toBe(true);
      expect(verificationResult.results[0].verified).toBe(true);
      expect(verificationResult.results[0].proof).toMatchObject({
        "@context": "https://w3id.org/security/v2",
        type: "sec:BbsBlsSignature2020",
        created: "2023-10-18T07:14:46Z",
        proofPurpose: "assertionMethod",
        proofValue:
          "tqvUVZOPaY/A+7Wu47HZIYbboPU/MPGhb1EPLUKKPRwmRe8QJ/dzjRviQ5fAbR88TjSalqLbaBeopNocjrl7TmzCOlLQxGeNC4El1TCICu5tiX0HxGSNAPY4t5CglTLMTsdu5kg4f0a5MGQTnFgwyw==",
        verificationMethod: "did:web:sbl.alwaysdata.net:oa#didkey",
      });

      const revokedStatus = await getRevokeStatus(ndi);
      expect(revokedStatus).toBe(false);
    });

    it("should return valid fragment for document with identity proof method GLEIF", async () => {
      // const verificationResult = await verify(gleif);
      // console.log(verificationResult);
      // const revokedStatus = await getRevokeStatus(gleif);
    });
  });
});
