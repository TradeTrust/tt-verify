import { BbsBlsSignature2020 } from "@mattrglobal/jsonld-signatures-bbs";
import { TTv4 } from "@tradetrust-tt/tradetrust";
import { Bitstring } from "@transmute/compressable-bitstring";
import fetch from "cross-fetch";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jsonldSignatures = require("jsonld-signatures");
export type IdentityVCData = TTv4.IdentityVCData;

export const getRevokeStatus = async (signedVC: IdentityVCData) => {
  const encoded = await getEncodedList(signedVC);
  return await checkRevokeStatus(encoded, signedVC?.credentialStatus?.statusListIndex);
};

const getEncodedList = async (signedVC: IdentityVCData): Promise<string> => {
  const url = signedVC?.credentialStatus?.id;

  if (!url) throw new Error("url is not defined");

  try {
    const results = await fetch(url, { redirect: "follow" });
    const cs = await results.json();

    const verifiedCS = await verify(cs);
    if (verifiedCS.verified) {
      return cs.credentialSubject.encodedList;
    } else {
      throw new Error("failed to verify credential status");
    }
  } catch (e: any) {
    throw new Error(e);
  }
};

async function checkRevokeStatus(encoded: string, listIndex: number) {
  const decodedList = await Bitstring.decodeBits({ encoded });
  const bitstring = new Bitstring({ buffer: decodedList });
  const result = bitstring.get(listIndex);
  return result;
}

export const verify = async (signedDocument: IdentityVCData) => {
  if (signedDocument?.type?.includes("VerifiableCredential")) {
    return verifyCredential(signedDocument);
  } else if (signedDocument?.type?.includes("VerifiablePresentation")) {
    throw new Error(`IDVC type: ${JSON.stringify(signedDocument?.type)} not implemented`);
  } else {
    throw new Error(`IDVC type: ${JSON.stringify(signedDocument?.type)} not supported`);
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const verifyCredential = async (credential: IdentityVCData, customDocuments: any = []) => {
  const documentLoader = await getDocumentLoader();

  return await jsonldSignatures.verify(credential, {
    suite: new BbsBlsSignature2020(),
    purpose: new jsonldSignatures.purposes.AssertionProofPurpose(),
    documentLoader,
  });
};

/**
 * [Get Document Loader]
 * @param  {[String]} url [context url]
 * @return {[Object]}      [documentloader]
 */
async function getDocumentLoader() {
  const customDocLoader = async (url: string) => {
    if (url.includes("did:")) {
      if (url.includes("#")) {
        url = url.slice(0, url.indexOf("#"));
      }
      const id = url.split(":");
      const path = id.map(decodeURIComponent).join("/") + "/.well-known/did.json";
      url = path.replace("did/web/", "https://");
    }
    try {
      const results = await fetch(url, { redirect: "follow" });

      const resolveContext = {
        contextUrl: null,
        document: await results.json(),
        documentUrl: results.url,
      };

      return resolveContext;
    } catch (e: any) {
      throw new Error(e);
    }
  };
  return jsonldSignatures.extendContextLoader(customDocLoader);
}
