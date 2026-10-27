import { describe, expect, it } from "vitest";
import { getPlayerIpfsUrls } from "./playerImages";

describe("getPlayerIpfsUrls", () => {
  it("returns the primary URL, a distinct backup CID, and fallback gateway", () => {
    expect(getPlayerIpfsUrls("nikola-vasilj.webp")).toEqual([
      "https://black-known-amphibian-995.mypinata.cloud/ipfs/bafybeiagaakoykbdpfi2u6qvm7uaijzirgrvat5xvuowwn63ceq5mvjmru/components/players/nikola-vasilj.webp",
      "https://bafybeias3nraryezim72augovtpuful6iuriemqux5qrnyw5gl3buh5aua.ipfs.dweb.link/components/players/nikola-vasilj.webp",
      "https://gateway.pinata.cloud/ipfs/bafybeigu6pd4t72n7dskbn5wpk5pphf2566xixx5fugw3xhc3cyt44tumy/components/players/nikola-vasilj.webp",
    ]);
  });

  it("uses the current player image filenames across IPFS gateways", () => {
    for (const imageFile of ["edin-dzeko.webp", "amar-dedic.webp", "ermedin-Demirovic.webp"]) {
      expect(getPlayerIpfsUrls(imageFile).every((url) => url.endsWith(`/players/${imageFile}`))).toBe(true);
    }
  });

  it("returns no remote URLs for a missing filename", () => {
    expect(getPlayerIpfsUrls()).toEqual([]);
  });
});
