const PRIMARY_IPFS_CID = "bafybeiagaakoykbdpfi2u6qvm7uaijzirgrvat5xvuowwn63ceq5mvjmru";
const BACKUP_IPFS_CID = "bafybeias3nraryezim72augovtpuful6iuriemqux5qrnyw5gl3buh5aua";
const FALLBACK_IPFS_CID = "bafybeigu6pd4t72n7dskbn5wpk5pphf2566xixx5fugw3xhc3cyt44tumy";
const PRIMARY_IPFS_GATEWAY = "https://black-known-amphibian-995.mypinata.cloud";

export function getPlayerIpfsUrls(imageFile?: string): string[] {
  if (!imageFile) return [];

  return [
    `${PRIMARY_IPFS_GATEWAY}/ipfs/${PRIMARY_IPFS_CID}/components/players/${imageFile}`,
    `https://${BACKUP_IPFS_CID}.ipfs.dweb.link/components/players/${imageFile}`,
    `https://gateway.pinata.cloud/ipfs/${FALLBACK_IPFS_CID}/components/players/${imageFile}`,
  ];
}
