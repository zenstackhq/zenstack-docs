import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import ValueProposition from '@site/src/components/ValueProposition';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import React from 'react';
import ZenStackInStack from '../components/ZenStackInStack';
import { description } from '../lib/content';
import styles from './index.module.css';
import FrameworkIntegration from '../components/FrameworkIntegration';
import VOC from '../components/VOCFlat';
import Sponsorship from '../components/Sponsorship';
import UserLogs from '../components/UserLogos';

function Header() {
    return (
        <header className={clsx('hero hero--primary', styles.heroBanner)}>
            <div className="w-full flex justify-center">
                <div className="w-full xl:container flex justify-center text-white dark:text-gray-800">
                    <div className="w-full max-w-4xl text-center flex flex-col items-center px-4">
                        <h1 className="hero__title font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl mb-6 sm:mb-8 lg:mb-12 leading-tight sm:leading-tight md:leading-tight lg:leading-tight xl:leading-tight 2xl:leading-tight">
                            <span className="inline-block text-white dark:text-gray-800">
                                Schema-First Full‑Stack Toolkit
                            </span>
                            <br className="hidden sm:block" />
                            <span className="sm:hidden"> </span>
                            <span className="inline-block mt-2 sm:mt-0 text-gray-800 dark:text-white font-extrabold">
                                with Clean & Scalable Authorization
                            </span>
                        </h1>
                        <p className="hero__subtitle font-semi-bold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-6 sm:mb-8 lg:mb-12 leading-relaxed text-gray-100 dark:text-gray-700 max-w-none sm:max-w-2xl text-center">
                            A TypeScript toolkit that enhances Prisma ORM with flexible Authorization and
                            auto-generated, type-safe APIs/hooks, simplifying full-stack development
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                className="button button--secondary button--lg lg:text-2xl lg:px-8 lg:py-4"
                                to="/docs/welcome"
                            >
                                Get Started →
                            </Link>
                            <a
                                href="/v3"
                                className="button button--outline button--lg border-solid lg:text-2xl lg:px-8 lg:py-4 hover:text-gray-200 dark:hover:text-gray-600"
                            >
                                Check V3 Beta
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

function Section({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <section
            className={`flex justify-center px-8 py-16 lg:px-16 lg:py-32  text-gray-800 dark:bg-gray-900 dark:text-gray-200  ${
                className ?? ''
            }`}
        >
            <div className="w-full lg:container">{children}</div>
        </section>
    );
}

export default function Home(): JSX.Element {
    const { siteConfig } = useDocusaurusContext();
    return (
        <Layout
            title={`${siteConfig.title}:Full-Stack Toolkit with Authorization on Prisma ORM`}
            description={description}
        >
            <Header />
            <main className="flex flex-col">
                <Section>
                    <ValueProposition />
                </Section>

                <Section className="bg-slate-50 dark:bg-slate-800">
                    <UserLogs />
                </Section>

                <Section>
                    <ZenStackInStack />
                </Section>

                <Section className="bg-slate-50 dark:bg-slate-800">
                    <FrameworkIntegration />
                </Section>

                <Section>
                    <Sponsorship />
                </Section>
                <Section className="bg-slate-50 dark:bg-slate-800">
                    <VOC />

                    <div className="flex justify-center w-full mt-32">
                        <Link className="button button--primary button--lg text-xl w-fit py-4" to="/docs/welcome">
                            Start Building Now →
                        </Link>
                    </div>
                </Section>
            </main>
        </Layout>
    );
}
