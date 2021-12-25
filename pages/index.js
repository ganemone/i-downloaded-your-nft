import Head from "next/head";
import TweetForm from "../components/tweet-form";
import styles from "../styles/Home.module.css";
import needle from "needle";

// const baseURL = process.env.BASE_URL;

export default function Home(props) {
  let { url } = props;
  if (!url) {
    return <TweetForm />;
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>I downloaded your nft</title>
        <meta
          name="description"
          content="An application to troll crypto bros on twitter"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>I downloaded your NFT lmao</h1>
        <img src={url} alt="Dumb NFT" width="500" height="500" />
      </main>
    </div>
  );
}

export async function getServerSideProps({ query }) {
  let { tweetId } = query;
  if (tweetId) {
    if (tweetId.endsWith("/")) {
      tweetId = tweetId.substring(0, tweetId.length - 1);
    }
    tweetId = tweetId.split("/").pop();
    const res = await needle(
      "POST",
      `https://www.i-downloaded-your-nft.com/api/download`,
      { tweetId }
    );
    return {
      props: {
        url: res.body.url,
      },
    };
  }
  return {
    props: {
      url: null,
    },
  };
}
