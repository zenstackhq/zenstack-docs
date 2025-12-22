import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import React from 'react';
import Sponsorship from '../components/Sponsorship';
import UserLogs from '../components/UserLogos';
import AICoding from './_components/AICoding';
import ORM from './_components/ORM';
import SchemaLanguage from './_components/Schema';
import Service from './_components/Service';
import ValueProps from './_components/ValueProps';
import styles from './index.module.css';

const description = `ZenStack v3 is a powerful data layer for modern TypeScript applications. It provides an intuitive data modeling language, a fully type-safe ORM, built-in access control and data validation, and automatic data query service that seamlessly integrates with popular frameworks like Next.js and Nuxt.`;

function Header() {
    return (
        <header className={clsx('hero hero--primary', styles.heroBanner)}>
            <div className="w-full flex justify-center">
                <div className="w-full xl:container flex justify-center text-white dark:text-gray-800">
                    <div className="w-full max-w-4xl text-center flex flex-col items-center px-4">
                        <h1 className="hero__title font-bold text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl mb-6 sm:mb-8 lg:mb-12 leading-tight sm:leading-tight md:leading-tight lg:leading-tight xl:leading-tight 2xl:leading-tight">
                            <span className="inline-block text-white dark:text-gray-800">
                                Battery-Included TypeScript ORM
                            </span>
                        </h1>
                        <p className="hero__subtitle font-semi-bold text-base sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-6 sm:mb-8 lg:mb-12 leading-relaxed text-gray-100 dark:text-gray-700 max-w-none sm:max-w-2xl text-center">
                            Intuitive data modeling, type-safe ORM, built-in access control, automatic query services,
                            and more.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                className="button button--secondary button--lg w-64 lg:text-2xl lg:px-8 lg:py-4"
                                to="/docs"
                            >
                                Get Started →
                            </Link>
                            <a
                                href="https://stackblitz.com/~/github.com/zenstackhq/v3-doc-quick-start?file=zenstack%2fschema.zmodel&file=main.ts&view=editor&showSidebar=0&hideNavigation=1&hideExplorer=1"
                                target="_blank"
                                className="button button--outline button--lg w-64 border-solid lg:text-2xl lg:px-8 lg:py-4 hover:text-gray-200 dark:hover:text-gray-600"
                            >
                                Open Playground
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
            className={`flex justify-center px-8 py-16 lg:px-16 lg:py-32 text-gray-800 dark:bg-gray-900 dark:text-gray-200  ${
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
        <Layout title={`${siteConfig.title} V3`} description={description}>
            <Header />
            <main className="flex flex-col">
                <Section>
                    <ValueProps />
                </Section>

                <Section className="bg-slate-50 dark:bg-slate-800">
                    <UserLogs />
                </Section>

                <Section>
                    <SchemaLanguage />
                </Section>

                <Section className="bg-slate-50 dark:bg-slate-800">
                    <ORM />
                </Section>

                <Section>
                    <Service />
                </Section>

                <Section className="bg-slate-50 dark:bg-slate-800">
                    <AICoding />
                    <div className="flex justify-center w-full mt-16">
                        <Link
                            className="button button--outline button--lg border-solid lg:text-2xl lg:px-8 lg:py-4 hover:text-gray-600 dark:hover:text-gray-400"
                            to="/docs"
                        >
                            Start Building Now →
                        </Link>
                    </div>
                </Section>

                <Section>
                    <Sponsorship />
                    <div className="flex justify-center w-full mt-16">
                        <Link
                            className="button button--primary button--lg text-xl w-fit py-4"
                            to="https://github.com/sponsors/zenstackhq"
                        >
                            Support this project →
                        </Link>
                    </div>
                </Section>

                {/* <Section>
                    <Notes />
                </Section> */}
            </main>
        </Layout>
    );
}
