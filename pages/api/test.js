const {
  getUserMentions,
  getUserTweets,
  respondToMention,
} = require("../../src/api");
const puppeteer = require("puppeteer");

export default async function handler(req, res) {
  const [mentions, tweets] = await Promise.all([
    getUserMentions(),
    getUserTweets(),
  ]);
  // find mentions which are not listed in tweets
  const missingMentions = mentions
    .filter((mention) => Array.isArray(mention.referenced_tweets))
    .filter((mention) => {
      const mentionedTweetId = mention.referenced_tweets[0].id;
      return !tweets.find(
        (tweet) =>
          Array.isArray(tweet.referenced_tweets) &&
          tweet.referenced_tweets.find((tweet) => tweet.id === mentionedTweetId)
      );
    });

  for (const mention of missingMentions) {
    const referencedTweetId = mention.referenced_tweets[0].id;
    const url = `https://i-downloaded-your-nft.com?tweetId=${referencedTweetId}`;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const img = await page.screenshot({ fullPage: true });
    await respondToMention(referencedTweetId, img);
    await browser.close();
  }
  res.end();
}
