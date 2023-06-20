import React from 'react';

function Title({ children }: { children: React.ReactNode }) {
    return (
        <h3 className="text-xl underline lg:no-underline md:text-2xl text-center pb-4 text-slate-700 dark:text-slate-300">
            {children}
        </h3>
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
    return (
        <>
            <img src={src} className="h-12 object-contain block dark:hidden" />
            <img
                src={darkSrc ?? src}
                className="h-12 object-contain hidden dark:block"
                style={darkModeBrightness ? { filter: `brightness(${darkModeBrightness})` } : {}}
            />
        </>
    );
}

export default function FrameworkIntegration(): JSX.Element {
    return (
        <div className="flex justify-center w-full">
            <div className="flex flex-col text-center xl:w-3/4">
                <h2 className="text-2xl md:text-3xl lg:text-4xl pb-20">Integrated With The Tools You Love</h2>
                <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-16">
                    <div>
                        <Title>Server & Full-stack</Title>
                        <div className="flex flex-col gap-4">
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
                    </div>
                    <div>
                        <Title>Data Query Client</Title>
                        <div className="flex flex-col gap-4">
                            <Logo src="/img/logo/swr.png" darkSrc="/img/logo/swr-dark.png" darkModeBrightness={0.85} />
                            <Logo src="/img/logo/tanstackquery.png" />
                        </div>
                    </div>
                    <div>
                        <Title>API</Title>
                        <div className="flex flex-col gap-4">
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
                    </div>
                </div>
            </div>
        </div>
    );
}
