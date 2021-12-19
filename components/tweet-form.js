import React from "react";
import styles from "../styles/Home.module.css";

export default function TweetForm() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h2>Lets troll some crypto bros. Enter a link to a tweet below</h2>
        <form
          method="GET"
          action="/"
          onSubmit={(e) => {
            const tweetId = e.target.elements.tweetId.value;
            if (tweetId.endsWith("/")) {
              tweetId = tweetId.substring(0, tweetId.length - 1);
            }
            tweetId = tweetId.split("/").pop();
            e.target.elements.tweetId.value = tweetId;
            return true;
          }}
        >
          <input
            type="text"
            name="tweetId"
            placeholder="https://twitter.com/user/status/123456789 or 123456789"
            size={100}
          />
          <input
            type="text"
            name="name"
            placeholder="Your name (optional)"
            size={100}
          />
          <button type="submit">Submit</button>
        </form>
      </main>
    </div>
  );
}
