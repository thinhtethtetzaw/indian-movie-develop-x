import RC4Decrypt from "./rc4Decrypt";

// Initialize with your RC4 key (you'll need to expose this from your backend)
const rc4Decrypt = new RC4Decrypt("xhKZCWzbm4sBXj2QIJ"); // Use your actual key

// Example usage with your API response
const decryptEpisodeUrl = (encryptedHex: string) => {
  try {
    return rc4Decrypt.decrypt(encryptedHex);
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
};

// Process your vod_play_url data
export const processEpisodes = (vodPlayUrl: { [key: string]: string }[]) => {
  return vodPlayUrl.map((episode) => {
    const episodeKey = Object.keys(episode)[0];
    if (episodeKey === undefined) {
      throw new Error("Episode object is empty");
    }
    const encryptedValue = episode[episodeKey];
    if (encryptedValue === undefined) {
      throw new Error(`Episode object is missing key: ${episodeKey}`);
    }
    const decryptedUrl = decryptEpisodeUrl(encryptedValue);

    return {
      episode: episodeKey,
      url: decryptedUrl,
    };
  });
};
