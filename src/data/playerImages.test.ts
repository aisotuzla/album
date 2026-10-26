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

  it("preserves established filenames for legacy card image names", () => {
    expect(getPlayerIpfsUrls("Pi_dzeko.webp")[0]).toContain("/players/dzeko.webp");
    expect(getPlayerIpfsUrls("Pi_Demirovic.webp")[0]).toContain("/players/Demirovic.webp");
    expect(getPlayerIpfsUrls("Pi_dedic.webp")[0]).toContain("/players/dedic.webp");
  });

  it("uses original legacy filenames in the fallback IPFS mirror", () => {
    expect(getPlayerIpfsUrls("Pi_dzeko.webp")[2]).toContain("/players/Pi_dzeko.webp");
    expect(getPlayerIpfsUrls("Pi_Demirovic.webp")[2]).toContain("/players/Pi_Demirovic.webp");
    expect(getPlayerIpfsUrls("Pi_dedic.webp")[2]).toContain("/players/Pi_dedic.webp");
  });

  it("returns no remote URLs for a missing filename", () => {
    expect(getPlayerIpfsUrls()).toEqual([]);
  });
});
