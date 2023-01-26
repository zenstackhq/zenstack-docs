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
    return (
        <header className={clsx('hero hero--primary', styles.heroBanner)}>
            <div className="container flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="text-left flex flex-col items-start lg:w-1/2">
                    <h1 className="hero__title font-bold text-3xl lg:text-6xl mb-8 lg:mb-8 lg:leading-[70px]">
                        Prisma Catalyst For{' '}
                        <span
                            className="whitespace-nowrap
                        "
                        >
                            Full-stack
                        </span>{' '}
                        Development
                    </h1>
                    <p className="hero__subtitle font-semi-bold text-base lg:text-2xl mx-auto mb-8 lg:mb-8 lg:leading-relaxed">
                        {description}
                    </p>
                    <div className={styles.buttons}>
                        <Link
                            className="button button--secondary button--lg lg:text-2xl lg:px-8 lg:py-4"
                            to="/docs"
                        >
                            Get Started →
                        </Link>
                    </div>
                </div>
                <div className="lg:w-1/2 mx-[-40px] lg:mx-auto">
                    <img src="/img/banner-code.png" />
                </div>
            </div>
        </header>
    );
}

export default function Home(): JSX.Element {
    const { siteConfig } = useDocusaurusContext();
    return (
        <Layout
            title={`${siteConfig.title}: Prisma Catalyst For Full-stack Development`}
            description={description}
        >
            <Header />
            <main className="flex flex-col container mx-auto gap-12 lg:gap-20 px-8 lg:px-16 py-12 lg:py-20">
                <ValueProposition />
                <Steps />
                <Features />

                <div className="flex justify-center w-full">
                    <Link
                        className="button button--primary button--lg text-xl w-fit py-4"
                        to="/docs"
                    >
                        Let's get started →
                    </Link>
                </div>
            </main>
        </Layout>
    );
}
