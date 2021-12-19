// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { getMediaFromTweet, uploadImageFromUrl } = require("../../src/api");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }
  if (!req.body) {
    return res.status(400).end();
  }
  const { tweetId } = req.body;
  console.log("tweetId", tweetId);
  const imageUrl = await getMediaFromTweet(tweetId);
  console.log("imageUrl", imageUrl);
  if (imageUrl) {
    const hostedUrl = await uploadImageFromUrl(imageUrl, tweetId);
    console.log("hostedUrl", hostedUrl);
    return res.status(200).json({ url: hostedUrl });
  } else {
    return res.status(500).end();
  }
}
