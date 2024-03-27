import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import ValueProposition from '@site/src/components/ValueProposition';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import React from 'react';
import { Typewriter } from 'react-simple-typewriter';
import ZenStackInStack from '../components/ZenStackInStack';
import { description } from '../lib/content';
import styles from './index.module.css';
import FrameworkIntegration from '../components/FrameworkIntegration';
import VOC from '../components/VOCFlat';

function Header() {
    return (
        <header className={clsx('hero hero--primary', styles.heroBanner)}>
            <div className="w-full flex justify-center">
                <div className="w-full xl:container grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-16 text-white dark:text-gray-800">
                    <div className="w-full text-left flex flex-col items-start">
                        <h1 className="hero__title font-bold text-3xl md:text-5xl xl:text-6xl mb-8 lg:mb-8 lg:leading-[70px] whitespace-nowrap">
                            <span className="inline-block 2xl:hidden leading-relaxed">Database to </span>
                            <span className="hidden 2xl:inline-block leading-relaxed">From Database to </span>{' '}
                            <span>
                                <Typewriter words={['API', 'Service', 'UI']} loop={true} />
                            </span>
                            {','}
                            <br /> In Minutes
                        </h1>
                        <p className="hero__subtitle font-semi-bold text-base lg:text-2xl mx-auto mb-8 lg:mb-8 lg:leading-relaxed text-gray-100 dark:text-gray-700">
                            A TypeScript toolkit that supercharges Prisma ORM with a fine-grained Authorization layer,
                            auto-generated type-safe APIs/hooks to unlock its full potential for full-stack development.
                        </p>
                        <div className={styles.buttons}>
                            <Link
                                className="button button--secondary button--lg lg:text-2xl lg:px-8 lg:py-4"
                                to="/docs/welcome"
                            >
                                Get Started →
                            </Link>
                        </div>
                    </div>
                    <div className="w-full h-full mx-auto flex justify-end">
                        <div className="block: xl:hidden w-full relative pt-[56%]">
                            <iframe
                                width="100%"
                                height="100%"
                                src="https://www.youtube.com/embed/dI8LeuFTr9c?autoplay=1mute=1"
                                title="ZenStack Introduction"
                                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; autoplay"
                                allowFullScreen
                                className="absolute inset-0 rounded-xl shadow-xl"
                            ></iframe>
                        </div>
                        <iframe
                            width="100%"
                            height="100%"
                            src="https://www.youtube.com/embed/dI8LeuFTr9c?autoplay=1&mute=1"
                            title="ZenStack Introduction"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="hidden xl:block shadow-xl rounded-xl"
                        ></iframe>
                    </div>
                </div>
            </div>
        </header>
    );
}

function Section({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <section
            className={`flex justify-center px-8 py-16 lg:px-16 lg:py-32 bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-200  ${
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
            title={`${siteConfig.title} - Lighting-Fast Development for Database-Centric Apps`}
            description={description}
        >
            <Header />
            <main className="flex flex-col">
                <Section>
                    <ValueProposition />
                </Section>

                <Section className="bg-slate-50">
                    <ZenStackInStack />
                </Section>

                <Section>
                    <FrameworkIntegration />
                </Section>

                {/* <Section className="bg-slate-50">
                    <UseCases />
                </Section> */}

                <Section className="bg-slate-50">
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
