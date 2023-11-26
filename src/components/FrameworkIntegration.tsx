import React from 'react';
import MovingCarousel from './MovingCarousel';

function Title(props: React.PropsWithChildren) {
    return (
        <h3 {...props} className="container font-medium text-xl pb-4 text-slate-800 dark:text-slate-200" />
    );
}

function Logo({
    src,
    darkSrc,
    darkModeBrightness,
}: {
    src: string;
    darkSrc?: string;
    darkModeBrightness?: number;
}): JSX.Element {
    const alt = src.split('/').pop()?.split('.')[0] ?? 'logo';
    return (
        <>
            <img src={src} className="h-12 object-contain block dark:hidden" alt={alt} />
            <img
                src={darkSrc ?? src}
                className="h-12 object-contain hidden dark:block"
                style={darkModeBrightness ? { filter: `brightness(${darkModeBrightness})` } : {}}
                alt={alt}
            />
        </>
    );
}

export default function FrameworkIntegration(): JSX.Element {
    return (
        <div>
            <div className="w-full container">
                <span className="text-primary uppercase opacity-50 font-medium">
                    Effortless
                </span>
                <h2 className="mt-4 max-readable-text-width text-3xl md:text-4xl pb-20">
                    Integrate the tools you already know and love
                </h2>
            </div>
            <div className="w-full flex flex-col space-y-24">
                <div className="flex flex-col space-y-1">
                    <Title>Server & Full-stack</Title>
                    <MovingCarousel direction="left">
                        <div className="space-x-8 flex items-center">
                            <Logo
                                src="/img/logo/nextjs.png"
                                darkSrc="/img/logo/nextjs-dark.png"
                                darkModeBrightness={0.8}
                            />
                            <Logo src="/img/logo/remix.png" darkModeBrightness={0.8} />
                            <Logo
                                src="/img/logo/sveltekit.png"
                                darkSrc="/img/logo/sveltekit-dark.png"
                                darkModeBrightness={0.85}
                            />
                            <Logo
                                src="/img/logo/nuxtjs.png"
                                darkSrc="/img/logo/nuxtjs-dark.png"
                                darkModeBrightness={0.85}
                            />
                            <Logo src="/img/logo/expressjs.png" darkSrc="/img/logo/expressjs-dark.png" />
                            <Logo
                                src="/img/logo/fastify.png"
                                darkSrc="/img/logo/fastify-dark.png"
                                darkModeBrightness={0.85}
                            />
                            <Logo src="/img/logo/nestjs.png" darkModeBrightness={0.85} />
                        </div>
                    </MovingCarousel>
                </div>
                <div className="flex flex-col space-y-1">
                    <Title>Data Query Client</Title>
                    <MovingCarousel direction="right">
                        <div className="flex space-x-8 items-center">
                            <Logo src="/img/logo/swr.png" darkSrc="/img/logo/swr-dark.png" darkModeBrightness={0.85} />
                            <Logo src="/img/logo/tanstackquery.png" />
                        </div>
                    </MovingCarousel>
                </div>
                <div className="flex flex-col space-y-1">
                    <Title>APIs</Title>
                    <MovingCarousel direction="left">
                        <div className="flex items-center space-x-8">
                            <Logo
                                src="/img/logo/rest.png"
                                darkSrc="/img/logo/rest-dark.png"
                                darkModeBrightness={0.85}
                            />
                            <Logo src="/img/logo/jsonapi.png" />
                            <Logo
                                src="/img/logo/openapi.png"
                                darkSrc="/img/logo/openapi-dark.png"
                                darkModeBrightness={0.85}
                            />
                            <Logo
                                src="/img/logo/trpc.png"
                                darkSrc="/img/logo/trpc-dark.png"
                                darkModeBrightness={0.85}
                            />
                        </div>
                    </MovingCarousel>
                </div>
            </div>
        </div>
    );
}
