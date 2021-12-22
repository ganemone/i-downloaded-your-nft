const fs = require("fs");
// const { getUserMentions, getUserTweets } = require("../../src/api");

export default async function handler(req, res) {
  fs.writeFileSync("test.txt", "Hello World!");
  const result = fs.readFileSync("test.txt").toString();
  fs.unlinkSync("test.txt");
  res.status(200).end(result);
  // const [mentions, tweets] = await Promise.all([
  //   getUserMentions(),
  //   getUserTweets(),
  // ]);
  // // find mentions which are not listed in tweets
  // const missingMentions = mentions
  //   .filter((mention) => Array.isArray(mention.referenced_tweets))
  //   .filter((mention) => {
  //     const mentionedTweetId = mention.referenced_tweets[0].id;
  //     return !tweets.find(
  //       (tweet) =>
  //         Array.isArray(tweet.referenced_tweets) &&
  //         tweet.referenced_tweets.find((tweet) => tweet.id === mentionedTweetId)
  //     );
  //   });

  // missingMentions.forEach((mention) => {
  //   // trigger image + reply
  // });
  res.end();
}
