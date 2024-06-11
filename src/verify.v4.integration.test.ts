import { obfuscate, TTv4 } from "@tradetrust-tt/tradetrust";
import { getFailingFragments, getFragmentsByName } from "../test/utils";
import { isValid, openAttestationDidIdentityProof, openAttestationVerifiers, verificationBuilder } from "./index";

import v4DidSignedRevocationStoreNotRevokedRaw from "../test/fixtures/v4/did-revocation-store-signed-not-revoked.json";
import v4DidSignedRevocationStoreButRevokedRaw from "../test/fixtures/v4/did-revocation-store-signed-revoked.json";
import v4DidSignedRaw from "../test/fixtures/v4/did-signed.json";
import v4DidWrappedRaw from "../test/fixtures/v4/did-wrapped.json";

import v4DnsDidInvalidSignedRaw from "../test/fixtures/v4/dnsdid-invalid-signed.json";
import v4DnsDidSignedRevocationStoreNotRevokedRaw from "../test/fixtures/v4/dnsdid-revocation-store-signed-not-revoked.json";
import v4DnsDidSignedRevocationStoreButRevokedRaw from "../test/fixtures/v4/dnsdid-revocation-store-signed-revoked.json";
import v4DnsDidSignedRaw from "../test/fixtures/v4/dnsdid-signed.json";
import v4DnsDidWrappedRaw from "../test/fixtures/v4/dnsdid-wrapped.json";

import v4DocumentStoreInvalidIssuedRaw from "../test/fixtures/v4/documentStore-invalid-issued.json";
import v4DocumentStoreIssuedRaw from "../test/fixtures/v4/documentStore-issued.json";
import v4DocumentStoreRevokedRaw from "../test/fixtures/v4/documentStore-revoked.json";
import v4DocumentStoreWrappedRaw from "../test/fixtures/v4/documentStore-wrapped.json";

import v4TokenRegistryInvalidIssuedRaw from "../test/fixtures/v4/tokenRegistry-invalid-issued.json";
import v4TokenRegistryIssuedRaw from "../test/fixtures/v4/tokenRegistry-issued.json";
import v4TokenRegistryWrappedRaw from "../test/fixtures/v4/tokenRegistry-wrapped.json";
import { ethers } from "ethers";

const v4DidWrapped = v4DidWrappedRaw as TTv4.WrappedDocument;
const v4DidSigned = v4DidSignedRaw as TTv4.SignedWrappedDocument;
const v4DidSignedRevocationStoreNotRevoked = v4DidSignedRevocationStoreNotRevokedRaw as TTv4.SignedWrappedDocument;
const v4DidSignedRevocationStoreButRevoked = v4DidSignedRevocationStoreButRevokedRaw as TTv4.SignedWrappedDocument;

const v4DnsDidWrapped = v4DnsDidWrappedRaw as TTv4.WrappedDocument;
const v4DnsDidSigned = v4DnsDidSignedRaw as TTv4.SignedWrappedDocument;
const v4DnsDidInvalidSigned = v4DnsDidInvalidSignedRaw as TTv4.SignedWrappedDocument;
const v4DnsDidSignedRevocationStoreNotRevoked =
  v4DnsDidSignedRevocationStoreNotRevokedRaw as TTv4.SignedWrappedDocument;
const v4DnsDidSignedRevocationStoreButRevoked =
  v4DnsDidSignedRevocationStoreButRevokedRaw as TTv4.SignedWrappedDocument;

const v4DocumentStoreIssued = v4DocumentStoreIssuedRaw as TTv4.WrappedDocument;
const v4DocumentStoreWrapped = v4DocumentStoreWrappedRaw as TTv4.WrappedDocument;
const v4DocumentStoreRevoked = v4DocumentStoreRevokedRaw as TTv4.WrappedDocument;
const v4DocumentStoreInvalidIssued = v4DocumentStoreInvalidIssuedRaw as TTv4.WrappedDocument;

const v4TokenRegistryIssued = v4TokenRegistryIssuedRaw as TTv4.WrappedDocument;
const v4TokenRegistryWrapped = v4TokenRegistryWrappedRaw as TTv4.WrappedDocument;
const v4TokenRegistryInvalidIssued = v4TokenRegistryInvalidIssuedRaw as TTv4.WrappedDocument;

const verifySepolia = verificationBuilder([...openAttestationVerifiers, openAttestationDidIdentityProof], {
  provider: new ethers.providers.JsonRpcProvider("https://gtn.stabilityprotocol.com"),
});

describe("verify v4(integration)", () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = Object.assign(process.env, {
      PROVIDER_NETWORK: "",
      PROVIDER_API_KEY: "",
      PROVIDER_ENDPOINT_TYPE: "",
      PROVIDER_ENDPOINT_URL: "",
    });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    delete process.env.PROVIDER_NETWORK;
    delete process.env.PROVIDER_API_KEY;
    delete process.env.PROVIDER_ENDPOINT_TYPE;
    delete process.env.PROVIDER_ENDPOINT_URL;
    jest.spyOn(console, "warn").mockRestore();
  });

  describe("valid documents", () => {
    it("should return valid fragments for document issued correctly with DID & using DID identity proof", async () => {
      const fragments = await verifySepolia(v4DidSigned);
      const valid = isValid(fragments);
      expect(fragments).toMatchInlineSnapshot(`
        Array [
          Object {
            "data": true,
            "name": "OpenAttestationHash",
            "status": "VALID",
            "type": "DOCUMENT_INTEGRITY",
          },
          Object {
            "name": "OpenAttestationEthereumTokenRegistryStatus",
            "reason": Object {
              "code": 4,
              "codeString": "SKIPPED",
              "message": "Document issuers doesn't have \\"tokenRegistry\\" property or TOKEN_REGISTRY method",
            },
            "status": "SKIPPED",
            "type": "DOCUMENT_STATUS",
          },
          Object {
            "name": "OpenAttestationEthereumDocumentStoreStatus",
            "reason": Object {
              "code": 4,
              "codeString": "SKIPPED",
              "message": "Document issuers doesn't have \\"documentStore\\" or \\"certificateStore\\" property or DOCUMENT_STORE method",
            },
            "status": "SKIPPED",
            "type": "DOCUMENT_STATUS",
          },
          Object {
            "data": Object {
              "details": Object {
                "issuance": Object {
                  "did": "did:ethr:0xCA93690Bb57EEaB273c796a9309246BC0FB93649",
                  "issued": true,
                },
                "revocation": Object {
                  "revoked": false,
                },
              },
              "issuedOnAll": true,
              "revokedOnAny": false,
            },
            "name": "OpenAttestationDidSignedDocumentStatus",
            "status": "VALID",
            "type": "DOCUMENT_STATUS",
          },
          Object {
            "name": "OpenAttestationDnsTxtIdentityProof",
            "reason": Object {
              "code": 2,
              "codeString": "SKIPPED",
              "message": "Document issuers doesn't have \\"documentStore\\" / \\"tokenRegistry\\" property or doesn't use DNS-TXT type",
            },
            "status": "SKIPPED",
            "type": "ISSUER_IDENTITY",
          },
          Object {
            "name": "OpenAttestationDnsDidIdentityProof",
            "reason": Object {
              "code": 0,
              "codeString": "SKIPPED",
              "message": "Document was not issued using DNS-DID",
            },
            "status": "SKIPPED",
            "type": "ISSUER_IDENTITY",
          },
          Object {
            "data": Object {
              "did": "did:ethr:0xCA93690Bb57EEaB273c796a9309246BC0FB93649",
              "verified": true,
            },
            "name": "OpenAttestationDidIdentityProof",
            "status": "VALID",
            "type": "ISSUER_IDENTITY",
          },
        ]
      `);
      expect(valid).toBe(true);
    });
    it("should return valid fragments for document issued correctly with DID & using DID identity proof, but not revoked on a document store", async () => {
      const fragments = await verifySepolia(v4DidSignedRevocationStoreNotRevoked);
      const valid = isValid(fragments);
      expect(fragments).toMatchInlineSnapshot(`
        Array [
          Object {
            "data": true,
            "name": "OpenAttestationHash",
            "status": "VALID",
            "type": "DOCUMENT_INTEGRITY",
          },
          Object {
            "name": "OpenAttestationEthereumTokenRegistryStatus",
            "reason": Object {
              "code": 4,
              "codeString": "SKIPPED",
              "message": "Document issuers doesn't have \\"tokenRegistry\\" property or TOKEN_REGISTRY method",
            },
            "status": "SKIPPED",
            "type": "DOCUMENT_STATUS",
          },
          Object {
            "data": Object {
              "details": Object {
                "issuance": Object {
                  "address": "0xA594f6e10564e87888425c7CC3910FE1c800aB0B",
                  "issued": true,
                },
                "revocation": Object {
                  "address": "0xA594f6e10564e87888425c7CC3910FE1c800aB0B",
                  "revoked": false,
                },
              },
              "issuedOnAll": true,
              "revokedOnAny": false,
            },
            "name": "OpenAttestationEthereumDocumentStoreStatus",
            "status": "VALID",
            "type": "DOCUMENT_STATUS",
          },
          Object {
            "data": Object {
              "details": Object {
                "issuance": Object {
                  "did": "did:ethr:0xCA93690Bb57EEaB273c796a9309246BC0FB93649",
                  "issued": true,
                },
                "revocation": Object {
                  "address": "0xA594f6e10564e87888425c7CC3910FE1c800aB0B",
                  "revoked": false,
                },
              },
              "issuedOnAll": true,
              "revokedOnAny": false,
            },
            "name": "OpenAttestationDidSignedDocumentStatus",
            "status": "VALID",
            "type": "DOCUMENT_STATUS",
          },
          Object {
            "name": "OpenAttestationDnsTxtIdentityProof",
            "reason": Object {
              "code": 2,
              "codeString": "SKIPPED",
              "message": "Document issuers doesn't have \\"documentStore\\" / \\"tokenRegistry\\" property or doesn't use DNS-TXT type",
            },
            "status": "SKIPPED",
            "type": "ISSUER_IDENTITY",
          },
          Object {
            "name": "OpenAttestationDnsDidIdentityProof",
            "reason": Object {
              "code": 0,
              "codeString": "SKIPPED",
              "message": "Document was not issued using DNS-DID",
            },
            "status": "SKIPPED",
            "type": "ISSUER_IDENTITY",
          },
          Object {
            "data": Object {
              "did": "did:ethr:0xCA93690Bb57EEaB273c796a9309246BC0FB93649",
              "verified": true,
            },
            "name": "OpenAttestationDidIdentityProof",
            "status": "VALID",
            "type": "ISSUER_IDENTITY",
          },
        ]
      `);
      expect(valid).toBe(true);
    });
    it("should return valid fragments for document issued correctly with DID & using DNS-DID identity proof", async () => {
      const fragments = await verifySepolia(v4DnsDidSigned);
      const valid = isValid(fragments);
      expect(fragments).toMatchInlineSnapshot(`
        Array [
          Object {
            "data": true,
            "name": "OpenAttestationHash",
            "status": "VALID",
            "type": "DOCUMENT_INTEGRITY",
          },
          Object {
            "name": "OpenAttestationEthereumTokenRegistryStatus",
            "reason": Object {
              "code": 4,
              "codeString": "SKIPPED",
              "message": "Document issuers doesn't have \\"tokenRegistry\\" property or TOKEN_REGISTRY method",
            },
            "status": "SKIPPED",
            "type": "DOCUMENT_STATUS",
          },
          Object {
            "name": "OpenAttestationEthereumDocumentStoreStatus",
            "reason": Object {
              "code": 4,
              "codeString": "SKIPPED",
              "message": "Document issuers doesn't have \\"documentStore\\" or \\"certificateStore\\" property or DOCUMENT_STORE method",
            },
            "status": "SKIPPED",
            "type": "DOCUMENT_STATUS",
          },
          Object {
            "data": Object {
              "details": Object {
                "issuance": Object {
                  "did": "did:ethr:0xCA93690Bb57EEaB273c796a9309246BC0FB93649",
                  "issued": true,
                },
                "revocation": Object {
                  "revoked": false,
                },
              },
              "issuedOnAll": true,
              "revokedOnAny": false,
            },
            "name": "OpenAttestationDidSignedDocumentStatus",
            "status": "VALID",
            "type": "DOCUMENT_STATUS",
          },
          Object {
            "name": "OpenAttestationDnsTxtIdentityProof",
            "reason": Object {
              "code": 2,
              "codeString": "SKIPPED",
              "message": "Document issuers doesn't have \\"documentStore\\" / \\"tokenRegistry\\" property or doesn't use DNS-TXT type",
            },
            "status": "SKIPPED",
            "type": "ISSUER_IDENTITY",
          },
          Object {
            "data": Object {
              "key": "did:ethr:0xCA93690Bb57EEaB273c796a9309246BC0FB93649#controller",
              "location": "example.tradetrust.io",
              "status": "VALID",
            },
            "name": "OpenAttestationDnsDidIdentityProof",
            "status": "VALID",
            "type": "ISSUER_IDENTITY",
          },
          Object {
            "name": "OpenAttestationDidIdentityProof",
            "reason": Object {
              "code": 0,
              "codeString": "SKIPPED",
              "message": "Document is not using DID as top level identifier or has not been wrapped",
            },
            "status": "SKIPPED",
            "type": "ISSUER_IDENTITY",
          },
        ]
      `);
      expect(valid).toBe(true);
    });
    it("should return valid fragments for document issued correctly with DID & using DNS-DID identity proof, but not revoked  on a document store", async () => {
      const fragments = await verifySepolia(v4DnsDidSignedRevocationStoreNotRevoked);
      const valid = isValid(fragments);
      expect(fragments).toMatchInlineSnapshot(`
        Array [
          Object {
            "data": true,
            "name": "OpenAttestationHash",
            "status": "VALID",
            "type": "DOCUMENT_INTEGRITY",
          },
          Object {
            "name": "OpenAttestationEthereumTokenRegistryStatus",
            "reason": Object {
              "code": 4,
              "codeString": "SKIPPED",
              "message": "Document issuers doesn't have \\"tokenRegistry\\" property or TOKEN_REGISTRY method",
            },
            "status": "SKIPPED",
            "type": "DOCUMENT_STATUS",
          },
          Object {
            "data": Object {
              "details": Object {
                "issuance": Object {
                  "address": "0xA594f6e10564e87888425c7CC3910FE1c800aB0B",
                  "issued": true,
                },
                "revocation": Object {
                  "address": "0xA594f6e10564e87888425c7CC3910FE1c800aB0B",
                  "revoked": false,
                },
              },
              "issuedOnAll": true,
              "revokedOnAny": false,
            },
            "name": "OpenAttestationEthereumDocumentStoreStatus",
            "status": "VALID",
            "type": "DOCUMENT_STATUS",
          },
          Object {
            "data": Object {
              "details": Object {
                "issuance": Object {
                  "did": "did:ethr:0xCA93690Bb57EEaB273c796a9309246BC0FB93649",
                  "issued": true,
                },
                "revocation": Object {
                  "address": "0xA594f6e10564e87888425c7CC3910FE1c800aB0B",
                  "revoked": false,
                },
              },
              "issuedOnAll": true,
              "revokedOnAny": false,
            },
            "name": "OpenAttestationDidSignedDocumentStatus",
            "status": "VALID",
            "type": "DOCUMENT_STATUS",
          },
          Object {
            "name": "OpenAttestationDnsTxtIdentityProof",
            "reason": Object {
              "code": 2,
              "codeString": "SKIPPED",
              "message": "Document issuers doesn't have \\"documentStore\\" / \\"tokenRegistry\\" property or doesn't use DNS-TXT type",
            },
            "status": "SKIPPED",
            "type": "ISSUER_IDENTITY",
          },
          Object {
            "data": Object {
              "key": "did:ethr:0xCA93690Bb57EEaB273c796a9309246BC0FB93649#controller",
              "location": "example.tradetrust.io",
              "status": "VALID",
            },
            "name": "OpenAttestationDnsDidIdentityProof",
            "status": "VALID",
            "type": "ISSUER_IDENTITY",
          },
          Object {
            "name": "OpenAttestationDidIdentityProof",
            "reason": Object {
              "code": 0,
              "codeString": "SKIPPED",
              "message": "Document is not using DID as top level identifier or has not been wrapped",
            },
            "status": "SKIPPED",
            "type": "ISSUER_IDENTITY",
          },
        ]
      `);
      expect(valid).toBe(true);
    });
    it("should return valid fragments for document issued correctly with document store & using DNS-TXT identity proof", async () => {
      const fragments = await verifySepolia(v4DocumentStoreIssued);
      const valid = isValid(fragments);
      expect(fragments).toMatchInlineSnapshot(`
        Array [
          Object {
            "data": true,
            "name": "OpenAttestationHash",
            "status": "VALID",
            "type": "DOCUMENT_INTEGRITY",
          },
          Object {
            "name": "OpenAttestationEthereumTokenRegistryStatus",
            "reason": Object {
              "code": 4,
              "codeString": "SKIPPED",
              "message": "Document issuers doesn't have \\"tokenRegistry\\" property or TOKEN_REGISTRY method",
            },
            "status": "SKIPPED",
            "type": "DOCUMENT_STATUS",
          },
          Object {
            "data": Object {
              "details": Object {
                "issuance": Object {
                  "address": "0xA594f6e10564e87888425c7CC3910FE1c800aB0B",
                  "issued": true,
                },
                "revocation": Object {
                  "address": "0xA594f6e10564e87888425c7CC3910FE1c800aB0B",
                  "revoked": false,
                },
              },
              "issuedOnAll": true,
              "revokedOnAny": false,
            },
            "name": "OpenAttestationEthereumDocumentStoreStatus",
            "status": "VALID",
            "type": "DOCUMENT_STATUS",
          },
          Object {
            "name": "OpenAttestationDidSignedDocumentStatus",
            "reason": Object {
              "code": 0,
              "codeString": "SKIPPED",
              "message": "Document was not signed by DID directly",
            },
            "status": "SKIPPED",
            "type": "DOCUMENT_STATUS",
          },
          Object {
            "data": Object {
              "identifier": "example.tradetrust.io",
              "value": "0xA594f6e10564e87888425c7CC3910FE1c800aB0B",
            },
            "name": "OpenAttestationDnsTxtIdentityProof",
            "status": "VALID",
            "type": "ISSUER_IDENTITY",
          },
          Object {
            "name": "OpenAttestationDnsDidIdentityProof",
            "reason": Object {
              "code": 0,
              "codeString": "SKIPPED",
              "message": "Document was not issued using DNS-DID",
            },
            "status": "SKIPPED",
            "type": "ISSUER_IDENTITY",
          },
          Object {
            "name": "OpenAttestationDidIdentityProof",
            "reason": Object {
              "code": 0,
              "codeString": "SKIPPED",
              "message": "Document is not using DID as top level identifier or has not been wrapped",
            },
            "status": "SKIPPED",
            "type": "ISSUER_IDENTITY",
          },
        ]
      `);
      expect(valid).toBe(true);
    });
    it("should return valid fragments for document issued correctly with token registry & using DNS-TXT identity proof", async () => {
      const fragments = await verifySepolia(v4TokenRegistryIssued);
      const valid = isValid(fragments);
      expect(fragments).toMatchInlineSnapshot(`
        Array [
          Object {
            "data": true,
            "name": "OpenAttestationHash",
            "status": "VALID",
            "type": "DOCUMENT_INTEGRITY",
          },
          Object {
            "data": Object {
              "details": Array [
                Object {
                  "address": "0x71D28767662cB233F887aD2Bb65d048d760bA694",
                  "minted": true,
                },
              ],
              "mintedOnAll": true,
            },
            "name": "OpenAttestationEthereumTokenRegistryStatus",
            "status": "VALID",
            "type": "DOCUMENT_STATUS",
          },
          Object {
            "name": "OpenAttestationEthereumDocumentStoreStatus",
            "reason": Object {
              "code": 4,
              "codeString": "SKIPPED",
              "message": "Document issuers doesn't have \\"documentStore\\" or \\"certificateStore\\" property or DOCUMENT_STORE method",
            },
            "status": "SKIPPED",
            "type": "DOCUMENT_STATUS",
          },
          Object {
            "name": "OpenAttestationDidSignedDocumentStatus",
            "reason": Object {
              "code": 0,
              "codeString": "SKIPPED",
              "message": "Document was not signed by DID directly",
            },
            "status": "SKIPPED",
            "type": "DOCUMENT_STATUS",
          },
          Object {
            "data": Object {
              "identifier": "example.tradetrust.io",
              "value": "0x71D28767662cB233F887aD2Bb65d048d760bA694",
            },
            "name": "OpenAttestationDnsTxtIdentityProof",
            "status": "VALID",
            "type": "ISSUER_IDENTITY",
          },
          Object {
            "name": "OpenAttestationDnsDidIdentityProof",
            "reason": Object {
              "code": 0,
              "codeString": "SKIPPED",
              "message": "Document was not issued using DNS-DID",
            },
            "status": "SKIPPED",
            "type": "ISSUER_IDENTITY",
          },
          Object {
            "name": "OpenAttestationDidIdentityProof",
            "reason": Object {
              "code": 0,
              "codeString": "SKIPPED",
              "message": "Document is not using DID as top level identifier or has not been wrapped",
            },
            "status": "SKIPPED",
            "type": "ISSUER_IDENTITY",
          },
        ]
      `);
      expect(valid).toBe(true);
    });
    it("should return valid fragments for documents correctly issued but with data obfuscated", async () => {
      const obfuscated = obfuscate(v4DidSigned, ["reference"]);
      expect(obfuscated.reference).toBe(undefined);
      const fragments = await verifySepolia(obfuscated);
      const valid = isValid(fragments);
      expect(fragments).toMatchInlineSnapshot(`
        Array [
          Object {
            "data": true,
            "name": "OpenAttestationHash",
            "status": "VALID",
            "type": "DOCUMENT_INTEGRITY",
          },
          Object {
            "name": "OpenAttestationEthereumTokenRegistryStatus",
            "reason": Object {
              "code": 4,
              "codeString": "SKIPPED",
              "message": "Document issuers doesn't have \\"tokenRegistry\\" property or TOKEN_REGISTRY method",
            },
            "status": "SKIPPED",
            "type": "DOCUMENT_STATUS",
          },
          Object {
            "name": "OpenAttestationEthereumDocumentStoreStatus",
            "reason": Object {
              "code": 4,
              "codeString": "SKIPPED",
              "message": "Document issuers doesn't have \\"documentStore\\" or \\"certificateStore\\" property or DOCUMENT_STORE method",
            },
            "status": "SKIPPED",
            "type": "DOCUMENT_STATUS",
          },
          Object {
            "data": Object {
              "details": Object {
                "issuance": Object {
                  "did": "did:ethr:0xCA93690Bb57EEaB273c796a9309246BC0FB93649",
                  "issued": true,
                },
                "revocation": Object {
                  "revoked": false,
                },
              },
              "issuedOnAll": true,
              "revokedOnAny": false,
            },
            "name": "OpenAttestationDidSignedDocumentStatus",
            "status": "VALID",
            "type": "DOCUMENT_STATUS",
          },
          Object {
            "name": "OpenAttestationDnsTxtIdentityProof",
            "reason": Object {
              "code": 2,
              "codeString": "SKIPPED",
              "message": "Document issuers doesn't have \\"documentStore\\" / \\"tokenRegistry\\" property or doesn't use DNS-TXT type",
            },
            "status": "SKIPPED",
            "type": "ISSUER_IDENTITY",
          },
          Object {
            "name": "OpenAttestationDnsDidIdentityProof",
            "reason": Object {
              "code": 0,
              "codeString": "SKIPPED",
              "message": "Document was not issued using DNS-DID",
            },
            "status": "SKIPPED",
            "type": "ISSUER_IDENTITY",
          },
          Object {
            "data": Object {
              "did": "did:ethr:0xCA93690Bb57EEaB273c796a9309246BC0FB93649",
              "verified": true,
            },
            "name": "OpenAttestationDidIdentityProof",
            "status": "VALID",
            "type": "ISSUER_IDENTITY",
          },
        ]
      `);
      expect(valid).toBe(true);
    });

    it("should return the correct fragments even when process.env is used for out of the box verify for document with document store", async () => {
      // simulate loading process.env from .env file
      process.env.PROVIDER_NETWORK = "stability";
      process.env.PROVIDER_ENDPOINT_URL = "https://gtn.stabilityprotocol.com";
      const defaultBuilderOption = {
        network: process.env.PROVIDER_NETWORK || "homestead",
        provider: new ethers.providers.JsonRpcProvider(process.env.PROVIDER_ENDPOINT_URL),
      };
      const verification = verificationBuilder(openAttestationVerifiers, defaultBuilderOption);
      const fragments = await verification(v4DocumentStoreIssued);
      expect(fragments).toMatchInlineSnapshot(`
        Array [
          Object {
            "data": true,
            "name": "OpenAttestationHash",
            "status": "VALID",
            "type": "DOCUMENT_INTEGRITY",
          },
          Object {
            "name": "OpenAttestationEthereumTokenRegistryStatus",
            "reason": Object {
              "code": 4,
              "codeString": "SKIPPED",
              "message": "Document issuers doesn't have \\"tokenRegistry\\" property or TOKEN_REGISTRY method",
            },
            "status": "SKIPPED",
            "type": "DOCUMENT_STATUS",
          },
          Object {
            "data": Object {
              "details": Object {
                "issuance": Object {
                  "address": "0xA594f6e10564e87888425c7CC3910FE1c800aB0B",
                  "issued": true,
                },
                "revocation": Object {
                  "address": "0xA594f6e10564e87888425c7CC3910FE1c800aB0B",
                  "revoked": false,
                },
              },
              "issuedOnAll": true,
              "revokedOnAny": false,
            },
            "name": "OpenAttestationEthereumDocumentStoreStatus",
            "status": "VALID",
            "type": "DOCUMENT_STATUS",
          },
          Object {
            "name": "OpenAttestationDidSignedDocumentStatus",
            "reason": Object {
              "code": 0,
              "codeString": "SKIPPED",
              "message": "Document was not signed by DID directly",
            },
            "status": "SKIPPED",
            "type": "DOCUMENT_STATUS",
          },
          Object {
            "data": Object {
              "identifier": "example.tradetrust.io",
              "value": "0xA594f6e10564e87888425c7CC3910FE1c800aB0B",
            },
            "name": "OpenAttestationDnsTxtIdentityProof",
            "status": "VALID",
            "type": "ISSUER_IDENTITY",
          },
          Object {
            "name": "OpenAttestationDnsDidIdentityProof",
            "reason": Object {
              "code": 0,
              "codeString": "SKIPPED",
              "message": "Document was not issued using DNS-DID",
            },
            "status": "SKIPPED",
            "type": "ISSUER_IDENTITY",
          },
        ]
      `);
    });
    it("should use the defaults to connect to provider even when process.env is not there for document with document store", async () => {
      const defaultBuilderOption = {
        network: process.env.PROVIDER_NETWORK || "homestead",
      };
      const verification = verificationBuilder(openAttestationVerifiers, defaultBuilderOption);
      const fragments = await verification(v4DocumentStoreIssued);
      expect(fragments).toMatchInlineSnapshot(`
        Array [
          Object {
            "data": true,
            "name": "OpenAttestationHash",
            "status": "VALID",
            "type": "DOCUMENT_INTEGRITY",
          },
          Object {
            "name": "OpenAttestationEthereumTokenRegistryStatus",
            "reason": Object {
              "code": 4,
              "codeString": "SKIPPED",
              "message": "Document issuers doesn't have \\"tokenRegistry\\" property or TOKEN_REGISTRY method",
            },
            "status": "SKIPPED",
            "type": "DOCUMENT_STATUS",
          },
          Object {
            "data": Object {
              "details": Object {
                "issuance": Object {
                  "address": "0xA594f6e10564e87888425c7CC3910FE1c800aB0B",
                  "issued": false,
                  "reason": Object {
                    "code": 1,
                    "codeString": "DOCUMENT_NOT_ISSUED",
                    "message": "Contract is not found",
                  },
                },
                "revocation": Object {
                  "address": "0xA594f6e10564e87888425c7CC3910FE1c800aB0B",
                  "reason": Object {
                    "code": 5,
                    "codeString": "DOCUMENT_REVOKED",
                    "message": "Contract is not found",
                  },
                  "revoked": true,
                },
              },
              "issuedOnAll": false,
              "revokedOnAny": true,
            },
            "name": "OpenAttestationEthereumDocumentStoreStatus",
            "reason": Object {
              "code": 5,
              "codeString": "DOCUMENT_REVOKED",
              "message": "Contract is not found",
            },
            "status": "INVALID",
            "type": "DOCUMENT_STATUS",
          },
          Object {
            "name": "OpenAttestationDidSignedDocumentStatus",
            "reason": Object {
              "code": 0,
              "codeString": "SKIPPED",
              "message": "Document was not signed by DID directly",
            },
            "status": "SKIPPED",
            "type": "DOCUMENT_STATUS",
          },
          Object {
            "data": Object {
              "identifier": "example.tradetrust.io",
              "value": "0xA594f6e10564e87888425c7CC3910FE1c800aB0B",
            },
            "name": "OpenAttestationDnsTxtIdentityProof",
            "reason": Object {
              "code": 4,
              "codeString": "MATCHING_RECORD_NOT_FOUND",
              "message": "Matching DNS record not found for 0xA594f6e10564e87888425c7CC3910FE1c800aB0B",
            },
            "status": "INVALID",
            "type": "ISSUER_IDENTITY",
          },
          Object {
            "name": "OpenAttestationDnsDidIdentityProof",
            "reason": Object {
              "code": 0,
              "codeString": "SKIPPED",
              "message": "Document was not issued using DNS-DID",
            },
            "status": "SKIPPED",
            "type": "ISSUER_IDENTITY",
          },
        ]
      `);
    });
    it("should return the correct fragments when using process.env variables for did resolver", async () => {
      // simulate loading process.env from .env file
      process.env.PROVIDER_NETWORK = "stability";
      process.env.PROVIDER_ENDPOINT_URL = "https://gtn.stabilityprotocol.com";
      const defaultBuilderOption = {
        network: process.env.PROVIDER_NETWORK || "homestead",
        provider: new ethers.providers.JsonRpcProvider(process.env.PROVIDER_ENDPOINT_URL),
      };
      const verification = verificationBuilder(openAttestationVerifiers, defaultBuilderOption);
      const didFragments = await verification(v4DidSigned);
      const dnsDidFragments = await verification(v4DnsDidSigned);
      expect(didFragments).toMatchInlineSnapshot(`
        Array [
          Object {
            "data": true,
            "name": "OpenAttestationHash",
            "status": "VALID",
            "type": "DOCUMENT_INTEGRITY",
          },
          Object {
            "name": "OpenAttestationEthereumTokenRegistryStatus",
            "reason": Object {
              "code": 4,
              "codeString": "SKIPPED",
              "message": "Document issuers doesn't have \\"tokenRegistry\\" property or TOKEN_REGISTRY method",
            },
            "status": "SKIPPED",
            "type": "DOCUMENT_STATUS",
          },
          Object {
            "name": "OpenAttestationEthereumDocumentStoreStatus",
            "reason": Object {
              "code": 4,
              "codeString": "SKIPPED",
              "message": "Document issuers doesn't have \\"documentStore\\" or \\"certificateStore\\" property or DOCUMENT_STORE method",
            },
            "status": "SKIPPED",
            "type": "DOCUMENT_STATUS",
          },
          Object {
            "data": Object {
              "details": Object {
                "issuance": Object {
                  "did": "did:ethr:0xCA93690Bb57EEaB273c796a9309246BC0FB93649",
                  "issued": true,
                },
                "revocation": Object {
                  "revoked": false,
                },
              },
              "issuedOnAll": true,
              "revokedOnAny": false,
            },
            "name": "OpenAttestationDidSignedDocumentStatus",
            "status": "VALID",
            "type": "DOCUMENT_STATUS",
          },
          Object {
            "name": "OpenAttestationDnsTxtIdentityProof",
            "reason": Object {
              "code": 2,
              "codeString": "SKIPPED",
              "message": "Document issuers doesn't have \\"documentStore\\" / \\"tokenRegistry\\" property or doesn't use DNS-TXT type",
            },
            "status": "SKIPPED",
            "type": "ISSUER_IDENTITY",
          },
          Object {
            "name": "OpenAttestationDnsDidIdentityProof",
            "reason": Object {
              "code": 0,
              "codeString": "SKIPPED",
              "message": "Document was not issued using DNS-DID",
            },
            "status": "SKIPPED",
            "type": "ISSUER_IDENTITY",
          },
        ]
      `);
      expect(dnsDidFragments).toMatchInlineSnapshot(`
        Array [
          Object {
            "data": true,
            "name": "OpenAttestationHash",
            "status": "VALID",
            "type": "DOCUMENT_INTEGRITY",
          },
          Object {
            "name": "OpenAttestationEthereumTokenRegistryStatus",
            "reason": Object {
              "code": 4,
              "codeString": "SKIPPED",
              "message": "Document issuers doesn't have \\"tokenRegistry\\" property or TOKEN_REGISTRY method",
            },
            "status": "SKIPPED",
            "type": "DOCUMENT_STATUS",
          },
          Object {
            "name": "OpenAttestationEthereumDocumentStoreStatus",
            "reason": Object {
              "code": 4,
              "codeString": "SKIPPED",
              "message": "Document issuers doesn't have \\"documentStore\\" or \\"certificateStore\\" property or DOCUMENT_STORE method",
            },
            "status": "SKIPPED",
            "type": "DOCUMENT_STATUS",
          },
          Object {
            "data": Object {
              "details": Object {
                "issuance": Object {
                  "did": "did:ethr:0xCA93690Bb57EEaB273c796a9309246BC0FB93649",
                  "issued": true,
                },
                "revocation": Object {
                  "revoked": false,
                },
              },
              "issuedOnAll": true,
              "revokedOnAny": false,
            },
            "name": "OpenAttestationDidSignedDocumentStatus",
            "status": "VALID",
            "type": "DOCUMENT_STATUS",
          },
          Object {
            "name": "OpenAttestationDnsTxtIdentityProof",
            "reason": Object {
              "code": 2,
              "codeString": "SKIPPED",
              "message": "Document issuers doesn't have \\"documentStore\\" / \\"tokenRegistry\\" property or doesn't use DNS-TXT type",
            },
            "status": "SKIPPED",
            "type": "ISSUER_IDENTITY",
          },
          Object {
            "data": Object {
              "key": "did:ethr:0xCA93690Bb57EEaB273c796a9309246BC0FB93649#controller",
              "location": "example.tradetrust.io",
              "status": "VALID",
            },
            "name": "OpenAttestationDnsDidIdentityProof",
            "status": "VALID",
            "type": "ISSUER_IDENTITY",
          },
        ]
      `);
    });
  });
  describe("invalid documents", () => {
    describe("document store", () => {
      it("should return invalid fragments for documents that has been tampered", async () => {
        const tamperedDocument: TTv4.WrappedDocument = {
          ...v4DocumentStoreIssued,
          issuer: {
            ...v4DocumentStoreIssued.issuer,
            name: "DEMO STORE (TAMPERED)",
          },
        };
        const fragments = await verifySepolia(tamperedDocument);
        expect(isValid(fragments, ["DOCUMENT_STATUS"])).toStrictEqual(true);
        expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toStrictEqual(false);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
        expect(getFailingFragments(fragments)).toMatchInlineSnapshot(`
            Array [
              Object {
                "data": false,
                "name": "OpenAttestationHash",
                "reason": Object {
                  "code": 0,
                  "codeString": "DOCUMENT_TAMPERED",
                  "message": "Document has been tampered with",
                },
                "status": "INVALID",
                "type": "DOCUMENT_INTEGRITY",
              },
            ]
          `);
      });
      it("should return invalid fragments for document that has not been issued", async () => {
        const fragments = await verifySepolia(v4DocumentStoreWrapped);
        expect(isValid(fragments, ["DOCUMENT_STATUS"])).toStrictEqual(false);
        expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
        expect(getFailingFragments(fragments)).toMatchInlineSnapshot(`
                  Array [
                    Object {
                      "data": Object {
                        "details": Object {
                          "issuance": Object {
                            "address": "0xA594f6e10564e87888425c7CC3910FE1c800aB0B",
                            "issued": false,
                            "reason": Object {
                              "code": 1,
                              "codeString": "DOCUMENT_NOT_ISSUED",
                              "message": "Document 0xe894c33fde8ed9a826fdd99d83e6a2ff7f0d018a1cfe1414c5a5b343bfcf7b79 has not been issued under contract 0xA594f6e10564e87888425c7CC3910FE1c800aB0B",
                            },
                          },
                          "revocation": Object {
                            "address": "0xA594f6e10564e87888425c7CC3910FE1c800aB0B",
                            "revoked": false,
                          },
                        },
                        "issuedOnAll": false,
                        "revokedOnAny": false,
                      },
                      "name": "OpenAttestationEthereumDocumentStoreStatus",
                      "reason": Object {
                        "code": 1,
                        "codeString": "DOCUMENT_NOT_ISSUED",
                        "message": "Document 0xe894c33fde8ed9a826fdd99d83e6a2ff7f0d018a1cfe1414c5a5b343bfcf7b79 has not been issued under contract 0xA594f6e10564e87888425c7CC3910FE1c800aB0B",
                      },
                      "status": "INVALID",
                      "type": "DOCUMENT_STATUS",
                    },
                  ]
              `);
      });
      it("should return invalid fragments for document that has been revoked", async () => {
        const fragments = await verifySepolia(v4DocumentStoreRevoked);
        expect(isValid(fragments, ["DOCUMENT_STATUS"])).toStrictEqual(false);
        expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
        expect(getFailingFragments(fragments)).toMatchInlineSnapshot(`
                  Array [
                    Object {
                      "data": Object {
                        "details": Object {
                          "issuance": Object {
                            "address": "0xA594f6e10564e87888425c7CC3910FE1c800aB0B",
                            "issued": true,
                          },
                          "revocation": Object {
                            "address": "0xA594f6e10564e87888425c7CC3910FE1c800aB0B",
                            "reason": Object {
                              "code": 5,
                              "codeString": "DOCUMENT_REVOKED",
                              "message": "Document 0x1a4e7693fa42e5073aedceb79167ec87db2f1259afddd4cdae9e44ddaf8c35a9 has been revoked under contract 0xA594f6e10564e87888425c7CC3910FE1c800aB0B",
                            },
                            "revoked": true,
                          },
                        },
                        "issuedOnAll": true,
                        "revokedOnAny": true,
                      },
                      "name": "OpenAttestationEthereumDocumentStoreStatus",
                      "reason": Object {
                        "code": 5,
                        "codeString": "DOCUMENT_REVOKED",
                        "message": "Document 0x1a4e7693fa42e5073aedceb79167ec87db2f1259afddd4cdae9e44ddaf8c35a9 has been revoked under contract 0xA594f6e10564e87888425c7CC3910FE1c800aB0B",
                      },
                      "status": "INVALID",
                      "type": "DOCUMENT_STATUS",
                    },
                  ]
              `);
      });
      it("should return invalid fragments for documents that is using invalid DNS but correctly issued", async () => {
        const fragments = await verifySepolia(v4DocumentStoreInvalidIssued);
        expect(isValid(fragments, ["DOCUMENT_STATUS"])).toStrictEqual(true);
        expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(false);
        expect(getFailingFragments(fragments)).toMatchInlineSnapshot(`
          Array [
            Object {
              "data": Object {
                "identifier": "notinuse.tradetrust.io",
                "value": "0xA594f6e10564e87888425c7CC3910FE1c800aB0B",
              },
              "name": "OpenAttestationDnsTxtIdentityProof",
              "reason": Object {
                "code": 4,
                "codeString": "MATCHING_RECORD_NOT_FOUND",
                "message": "Matching DNS record not found for 0xA594f6e10564e87888425c7CC3910FE1c800aB0B",
              },
              "status": "INVALID",
              "type": "ISSUER_IDENTITY",
            },
          ]
        `);
      });
    });

    describe("token registry", () => {
      it("should return invalid fragments for documents that has been tampered", async () => {
        const tamperedDocument: TTv4.WrappedDocument = {
          ...v4TokenRegistryIssued,
          issuer: {
            ...v4TokenRegistryIssued.issuer,
            name: "DEMO STORE (TAMPERED)",
          },
        };
        const fragments = await verifySepolia(tamperedDocument);
        expect(isValid(fragments, ["DOCUMENT_STATUS"])).toStrictEqual(true);
        expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toStrictEqual(false);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
        expect(getFailingFragments(fragments)).toMatchInlineSnapshot(`
            Array [
              Object {
                "data": false,
                "name": "OpenAttestationHash",
                "reason": Object {
                  "code": 0,
                  "codeString": "DOCUMENT_TAMPERED",
                  "message": "Document has been tampered with",
                },
                "status": "INVALID",
                "type": "DOCUMENT_INTEGRITY",
              },
            ]
          `);
      });
      it("should return invalid fragments for document that has not been issued", async () => {
        const fragments = await verifySepolia(v4TokenRegistryWrapped);
        expect(isValid(fragments, ["DOCUMENT_STATUS"])).toStrictEqual(false);
        expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
        expect(getFailingFragments(fragments)).toMatchInlineSnapshot(`
          Array [
            Object {
              "data": Object {
                "details": Array [
                  Object {
                    "address": "0x71D28767662cB233F887aD2Bb65d048d760bA694",
                    "minted": false,
                    "reason": Object {
                      "code": 1,
                      "codeString": "DOCUMENT_NOT_MINTED",
                      "message": "Document has not been issued under token registry",
                    },
                  },
                ],
                "mintedOnAll": false,
              },
              "name": "OpenAttestationEthereumTokenRegistryStatus",
              "reason": Object {
                "code": 1,
                "codeString": "DOCUMENT_NOT_MINTED",
                "message": "Document has not been issued under token registry",
              },
              "status": "INVALID",
              "type": "DOCUMENT_STATUS",
            },
          ]
        `);
      });
      it("should return invalid fragments for documents that is using invalid DNS but correctly issued", async () => {
        const fragments = await verifySepolia(v4TokenRegistryInvalidIssued);
        expect(isValid(fragments, ["DOCUMENT_STATUS"])).toStrictEqual(true);
        expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(false);
        expect(getFailingFragments(fragments)).toMatchInlineSnapshot(`
          Array [
            Object {
              "data": Object {
                "identifier": "notinuse.tradetrust.io",
                "value": "0x71D28767662cB233F887aD2Bb65d048d760bA694",
              },
              "name": "OpenAttestationDnsTxtIdentityProof",
              "reason": Object {
                "code": 4,
                "codeString": "MATCHING_RECORD_NOT_FOUND",
                "message": "Matching DNS record not found for 0x71D28767662cB233F887aD2Bb65d048d760bA694",
              },
              "status": "INVALID",
              "type": "ISSUER_IDENTITY",
            },
          ]
        `);
      });
    });

    describe("did (DNS-DID)", () => {
      it("should return invalid fragments for documents that has been tampered", async () => {
        const tamperedDocument: TTv4.WrappedDocument = {
          ...v4DnsDidSigned,
          issuer: {
            ...v4DidSigned.issuer,
            id: "did:ethr:0xCA93690Bb57EEaB273c796a9309246BC0FB93649",
            name: "DEMO STORE (TAMPERED)",
          },
        };
        const fragments = await verifySepolia(tamperedDocument);
        expect(isValid(fragments, ["DOCUMENT_STATUS"])).toStrictEqual(true);
        expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toStrictEqual(false);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
        expect(getFailingFragments(fragments)).toMatchInlineSnapshot(`
          Array [
            Object {
              "data": false,
              "name": "OpenAttestationHash",
              "reason": Object {
                "code": 0,
                "codeString": "DOCUMENT_TAMPERED",
                "message": "Document has been tampered with",
              },
              "status": "INVALID",
              "type": "DOCUMENT_INTEGRITY",
            },
          ]
        `);
      });
      it("should return skipped fragments for documents that has not been signed", async () => {
        const fragments = await verifySepolia(v4DnsDidWrapped);
        expect(isValid(fragments, ["DOCUMENT_STATUS"])).toStrictEqual(false);
        expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(false);
        expect(getFragmentsByName(fragments, "OpenAttestationDnsDidIdentityProof")).toMatchInlineSnapshot(`
          Array [
            Object {
              "name": "OpenAttestationDnsDidIdentityProof",
              "reason": Object {
                "code": 0,
                "codeString": "SKIPPED",
                "message": "Document was not issued using DNS-DID",
              },
              "status": "SKIPPED",
              "type": "ISSUER_IDENTITY",
            },
          ]
        `);
      });
      it("should return invalid fragments for documents that is using invalid DNS but correctly signed", async () => {
        const fragments = await verifySepolia(v4DnsDidInvalidSigned);
        expect(isValid(fragments, ["DOCUMENT_STATUS"])).toStrictEqual(true);
        expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(false);
        expect(getFailingFragments(fragments)).toMatchInlineSnapshot(`
          Array [
            Object {
              "data": Object {
                "key": "did:ethr:0xCA93690Bb57EEaB273c796a9309246BC0FB93649#controller",
                "location": "notinuse.tradetrust.io",
                "status": "INVALID",
              },
              "name": "OpenAttestationDnsDidIdentityProof",
              "reason": Object {
                "code": 6,
                "codeString": "INVALID_IDENTITY",
                "message": "Could not find identity at location",
              },
              "status": "INVALID",
              "type": "ISSUER_IDENTITY",
            },
          ]
        `);
      });
      it("should return invalid fragments for documents that have been revoked", async () => {
        const fragments = await verifySepolia(v4DnsDidSignedRevocationStoreButRevoked);
        expect(isValid(fragments, ["DOCUMENT_STATUS"])).toStrictEqual(false);
        expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
        expect(getFailingFragments(fragments)).toMatchInlineSnapshot(`
          Array [
            Object {
              "data": Object {
                "details": Object {
                  "issuance": Object {
                    "address": "0xA594f6e10564e87888425c7CC3910FE1c800aB0B",
                    "issued": true,
                  },
                  "revocation": Object {
                    "address": "0xA594f6e10564e87888425c7CC3910FE1c800aB0B",
                    "reason": Object {
                      "code": 5,
                      "codeString": "DOCUMENT_REVOKED",
                      "message": "Document 0xba72a676070499901d67d8139506f0b383682d6ed782c858e71b45596080a315 has been revoked under contract 0xA594f6e10564e87888425c7CC3910FE1c800aB0B",
                    },
                    "revoked": true,
                  },
                },
                "issuedOnAll": true,
                "revokedOnAny": true,
              },
              "name": "OpenAttestationEthereumDocumentStoreStatus",
              "reason": Object {
                "code": 5,
                "codeString": "DOCUMENT_REVOKED",
                "message": "Document 0xba72a676070499901d67d8139506f0b383682d6ed782c858e71b45596080a315 has been revoked under contract 0xA594f6e10564e87888425c7CC3910FE1c800aB0B",
              },
              "status": "INVALID",
              "type": "DOCUMENT_STATUS",
            },
            Object {
              "data": Object {
                "details": Object {
                  "issuance": Object {
                    "did": "did:ethr:0xCA93690Bb57EEaB273c796a9309246BC0FB93649",
                    "issued": true,
                  },
                  "revocation": Object {
                    "address": "0xA594f6e10564e87888425c7CC3910FE1c800aB0B",
                    "reason": Object {
                      "code": 5,
                      "codeString": "DOCUMENT_REVOKED",
                      "message": "Document 0xba72a676070499901d67d8139506f0b383682d6ed782c858e71b45596080a315 has been revoked under contract 0xA594f6e10564e87888425c7CC3910FE1c800aB0B",
                    },
                    "revoked": true,
                  },
                },
                "issuedOnAll": true,
                "revokedOnAny": true,
              },
              "name": "OpenAttestationDidSignedDocumentStatus",
              "reason": Object {
                "code": 5,
                "codeString": "DOCUMENT_REVOKED",
                "message": "Document 0xba72a676070499901d67d8139506f0b383682d6ed782c858e71b45596080a315 has been revoked under contract 0xA594f6e10564e87888425c7CC3910FE1c800aB0B",
              },
              "status": "INVALID",
              "type": "DOCUMENT_STATUS",
            },
          ]
        `);
      });
    });

    describe("did (DID)", () => {
      it("should return invalid fragments for documents that has been tampered", async () => {
        const tamperedDocument: TTv4.WrappedDocument = {
          ...v4DidSigned,
          issuer: {
            ...v4DidSigned.issuer,
            id: "did:ethr:0xCA93690Bb57EEaB273c796a9309246BC0FB93649",
            name: "DEMO STORE (TAMPERED)",
          },
        };
        const fragments = await verifySepolia(tamperedDocument);
        expect(isValid(fragments, ["DOCUMENT_STATUS"])).toStrictEqual(true);
        expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toStrictEqual(false);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
        expect(getFailingFragments(fragments)).toMatchInlineSnapshot(`
          Array [
            Object {
              "data": false,
              "name": "OpenAttestationHash",
              "reason": Object {
                "code": 0,
                "codeString": "DOCUMENT_TAMPERED",
                "message": "Document has been tampered with",
              },
              "status": "INVALID",
              "type": "DOCUMENT_INTEGRITY",
            },
          ]
        `);
      });
      it("should return invalid fragments for documents that has not been signed", async () => {
        const fragments = await verifySepolia(v4DidWrapped);
        expect(isValid(fragments, ["DOCUMENT_STATUS"])).toStrictEqual(false);
        expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(false);
        expect(getFailingFragments(fragments)).toMatchInlineSnapshot(`
          Array [
            Object {
              "data": [Error: Document is not signed],
              "name": "OpenAttestationDidIdentityProof",
              "reason": Object {
                "code": 5,
                "codeString": "UNSIGNED",
                "message": "Document is not signed",
              },
              "status": "ERROR",
              "type": "ISSUER_IDENTITY",
            },
          ]
        `);
      });
      it("should return invalid fragments for documents that have been revoked", async () => {
        const fragments = await verifySepolia(v4DidSignedRevocationStoreButRevoked);
        expect(isValid(fragments, ["DOCUMENT_STATUS"])).toStrictEqual(false);
        expect(isValid(fragments, ["DOCUMENT_INTEGRITY"])).toStrictEqual(true);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
        expect(getFailingFragments(fragments)).toMatchInlineSnapshot(`
          Array [
            Object {
              "data": Object {
                "details": Object {
                  "issuance": Object {
                    "address": "0xA594f6e10564e87888425c7CC3910FE1c800aB0B",
                    "issued": true,
                  },
                  "revocation": Object {
                    "address": "0xA594f6e10564e87888425c7CC3910FE1c800aB0B",
                    "reason": Object {
                      "code": 5,
                      "codeString": "DOCUMENT_REVOKED",
                      "message": "Document 0x175f86a32ab8b6ab2acc7354919e820e685a41290d6b838b39216e31ece53178 has been revoked under contract 0xA594f6e10564e87888425c7CC3910FE1c800aB0B",
                    },
                    "revoked": true,
                  },
                },
                "issuedOnAll": true,
                "revokedOnAny": true,
              },
              "name": "OpenAttestationEthereumDocumentStoreStatus",
              "reason": Object {
                "code": 5,
                "codeString": "DOCUMENT_REVOKED",
                "message": "Document 0x175f86a32ab8b6ab2acc7354919e820e685a41290d6b838b39216e31ece53178 has been revoked under contract 0xA594f6e10564e87888425c7CC3910FE1c800aB0B",
              },
              "status": "INVALID",
              "type": "DOCUMENT_STATUS",
            },
            Object {
              "data": Object {
                "details": Object {
                  "issuance": Object {
                    "did": "did:ethr:0xCA93690Bb57EEaB273c796a9309246BC0FB93649",
                    "issued": true,
                  },
                  "revocation": Object {
                    "address": "0xA594f6e10564e87888425c7CC3910FE1c800aB0B",
                    "reason": Object {
                      "code": 5,
                      "codeString": "DOCUMENT_REVOKED",
                      "message": "Document 0x175f86a32ab8b6ab2acc7354919e820e685a41290d6b838b39216e31ece53178 has been revoked under contract 0xA594f6e10564e87888425c7CC3910FE1c800aB0B",
                    },
                    "revoked": true,
                  },
                },
                "issuedOnAll": true,
                "revokedOnAny": true,
              },
              "name": "OpenAttestationDidSignedDocumentStatus",
              "reason": Object {
                "code": 5,
                "codeString": "DOCUMENT_REVOKED",
                "message": "Document 0x175f86a32ab8b6ab2acc7354919e820e685a41290d6b838b39216e31ece53178 has been revoked under contract 0xA594f6e10564e87888425c7CC3910FE1c800aB0B",
              },
              "status": "INVALID",
              "type": "DOCUMENT_STATUS",
            },
          ]
        `);
      });
    });
  });
});
