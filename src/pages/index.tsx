import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import ValueProposition from '@site/src/components/ValueProposition';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import React from 'react';
import { Typewriter } from 'react-simple-typewriter';
import ZenStackInStack from '../components/ZenStackInStack';
import { description } from '../lib/content';
import FrameworkIntegration from '../components/FrameworkIntegration';
import VOC from '../components/VOCFlat';
import { HiArrowSmRight } from 'react-icons/hi';
import TailwindIndicator from '../components/TailwindIndicator';

function CallToActionButton({ className, ...props }: React.ComponentPropsWithoutRef<typeof Link>) {
    return (
        <Link
            {...props}
            className={clsx(
                'group relative overflow-hidden text-white dark:text-stone-900 font-semibold button button--secondary button--lg flex items-center justify-center w-full md:w-fit text-xl md:px-8 h-14 md:h-15',
                className
            )}
        />
    );
}

function HeroLanding() {
    return (
        <header className="hero hero--primary px-3 md:!px-0 w-full pt-16 pb-24 md:pb-48">
            <div className="container p-0 w-full grid xl:grid-cols-2 gap-10">
                <div className="text-white dark:text-stone-900 w-full flex flex-col">
                    {/* Accessible title */}
                    <span className="sr-only">From database to API in minutes.</span>
                    <h1 className="not-sr-only max-w-screen font-bold text-3xl sm:text-5xl md:text-6xl mb-8 lg:mb-8 lg:leading-[70px] whitespace-nowrap">
                        <span className="inline-block leading-relaxed">
                            From database to <Typewriter words={['API', 'Service', 'UI']} loop={true} />
                        </span>
                        <br />
                        in <span className="opacity-80">minutes</span>.
                    </h1>
                    <p className="md:max-w-sm hero__subtitle text-base md:text-lg lg:text-2xl leading-relaxed mx-auto mb-8 lg:mb-8 text-gray-200 dark:text-stone-700">
                        {description}
                    </p>
                    <div className="w-full flex-col md:flex-row flex items-center gap-3">
                        <CallToActionButton to="/docs/welcome">
                            Get Started
                            <HiArrowSmRight className="h-6 w-6 ml-2 transition-transform group-hover:translate-x-2" />
                            <div className="animate-shine" />
                        </CallToActionButton>
                        <CallToActionButton
                            to="https://github.com/zenstackhq/zenstack"
                            className="dark:text-white bg-transparent border-stone-900 dark:border-white"
                            target="_blank"
                            rel="nofollow noreferrer"
                        >
                            GitHub
                        </CallToActionButton>
                    </div>
                </div>
                <div className="mt-8 lg:mt-[21.6%] relative mx-auto flex justify-end w-full h-full">
                    <div className="xl:hidden w-full relative pt-[56%] aspect-video">
                        <iframe
                            width="100%"
                            height="100%"
                            src="https://www.youtube.com/embed/dI8LeuFTr9c?autoplay=1mute=1"
                            title="ZenStack Introduction"
                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; autoplay"
                            allowFullScreen
                            className="absolute inset-0 rounded-lg shadow-xl"
                        />
                    </div>
                    <div className="hidden xl:block left-0 absolute top-0 w-[115%] h-full aspect-video">
                        <iframe
                            width="100%"
                            height="100%"
                            src="https://www.youtube.com/embed/dI8LeuFTr9c?autoplay=1&mute=1"
                            title="ZenStack Introduction"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="shadow-xl rounded-lg -translate-1/3"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}

function Section({ className, ...props }: JSX.IntrinsicElements['section']) {
    return (
        <section
            {...props}
            className={clsx(
                'w-full py-24 lg:py-32 bg-white text-stone-800 dark:bg-gray-900 dark:text-gray-200',
                className
            )}
        />
    );
}

export default function Home(): JSX.Element {
    const { siteConfig } = useDocusaurusContext();

    return (
        <Layout
            title={`${siteConfig.title} - Lighting-Fast Development for Database-Centric Apps`}
            description={description}
        >
            <main className="relative overflow-hidden">
                <HeroLanding />
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
                    <div className="container mt-48">
                        <CallToActionButton>
                            Start Building Now
                            <HiArrowSmRight className="h-6 w-6 ml-2 transition-transform group-hover:translate-x-2" />
                            <div className="animate-shine" />
                        </CallToActionButton>
                    </div>
                </Section>
            </main>
            <TailwindIndicator />
        </Layout>
    );
}
