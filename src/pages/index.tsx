import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { trpc } from "../utils/trpc";
import { signUpSchema } from "../types/account";
import type { z } from "zod";
import { saveEmailToLocalstorage } from "../utils/utils";

const Home: NextPage = () => {
  const signUp = trpc.account.signUp.useMutation();

  const signUpEndTime = 1671231599000;
  const giftEndTime = 1671292800000;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(signUpSchema),
  })

  const formatTime = (time: number) => new Date(time).toLocaleDateString('de-DE')

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
          <h1 className="text-center text-5xl font-extrabold tracking-tight text-white sm:text-[5rem] break-words max-w-full">
            Wichtiges-<span className="text-[hsl(280,100%,70%)]">Weihnachts</span>-Wichteln
            <br />
            <span className="block mt-2">🎅🧑‍🎄🤶</span>

          </h1>
          {signUpEndTime < Date.now() ?
            <div className="text-2xl text-white text-center max-w-sm">
              <p>Die Anmeldung ist leider vorbei!</p>
              <p className="mt-4">Bitte besorge bis zum {formatTime(giftEndTime)} ein Geschenk im Wert von 5 €</p>
            </div>
            :
            <><div className="text-2xl text-white text-center">
              Jetzt bis zum {formatTime(signUpEndTime)} Anmelden oder das beste Wichteln verpassen!
            </div>
              <div className="text-2xl p-4">
                <form className="flex flex-col gap-6 text-white" onSubmit={handleSubmit(details => {
                  signUp.mutate(details as z.infer<typeof signUpSchema>);
                  saveEmailToLocalstorage(details.email);
                  reset();
                })}>
                  <div>
                    <label htmlFor="name" className="block ">Name</label>
                    <input id="name" className="px-2 w-full rounded-md mt-2 bg-white/10 outline-none" type="text" {...register("name")} />
                    {errors.name?.message && <div className="text-sm mt-2">{`${errors.name?.message ?? ''}`}</div>}
                  </div>
                  <div>
                    <label htmlFor="email" className="block ">E-Mail</label>
                    <input id="email" className="px-2 w-full rounded-md mt-2 bg-white/10 outline-none" type="text" {...register("email")} />
                    {errors.email?.message && <div className="text-sm mt-2">{`${errors.email?.message ?? ''}`}</div>}
                  </div>
                  <button type="submit" className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors">Teilnehmen</button>
                  {signUp.error ? <div className="text-sm text-center">{signUp.error?.message}</div> : null}
                  {signUp.data ? <div className="text-sm text-center">{signUp.data?.result}</div> : null}
                </form>
              </div>
            </>}

          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
            href="/geschenk"
          >
            <h3 className="text-2xl font-bold">Geschenkbuddy finden →</h3>
          </Link>
        </div>
      </main>
    </>
  );
};



export default Home;