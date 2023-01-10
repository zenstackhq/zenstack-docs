import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import ValueProposition from '@site/src/components/ValueProposition';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import React from 'react';
import { Features } from '../components/Features';
import Steps from '../components/Steps';
import { description } from '../lib/content';
import styles from './index.module.css';

function Header() {
    const { siteConfig } = useDocusaurusContext();
    return (
        <header className={clsx('hero hero--primary', styles.heroBanner)}>
            <div className="container">
                <h1 className="hero__title font-bold text-3xl lg:text-5xl mb-8 lg:mb-16">
                    {siteConfig.tagline}
                </h1>
                <p className="hero__subtitle font-semi-bold text-lg lg:text-xl max-w-[800px] mx-auto mb-8 lg:mb-16">
                    {description}
                </p>
                <div className={styles.buttons}>
                    <Link
                        className="button button--secondary button--lg lg:text-2xl"
                        to="/docs/tutorial"
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
            title={`${siteConfig.title}: ${siteConfig.tagline}`}
            description={description}
        >
            <Header />
            <main className="flex flex-col container mx-auto gap-12 lg:gap-20 px-8 lg:px-16 py-12 lg:py-20">
                <ValueProposition />
                <Steps />
                <Features />

                <div className="flex justify-center w-full">
                    <Link
                        className="button button--primary button--lg text-2xl lg:text-3xl w-fit py-4"
                        to="/docs/tutorial"
                    >
                        Let's get started!
                    </Link>
                </div>
            </main>
        </Layout>
    );
}
