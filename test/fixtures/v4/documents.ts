import { TTv4 } from "@tradetrust-tt/tradetrust";

export const baseDnsDidDocument: TTv4.TradeTrustDocument = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://schemata.tradetrust.io/io/tradetrust/4.0/alpha-context.json",
  ],
  type: ["VerifiableCredential", "TradeTrustCredential"],
  validFrom: "2021-03-08T12:00:00+08:00",
  issuer: {
    id: "did:ethr:0xCA93690Bb57EEaB273c796a9309246BC0FB93649",
    name: "TradeTrustIssuer",
    identityProof: {
      identityProofType: TTv4.IdentityProofType.DNSDid,
      identifier: "example.tradetrust.io",
    },
  },
  network: {
    chain: "NA",
    chainId: "NA",
  },
  credentialStatus: {
    type: "TradeTrustCredentialStatus",
    credentialStatusType: TTv4.CredentialStatusType.None,
  },
  renderMethod: {
    type: "TradeTrustRenderMethod",
    renderMethodType: TTv4.RenderMethodType.EmbeddedRenderer,
    name: "INVOICE",
    url: "https://generic-templates.tradetrust.io",
  },
  credentialSubject: {
    name: "TradeTrust Invoice",
    id: "urn:uuid:a013fb9d-bb03-4056-b696-05575eceaf42",
    date: "2018-02-21",
    customerId: "564",
    terms: "Due Upon Receipt",
    billFrom: {
      name: "ABC Company",
      streetAddress: "Level 1, Industry Offices",
      city: "Singapore",
      postalCode: "123456",
      phoneNumber: "60305029",
    },
    billTo: {
      company: {
        name: "DEF Company",
        streetAddress: "Level 2, Industry Offices",
        city: "Singapore",
        postalCode: "612345",
        phoneNumber: "61204028",
      },
      name: "James Lee",
      email: "def@company.com",
    },
    billableItems: [
      {
        description: "Service Fee",
        quantity: "1",
        unitPrice: "200",
        amount: "200",
      },
      {
        description: "Labor: 5 hours at $75/hr",
        quantity: "5",
        unitPrice: "75",
        amount: "375",
      },
      {
        description: "New client discount",
        quantity: "1",
        unitPrice: "50",
        amount: "50",
      },
    ],
    subtotal: "625",
    tax: "0",
    taxTotal: "0",
    total: "625",
  },
};

export const baseDidDocument: TTv4.TradeTrustDocument = {
  ...baseDnsDidDocument,
  issuer: {
    ...baseDnsDidDocument.issuer,
    identityProof: {
      identityProofType: TTv4.IdentityProofType.Did,
      identifier: "did:ethr:0xCA93690Bb57EEaB273c796a9309246BC0FB93649",
    },
  },
};

export const baseDocumentStoreDocument: TTv4.TradeTrustDocument = {
  ...baseDnsDidDocument,
  issuer: {
    ...baseDnsDidDocument.issuer,
    identityProof: {
      identityProofType: TTv4.IdentityProofType.DNSTxt,
      identifier: "example.tradetrust.io",
    },
  },
  network: {
    chain: "stability",
    chainId: "101010",
  },
  credentialStatus: {
    ...baseDnsDidDocument.credentialStatus,
    type: "TradeTrustCredentialStatus",
    credentialStatusType: TTv4.CredentialStatusType.RevocationStore,
    location: "0xA594f6e10564e87888425c7CC3910FE1c800aB0B",
  },
};

export const baseTokenRegistryDocument: TTv4.TradeTrustDocument = {
  ...baseDnsDidDocument,
  issuer: {
    ...baseDnsDidDocument.issuer,
    identityProof: {
      identityProofType: TTv4.IdentityProofType.DNSTxt,
      identifier: "example.tradetrust.io",
    },
  },
  network: {
    chain: "stability",
    chainId: "101010",
  },
  credentialStatus: {
    ...baseDnsDidDocument.credentialStatus,
    type: "TradeTrustCredentialStatus",
    credentialStatusType: TTv4.CredentialStatusType.TokenRegistry,
    location: "0x71D28767662cB233F887aD2Bb65d048d760bA694",
  },
};
