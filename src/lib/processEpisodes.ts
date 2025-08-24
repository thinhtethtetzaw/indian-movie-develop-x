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

export const groupEpisodes = (
  episodes: { [key: string]: string }[],
  itemsPerGroup: number,
) => {
  const processedEpisodes = processEpisodes(episodes).map((e, index) => ({
    id: index + 1,
    title: e.episode,
    url: e.url,
  }));

  const seasons = [];
  for (let i = 0; i < processedEpisodes.length; i += itemsPerGroup) {
    const seasonEpisodes = processedEpisodes.slice(i, i + itemsPerGroup);
    const seasonNumber = Math.floor(i / itemsPerGroup) + 1;

    seasons.push({
      id: seasonNumber,
      title: `Season ${seasonNumber.toString().padStart(2, "0")}`,
      episodes: seasonEpisodes.map((episode, episodeIndex) => ({
        id: episodeIndex + 1,
        title: episode.title,
        url: episode.url || "",
      })),
    });
  }
  return seasons;
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
