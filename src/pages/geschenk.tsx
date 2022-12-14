import { zodResolver } from "@hookform/resolvers/zod";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import Countdown from 'react-countdown';
import { useForm } from "react-hook-form";
import { getUserSchema } from "../types/account";

import { trpc } from "../utils/trpc";
import { getEmailFromLocalstorage, saveEmailToLocalstorage } from "../utils/utils";

const Home: NextPage = () => {
  const [email, setEmail] = useState(getEmailFromLocalstorage);

  const { data: names } = trpc.account.getAllNames.useQuery();
  const { data: buddyData } = trpc.account.getBuddy.useQuery({ email });

  const [giftBuddy, setGiftBuddy] = useState('????');

  const { data: user } = trpc.account.getAccount.useQuery({ email }, { enabled: !!email });

  useEffect(() => {
    if (!names || !buddyData?.buddy?.name) return;

    let interval: ReturnType<typeof setInterval>;
    let timeout: ReturnType<typeof setTimeout>;

    let runRotationTimeoutDuration = 0;
    if (Date.now() < buddyData?.endTime) {
      runRotationTimeoutDuration = buddyData?.endTime - Date.now();
    }

    const runRotationTimeout = setTimeout(() => {
      let index = 0;
      interval = setInterval(() => {
        setGiftBuddy(names[index]?.name ?? '????');
        index = (index + 1) % names.length;
      }, 100)

      timeout = setTimeout(() => {
        clearInterval(interval);
        if (!buddyData.buddy?.name) return;
        setGiftBuddy(buddyData.buddy.name);
      }, 3000)
    }, runRotationTimeoutDuration);


    return () => {
      clearTimeout(runRotationTimeout);
      clearInterval(interval);
      clearTimeout(timeout);
    }
  }, [names, buddyData?.buddy?.name, buddyData?.endTime, user?.name, email]);


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(getUserSchema),
  })

  return (
    <>
      <Head>
        <title>Umweltinformatik - Wichteln</title>
        <meta name="description" content="Umweltinformatik - Wichteln" />
        <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=5,user-scalable=no" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-8 md:px-4 py-16 ">
          <div>
            {user?.name || (buddyData?.endTime ?? Date.now() + 10) > Date.now() ?
              <BuddyCountdown endTime={buddyData?.endTime ?? Date.now()} giftBuddy={giftBuddy} /> :
              <div className="text-white text-2xl max-w-sm text-center">Bitte logge dich ein um deinen Geschenk-Buddy herauszufinden</div>}
          </div>

          {user?.name ? <div className="text-white/60">Bist du {user.name}? Falls nein, dann klicke <span className="underline cursor-pointer" onClick={() => {
            saveEmailToLocalstorage('');
            setEmail('');
          }}>hier</span></div> : null}
        </div>
        {user?.name ? null : <form className="flex flex-col gap-6 text-white text-2xl" onSubmit={handleSubmit(details => {
          setEmail(details.email);
          saveEmailToLocalstorage(details.email);
          reset();
        })}>

          <div>
            <label htmlFor="email" className="block ">E-Mail</label>
            <input id="email" className="px-2 w-full rounded-md mt-2 bg-white/10 outline-none" type="text" {...register("email")} />
            {errors.email?.message && <div className="text-sm mt-2">{`${errors.email?.message ?? ''}`}</div>}
          </div>
          <button type="submit" className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors">Einloggen</button>
        </form>}
        <Link
          className="flex max-w-xs flex-col gap-4 mt-16 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
          href="/"
        >
          <h3 className="text-2xl font-bold">Zur Startseite ???</h3>
        </Link>
      </main>
    </>
  );
};


const BuddyCountdown: React.FC<{ endTime: number, giftBuddy: string }> = ({ endTime, giftBuddy }) => {
  // state variable to trigger rerender
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((_) => _ + 1)
    }, 1000);
    return () => clearInterval(interval);
  }, [])

  return <Countdown date={new Date(endTime ?? 0)} renderer={({ days, hours, minutes, seconds, completed }) => (
    <>
      <div className="text-2xl text-white text-center">
        Dein Geschenkbuddy ist {completed ? '' : 'abrufbar in'}:
      </div>
      <h1 className="text-center text-5xl font-extrabold tracking-tight mt-6 text-white sm:text-[5rem]">
        <span className="text-[hsl(280,100%,70%)]">{completed ? giftBuddy : [days, hours, minutes, seconds].map(num => num.toString().padStart(2, '0')).join(':')}</span>
        <br />
        <span className="block mt-4">????????????</span>
      </h1>
    </>
  )} />
}


export default Home;
