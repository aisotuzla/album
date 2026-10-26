const PRIMARY_IPFS_CID = "bafybeiagaakoykbdpfi2u6qvm7uaijzirgrvat5xvuowwn63ceq5mvjmru";
const BACKUP_IPFS_CID = "bafybeias3nraryezim72augovtpuful6iuriemqux5qrnyw5gl3buh5aua";
const FALLBACK_IPFS_CID = "bafybeigu6pd4t72n7dskbn5wpk5pphf2566xixx5fugw3xhc3cyt44tumy";
const PRIMARY_IPFS_GATEWAY = "https://black-known-amphibian-995.mypinata.cloud";

const IPFS_FILENAME_MAP: Record<string, string> = {
  "Pi_dedic.webp": "dedic.webp",
  "Pi_Demirovic.webp": "Demirovic.webp",
  "Pi_dzeko.webp": "dzeko.webp",
};

export function getPlayerIpfsUrls(imageFile?: string): string[] {
  if (!imageFile) return [];

  const fileName = IPFS_FILENAME_MAP[imageFile] ?? imageFile;
  return [
    `${PRIMARY_IPFS_GATEWAY}/ipfs/${PRIMARY_IPFS_CID}/components/players/${fileName}`,
    `https://${BACKUP_IPFS_CID}.ipfs.dweb.link/components/players/${fileName}`,
    `https://gateway.pinata.cloud/ipfs/${FALLBACK_IPFS_CID}/components/players/${imageFile}`,
  ];
}
