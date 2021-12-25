// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const needle = require("needle");
const token = process.env.TWITTER_API_BEARER_TOKEN;
const endpointURL = "https://api.twitter.com/2/tweets?ids=";
const uploadUrl = `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`;
const expiration = 60 * 5;
const userId = "1473736396301033488";
var OAuth = require("oauth");
var Twit = require("twit");

var T = new Twit({
  consumer_key: process.env.TWITTER_API_KEY,
  consumer_secret: process.env.TWITTER_API_KEY_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

var twitterConsumerKey = process.env.TWITTER_API_KEY;
var twitterConsumerSecret = process.env.TWITTER_API_KEY_SECRET;

var oauth = new OAuth.OAuth(
  "https://api.twitter.com/oauth/request_token",
  "https://api.twitter.com/oauth/access_token",
  twitterConsumerKey,
  twitterConsumerSecret,
  "1.0A",
  null,
  "HMAC-SHA1"
);

export async function respondToMention(referencedTweetId, img) {
  const data = await uploadImageFromBuffer(img);
  var mediaIdStr = data.media_id_string;
  oauth.post(
    "https://api.twitter.com/2/tweets",
    process.env.TWITTER_ACCESS_TOKEN,
    process.env.TWITTER_ACCESS_TOKEN_SECRET,
    JSON.stringify({
      reply: {
        in_reply_to_tweet_id: referencedTweetId,
      },
      media: {
        media_ids: [mediaIdStr],
      },
      text: `lmao`,
    }),
    "application/json",
    function (e, data, res) {
      if (e) console.error(e);
      console.log(require("util").inspect(data));
    }
  );
}

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
    const imageUrl =
      apiResult.body.includes.media[0].url ||
      apiResult.body.includes.media[0].preview_image_url;
    return imageUrl;
  } else {
    console.log("Error", apiResult.body);
  }
  return null;
}

export async function uploadImageFromUrl(imageUrl, tweetId) {
  const extension = imageUrl.split(".").pop();
  const uploadRes = await needle(
    "POST",
    `${uploadUrl}&image=${imageUrl}&expiration=${expiration}&name=${tweetId}`
  );
  console.log("uploadRes", uploadRes.body);
  return uploadRes.body.data.url;
}

export async function getUserMentions() {
  let userMentions = [];
  let params = {
    max_results: 5,
    "tweet.fields": "created_at,referenced_tweets",
  };

  const options = {
    headers: {
      "User-Agent": "v2UserMentionssJS",
      authorization: `Bearer ${token}`,
    },
  };

  const resp = await needle(
    "get",
    `https://api.twitter.com/2/users/${userId}/mentions`,
    params,
    options
  );
  if (
    resp &&
    resp.body &&
    resp.body.meta &&
    resp.body.meta.result_count &&
    resp.body.meta.result_count > 0
  ) {
    if (resp.body.data) {
      userMentions = resp.body.data;
    }
    console.dir(userMentions, {
      depth: null,
    });
    console.log(`Got ${userMentions.length} mentions for user ID ${userId}!`);
  }
  return userMentions;
}

export async function getUserTweets() {
  let tweets = [];
  let params = {
    max_results: 5,
    "tweet.fields": "created_at,referenced_tweets",
  };

  const options = {
    headers: {
      "User-Agent": "v2UserTweetsJS",
      authorization: `Bearer ${token}`,
    },
  };

  const resp = await needle(
    "get",
    `https://api.twitter.com/2/users/${userId}/tweets`,
    params,
    options
  );
  if (
    resp &&
    resp.body &&
    resp.body.meta &&
    resp.body.meta.result_count &&
    resp.body.meta.result_count > 0
  ) {
    if (resp.body.data) {
      tweets = resp.body.data;
    }
    console.dir(tweets, {
      depth: null,
    });
    console.log(`Got ${tweets.length} mentions for user ID ${userId}!`);
  }
  return tweets;
}

export function uploadImageFromBuffer(img) {
  return new Promise((resolve, reject) => {
    T.post(
      "media/upload",
      { media_data: img.toString("base64") },
      function (err, data, response) {
        if (err) {
          console.log("error", err);
          return reject(err);
        }
        console.log("data", data);
        return resolve(data);
      }
    );
  });
}
