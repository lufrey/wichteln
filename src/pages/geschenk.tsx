import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { data } = trpc.account.getAllNames.useQuery();
  const { data: buddy } = trpc.account.getBuddy.useQuery();

  const [giftBuddy, setGiftBuddy] = useState('????');


  useEffect(() => {
    if (!data) return;

    let index = 0;
    const interval = setInterval(() => {
      setGiftBuddy(data[index]?.name ?? '????');
      index = (index + 1) % data.length;
    }, 100)

    const timeout = setTimeout(() => {
      clearInterval(interval);
      if (!buddy?.name) return;
      setGiftBuddy(buddy.name);
    }, 3000)

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    }
  }, [data, buddy?.name]);

  return (
    <>
      <Head>
        <title>Umweltinformatik - Wichteln</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-8 md:px-4 py-16 ">
          <div>
            <div className="text-2xl text-white text-center">
              Dein Geschenkbuddy ist: <span className="text-[hsl(280,100%,70%)]"></span>
            </div>
            <h1 className="text-center text-5xl font-extrabold tracking-tight mt-6 text-white sm:text-[5rem]">
              <span className="text-[hsl(280,100%,70%)]">{giftBuddy}</span>
              <br />
              <span className="block mt-4">🎁🎄💐</span>
            </h1>
          </div>

          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
            href="/"
          >
            <h3 className="text-2xl font-bold">Zur Startseite →</h3>
          </Link>
        </div>
      </main>
    </>
  );
};

export default Home;
