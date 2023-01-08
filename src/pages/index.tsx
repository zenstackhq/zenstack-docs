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
        <header className="bg-primary py-16 lg:py-20 text-center overflow-hidden">
            <div className="container">
                <h1 className="text-white dark:text-gray-800 font-bold text-4xl">
                    {siteConfig.tagline}
                </h1>
                <p className="text-gray-200 dark:text-gray-800 font-semi-bold text-xl max-w-[800px] mx-auto">
                    An extensible toolkit for generating services, hooks and
                    other artifacts from your database schema, with built-in
                    support for access policy and data validation.
                </p>
                <div className="flex items-center justify-center">
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
            <main className="flex flex-col container mx-auto gap-8 lg:gap-16 px-8 lg:px-16 py-8 lg:py-16">
                <ValueProposition />
                <Steps />
                <Features />

                <Link
                    className="button button--primary button--lg text-2xl w-fit py-4 mx-auto"
                    to="/docs/intro"
                >
                    Get started with a tutorial
                </Link>
            </main>
        </Layout>
    );
}
