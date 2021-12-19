import Head from "next/head";
import Image from "next/image";
import TweetForm from "../components/tweet-form";
import styles from "../styles/Home.module.css";
import needle from "needle";

export default function Home(props) {
  let { name, tweetId } = props;
  if (!tweetId) {
    return <TweetForm />;
  }
  if (!name) {
    name = "Random Internet Person";
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
        <h2>
          Hello! My name is <i>{name}</i> and I downloaded your NFT lmao
        </h2>
        <Image
          src={`https://i.ibb.co/ss2FZZp/${tweetId}.jpg`}
          alt="Dumb NFT"
          width="500"
          height="500"
        />
      </main>
    </div>
  );
}

export async function getServerSideProps({ query }) {
  let { name, tweetId } = query;
  if (tweetId) {
    if (tweetId.endsWith("/")) {
      tweetId = tweetId.substring(0, tweetId.length - 1);
    }
    tweetId = tweetId.split("/").pop();
    await needle("POST", "localhost:3000/api/download", { tweetId });
  }
  return {
    props: {
      name: name || "Random Internet Person",
      tweetId: tweetId || null,
    },
  };
}
