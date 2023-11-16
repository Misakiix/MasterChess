'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import Footer from "@/components/footer"
import Header from "@/components/header"

const Providers = ({ children }: any) => {

    return (
        <>
            <Header />
            {children}
            <Footer />
            <ProgressBar
                height="4px"
                color="#7C3AED"
                options={{ showSpinner: true }}
                shallowRouting
            />
        </>
    );
};

export default Providers;