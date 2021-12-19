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
  const imageUrl = await getMediaFromTweet(tweetId);
  if (imageUrl) {
    await uploadImageFromUrl(imageUrl, tweetId);
    return res.status(200).end();
  } else {
    return res.status(500).end();
  }
}
