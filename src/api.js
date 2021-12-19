// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const needle = require("needle");
const token = process.env.TWITTER_API_BEARER_TOKEN;
const endpointURL = "https://api.twitter.com/2/tweets?ids=";
const uploadUrl = `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`;
const expiration = 2678400; // 1 month

export async function getMediaFromTweet(tweetId) {
  const params = {
    ids: tweetId,
    expansions: "attachments.poll_ids,attachments.media_keys",
    "media.fields": "media_key,url,preview_image_url",
    "tweet.fields": "lang,author_id,attachments,entities",
    "user.fields": "created_at",
  };

  const apiResult = await needle("get", endpointURL, params, {
    headers: {
      "User-Agent": "v2TweetLookupJS",
      authorization: `Bearer ${token}`,
    },
  });
  if (
    apiResult.body &&
    apiResult.body.includes &&
    Array.isArray(apiResult.body.includes.media)
  ) {
    const imageUrl = apiResult.body.includes.media[0].url;
    return imageUrl;
  } else {
    console.log("Error", apiResult.body);
  }
  return null;
}

export async function uploadImageFromUrl(imageUrl, tweetId) {
  const extension = imageUrl.split(".").pop();
  const hasImageResponse = await needle(
    "HEAD",
    `https://i.ibb.co/ss2FZZp/${tweetId}.${extension}`
  );
  if (hasImageResponse.statusCode === 200) {
    return;
  } else {
    const uploadRes = await needle(
      "POST",
      `${uploadUrl}&image=${imageUrl}&expiration=${expiration}&name=${tweetId}`
    );
    console.log("uploadRes", uploadRes.body);
    return;
  }
}
