import React from 'react';

function Logo({ src }: { src: string }): JSX.Element {
    return <img src={src} className="h-12 object-contain block" />;
}

export default function FrameworkIntegration(): JSX.Element {
    return (
        <div className="flex justify-start lg:justify-center w-full">
            <div className="flex flex-col text-center w-3/4">
                <h2 className="text-2xl lg:text-4xl pb-20">Integrated With The Tools You Love</h2>
                <div className="flex flex-row justify-between w-full">
                    <div>
                        <h3 className="text-center pb-4">Server & Full-stack</h3>
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
                        <h3 className="text-center pb-4">Data Query Client</h3>
                        <div className="flex flex-col gap-4">
                            <Logo src="/img/logo/swr.png" />
                            <Logo src="/img/logo/tanstackquery.png" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-center pb-4">API</h3>
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
