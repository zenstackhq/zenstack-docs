import React from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { HiArrowSmRight } from 'react-icons/hi';

function Badge(props: React.PropsWithChildren) {
    return (
        <span
            {...props}
            className="w-fit text-emerald-500 dark:text-emerald-600 text-xs font-medium px-2.5 py-0.5 rounded-xl border border-solid border-emerald-500 dark:border-emerald-600"
        />
    );
}

function Title(props: React.PropsWithChildren) {
    return (
        <h3
            {...props}
            className="max-readable-text-width flex items-center text-xl md:text-2xl lg:text-3xl font-semibold text-gray-700 dark:text-gray-300"
        />
    );
}

function Content(props: React.PropsWithChildren) {
    return <p {...props} className="max-readable-text-width lg:text-lg text-gray-600 dark:text-gray-400 font-normal" />;
}

function LearnMore({ href, ...props }: JSX.IntrinsicElements['a']) {
    return (
        <a {...props} href={href} className="font-medium flex items-center w-fit">
            Learn More <HiArrowSmRight className="h-6 w-6 mr-4" />
        </a>
    );
}

export default function ZenStackInStack(): JSX.Element {
    return (
        <div className="container flex flex-col w-full">
            <span className="text-primary uppercase opacity-50 font-medium">Simplify development</span>
            <h2 className="mt-4 max-readable-text-width text-4xl md:text-5xl leading-relaxed">
                Empower every layer of your stack
            </h2>
            <div className="mt-16 w-full flex flex-col space-y-36 lg:space-y-48">
                <div className="flex flex-col space-y-3">
                    <div className="grid md:grid-cols-2 w-full gap-3">
                        <div className="space-y-3">
                            <Badge>Backend</Badge>
                            <Title>ORM With Access Control</Title>
                            <LearnMore href="/docs/intro/zmodel" />
                        </div>
                        <Content>
                            ZenStack extends Prisma ORM with a powerful access control layer. By defining policies right
                            inside the data model, your schema becomes the single source of truth. By using a
                            policy-enabled database client, you can enjoy the same Prisma API you already love, with
                            ZenStack automagically enforcing access control rules. Its core is framework-agnostic and
                            runs wherever Prisma runs.
                        </Content>
                    </div>
                    <div className="mx-auto lg:w-3/4 flex items-center">
                        <img
                            className="py-4 w-full h-auto block dark:hidden"
                            src="/img/home/supercharged-orm-light.png"
                            alt="supercharged orm"
                        />
                        <img
                            className="py-4 w-full h-auto hidden dark:block"
                            src="/img/home/supercharged-orm-dark.png"
                            alt="supercharged orm"
                        />
                    </div>
                </div>
                <div className="flex flex-col space-y-3">
                    <div className="w-full grid md:grid-cols-2 gap-3">
                        <div className="space-y-3">
                            <Badge>API</Badge>
                            <Title>Automatic CRUD API</Title>
                            <LearnMore href="/docs/intro/api" />
                        </div>
                        <Content>
                            Wrapping APIs around a database is tedious and error-prone. ZenStack can introspect the
                            schema and install CRUD APIs to the framework of your choice with just a few lines of code.
                            Thanks to the built-in access control support, the APIs are fully secure and can be directly
                            exposed to the public. What about documentation? Turn on a plugin, and an OpenAPI
                            specification will be generated in seconds.
                        </Content>
                    </div>
                    <Tabs>
                        <TabItem value="Next.js" label="Next.js">
                            <img
                                src="/img/home/server-adapter-nextjs.png"
                                alt="next.js server adapter"
                                className="rounded-lg mx-auto lg:max-w-3/4 w-full h-auto"
                            />
                            {/* <CodeBlock language="ts">
                                            {`
import { prisma } from 'server/db';
import { enhance } from '@zenstackhq/runtime';
import { NextRequestHandler } from '@zenstackhq/server/next';
import RestApiHandler from '@zenstackhq/server/api/rest';

export default NextRequestHandler({
    getPrisma: (req, res) => enhance(prisma, { user: getSessionUser(req, res) }),
    handler: RestApiHandler({ endpoint: 'http://localhost/api/model' })
});
                                    `}
                                        </CodeBlock> */}
                        </TabItem>
                        <TabItem value="Nuxt" label="Nuxt">
                            <img
                                src="/img/home/server-adapter-nuxt.png"
                                alt="nuxt server adapter"
                                className="rounded-lg mx-auto lg:max-w-3/4 w-full h-auto"
                            />
                            {/* <CodeBlock language="ts">
                                            {`
import { prisma } from '~/server/db';
import { enhance } from '@zenstackhq/runtime';
import { createEventHandler } from '@zenstackhq/server/nuxt';
import RestApiHandler from '@zenstackhq/server/api/rest';

export default createEventHandler({
    getPrisma: (event) => enhance(prisma, { user: getSessionUser(event) }),
    handler: RestApiHandler({ endpoint: 'http://localhost/api/model' })
});
                                    `}
                                        </CodeBlock> */}
                        </TabItem>
                        <TabItem value="SvelteKit" label="SvelteKit">
                            <img
                                src="/img/home/server-adapter-sveltekit.png"
                                alt="svelte kit server adapter"
                                className="rounded-lg mx-auto lg:max-w-3/4 w-full h-auto"
                            />
                            {/* <CodeBlock language="ts">
                                            {`
import { prisma } from '$/lib/db';
import { enhance } from '@zenstackhq/runtime';
import { SvelteKitHandler } from '@zenstackhq/server/sveltekit';
import RestApiHandler from '@zenstackhq/server/api/rpc';

export const handle = SvelteKitHandler({
    prefix: '/api/model',
    getPrisma: (event) => enhance(prisma, { user: getSessionUser(event) }),
    handler: RestApiHandler({ endpoint: 'http://localhost/api/model' })
});
                                    `}
                                        </CodeBlock> */}
                        </TabItem>
                        <TabItem value="Express" label="Express">
                            <img
                                src="/img/home/server-adapter-express.png"
                                alt="express.js server adapter"
                                className="rounded-lg mx-auto lg:max-w-3/4 w-full h-auto"
                            />
                            {/* <CodeBlock language="ts">
                                            {`
import { prisma } from './db';
import { enhance } from '@zenstackhq/runtime';
import { ZenStackMiddleware } from '@zenstackhq/server/express';
import RestApiHandler from '@zenstackhq/server/api/rpc';

app.use(
    '/api/model',
    ZenStackMiddleware({
        getPrisma: (req) => enhance(prisma, { user: getSessionUser(req) }),
        handler: RestApiHandler({ endpoint: 'http://localhost/api/model' })
    })
);
                                `}
                                        </CodeBlock> */}
                        </TabItem>
                        <TabItem value="Fastify" label="Fastify">
                            <img
                                src="/img/home/server-adapter-fastify.png"
                                alt="fastify server adapter"
                                className="rounded-lg mx-auto lg:max-w-3/4 w-full h-auto"
                            />
                            {/* <CodeBlock language="ts">
                                            {`
import { prisma } from './db';
import { enhance } from '@zenstackhq/runtime';
import { ZenStackFastifyPlugin } from '@zenstackhq/server/fastify';
import RestApiHandler from '@zenstackhq/server/api/rpc';

server.register(ZenStackFastifyPlugin, {
    prefix: '/api/model',
    getPrisma: (req) => enhance(prisma, { user: getSessionUser(req) }),
    handler: RestApiHandler({ endpoint: 'http://localhost/api/model' })
});
                                    `}
                                        </CodeBlock> */}
                        </TabItem>
                    </Tabs>
                    <img className="xl:max-w-3/4 block" src="/img/home/swagger-ui.png" alt="swagger ui" />
                </div>
                <div className="space-y-3 flex flex-col">
                    <div className="grid w-full md:grid-cols-2 gap-3">
                        <div className="space-y-3">
                            <Badge>Full-stack</Badge>
                            <Title>Frontend Query Code Generation</Title>
                            <LearnMore href="/docs/intro/frontend" />
                        </div>
                        <Content>
                            Data query and mutation are one of the toughest topics for frontend development. ZenStack
                            simplifies it by generating fully-typed client-side data access code (aka hooks) targeting
                            the data query library of your choice (SWR, TanStack Query, etc.). The hooks call into the
                            automatically generated APIs, which are secured by the access policies.
                        </Content>
                    </div>
                    <img className="mx-auto xl:max-w-3/4 block" src="/img/home/client-hooks.png" alt="client hooks" />
                </div>
            </div>
        </div>
    );
}
