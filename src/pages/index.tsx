import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import ValueProposition from '@site/src/components/ValueProposition';
import Layout from '@theme/Layout';
import React from 'react';
import { Features } from '../components/Features';
import Steps from '../components/Steps';

function Header() {
    const { siteConfig } = useDocusaurusContext();
    return (
        <header className="bg-primary py-16 lg:py-32 text-center overflow-hidden">
            <div className="container">
                <h1 className="text-white dark:text-gray-800 font-bold text-3xl md:text-4xl">
                    {siteConfig.tagline}
                </h1>
                <p className="text-gray-200 dark:text-gray-800 font-semi-bold text-lg md:text-xl max-w-[800px] mx-auto">
                    An extensible toolkit for generating services, hooks, and
                    other artifacts from your database schema, with built-in
                    access policy and data validation support.
                </p>
                <div className="flex items-center justify-center mt-10">
                    <Link
                        className="button button--secondary button--lg"
                        to="/docs/intro"
                    >
                        Tutorial - 10min ⏱️
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default function Home(): JSX.Element {
    const { siteConfig } = useDocusaurusContext();
    return (
        <Layout
            title={`${siteConfig.tagline}`}
            description="Description will go into a meta tag in <head />"
        >
            <Header />
            <main className="flex flex-col container mx-auto gap-12 lg:gap-20 px-8 lg:px-16 py-12 lg:py-20">
                <ValueProposition />
                <Steps />
                <Features />

                <div className="flex justify-center w-full">
                    <Link
                        className="button button--primary button--lg text-2xl w-fit py-4"
                        to="/docs/intro"
                    >
                        Get started with a tutorial
                    </Link>
                </div>
            </main>
        </Layout>
    );
}
