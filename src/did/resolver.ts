import { DIDDocument, Resolver, ResolverRegistry, VerificationMethod } from "did-resolver";
import { getResolver as ethrGetResolver } from "ethr-did-resolver";
import { getResolver as webGetResolver } from "web-did-resolver";
import NodeCache from "node-cache";
import { INFURA_API_KEY } from "../config";
import { generateProvider } from "../common/utils";
import { providerType } from "../types/core";

export interface EthrResolverConfig {
  networks: Array<{
    name: string;
    registry?: string;
    rpcUrl: string;
  }>;
}

const buildConfigFromProvider = (provider: any): EthrResolverConfig | undefined => {
  const rpcUrl = provider?.connection?.url || "";
  const rawName = provider?._network?.name;
  const networkName = rawName === "homestead" ? "mainnet" : rawName || "";
  if (!rpcUrl || !networkName) return undefined;
  return { networks: [{ name: networkName, rpcUrl }] };
};

export const getProviderConfig = (): EthrResolverConfig => {
  return (
    buildConfigFromProvider(generateProvider()) ?? {
      networks: [{ name: "mainnet", rpcUrl: `https://mainnet.infura.io/v3/${INFURA_API_KEY}` }],
    }
  );
};

export const getFallbackConfig = (): EthrResolverConfig => {
  const primary = (process.env.PROVIDER_ENDPOINT_TYPE as providerType) || "infura";
  const fallbackType: providerType = primary === "alchemy" ? "infura" : "alchemy";
  const network = process.env.PROVIDER_NETWORK || "homestead";
  const apiKey = fallbackType === "infura" ? process.env.INFURA_API_KEY || "" : process.env.ALCHEMY_API_KEY || "";

  const provider = generateProvider({ providerType: fallbackType, network, apiKey });
  const config = buildConfigFromProvider(provider);
  if (!config) throw new Error(`Unable to build fallback resolver config for provider type "${fallbackType}"`);
  return config;
};

const didResolutionCache = new NodeCache({ stdTTL: 5 * 60 }); // 5 min

const defaultResolver = new Resolver({
  ...(ethrGetResolver(getProviderConfig()) as ResolverRegistry),
  ...(webGetResolver() as ResolverRegistry),
});

const fallbackResolver = new Resolver({
  ...(ethrGetResolver(getFallbackConfig()) as ResolverRegistry),
  ...(webGetResolver() as ResolverRegistry),
});

export const createResolver = ({ ethrResolverConfig }: { ethrResolverConfig?: EthrResolverConfig }): Resolver => {
  const resolverRegistry: ResolverRegistry = {
    ...(ethrGetResolver(ethrResolverConfig ?? {}) as ResolverRegistry),
    ...(webGetResolver() as ResolverRegistry),
  };
  return ethrResolverConfig ? new Resolver(resolverRegistry) : defaultResolver;
};

export const resolve = async (didUrl: string, resolver?: Resolver): Promise<DIDDocument | undefined> => {
  const cachedResult = didResolutionCache.get<DIDDocument>(didUrl);
  if (cachedResult) return cachedResult;

  const primary = resolver ?? defaultResolver;
  let didResolutionResult;
  try {
    didResolutionResult = await primary.resolve(didUrl);
    if (!didResolutionResult.didDocument) throw new Error("Empty didDocument from primary resolver");
  } catch {
    didResolutionResult = await fallbackResolver.resolve(didUrl);
  }

  const did = didResolutionResult.didDocument || undefined;
  didResolutionCache.set(didUrl, did);
  return did;
};

export const getVerificationMethod = async (
  did: string,
  key: string,
  resolver?: Resolver
): Promise<VerificationMethod | undefined> => {
  const didDocument = await resolve(did, resolver);
  if (!didDocument) return;
  return didDocument.verificationMethod?.find((k) => k.id.toLowerCase() === key.toLowerCase());
};
