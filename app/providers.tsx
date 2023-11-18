'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { useEffect } from 'react'
import Footer from "@/components/footer"
import Header from "@/components/header"
import { SessionProvider } from "next-auth/react"

const Providers = ({ children, session }: any) => {

  return (
    <>
      <SessionProvider session={session}>
        <Header />
        {children}
        <Footer />
        <ProgressBar
          height="4px"
          color="#7C3AED"
          options={{ showSpinner: true }}
          shallowRouting
        />
      </SessionProvider>
    </>
  );
};

export default Providers;