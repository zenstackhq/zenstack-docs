import React from 'react';

function Title({ children }: { children: React.ReactNode }) {
    return (
        <h3 className="text-xl underline lg:no-underline md:text-2xl text-center pb-4 text-slate-700 dark:text-slate-300">
            {children}
        </h3>
    );
}

function Logo({ src }: { src: string }): JSX.Element {
    return <img src={src} className="h-12 object-contain block" />;
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
                            <Logo src="/img/logo/nextjs.png" />
                            <Logo src="/img/logo/remix.png" />
                            <Logo src="/img/logo/sveltekit.png" />
                            <Logo src="/img/logo/nuxtjs.png" />
                            <Logo src="/img/logo/expressjs.png" />
                            <Logo src="/img/logo/fastify.png" />
                            <Logo src="/img/logo/nestjs.png" />
                        </div>
                    </div>
                    <div>
                        <Title>Data Query Client</Title>
                        <div className="flex flex-col gap-4">
                            <Logo src="/img/logo/swr.png" />
                            <Logo src="/img/logo/tanstackquery.png" />
                        </div>
                    </div>
                    <div>
                        <Title>API</Title>
                        <div className="flex flex-col gap-4">
                            <Logo src="/img/logo/rest.png" />
                            <Logo src="/img/logo/jsonapi.png" />
                            <Logo src="/img/logo/openapi.png" />
                            <Logo src="/img/logo/trpc.png" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
