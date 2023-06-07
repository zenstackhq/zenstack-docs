import React from 'react';

export default function FrameworkIntegration(): JSX.Element {
    return (
        <section className="flex flex-col items-start lg:items-center w-full">
            <div>
                <h2 className="text-2xl lg:text-4xl flex items-center pb-4">
                    <span>Play Well With The Frameworks/Standards You Love</span>
                </h2>
            </div>
            <ul className="flex flex-col gap-4 md:gap-0">
                <li>Next.js</li>
                <li>SvelteKit</li>
                <li>Nuxt (coming soon)</li>
                <li>tRPC</li>
                <li>Express.js</li>
                <li>Fastify</li>
                <li>Nest.js</li>
                <li>RESTful</li>
                <li>OpenAPI</li>
                <li>JSON:API</li>
            </ul>
        </section>
    );
}
