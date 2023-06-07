import React, { ReactNode } from 'react';
import CodeBlock from '@theme/CodeBlock';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

function Badge({ children }: { children: ReactNode }) {
    return <div className="badge badge-outline badge-accent border-solid inline">{children}</div>;
}

function Title({ children }: { children: ReactNode }) {
    return <h3 className="text-3xl font-semibold">{children}</h3>;
}

function Content({ children }: { children: ReactNode }) {
    return <p className="text-lg text-slate-700 font-normal">{children}</p>;
}

function LearnMore({ url }: { url: string }) {
    return <a href={url}>Learn More →</a>;
}

export default function ZenStackInStack(): JSX.Element {
    return (
        <section className="flex flex-col items-start lg:items-center w-full">
            <div>
                <h2 className="text-2xl lg:text-4xl flex items-center pb-4">
                    <span>Empower Every Layer Of Your Stack</span>
                </h2>
            </div>

            <div className="flex flex-col gap-12 mt-8 text-left max-w-3/4">
                <section>
                    <Badge>Backend</Badge>
                    <Title>Supercharged ORM For Your Backend Code</Title>
                    <Content>
                        ZenStack extends Prisma ORM with a powerfull access control layer. By defining policies right
                        inside data model, your schema becomes the single source of truth. By using a policy-enabled
                        database client, you can enjoy the same Prisma API you already love, with ZenStack automagically
                        enforcing access control rules.
                    </Content>
                    <img className="px-4 py-2 max-w-3/4 block m-auto" src="/img/banner-code.png" />
                    <LearnMore url="/docs/get-started/backend" />
                </section>

                <section>
                    <Badge>API</Badge>
                    <Title>Building Database-Centric APIs</Title>
                    <Content>
                        Wrapping APIs around database is tedious and error-prone. ZenStack can install CRUD APIs to the
                        framework of your choice with just a few lines of code. Thanks to the built-in access control
                        support, the APIs are fully secure and can be directly exposed to the public. What about
                        documentation? Turn on a plugin and an OpenAPI specification will be generated in seconds.
                    </Content>

                    <Tabs>
                        <TabItem value="Express" label="Express">
                            <CodeBlock language="ts" title="app.ts">
                                {`import { withPresets } from '@zenstackhq/runtime';
import { ZenStackMiddleware } from '@zenstackhq/server/express';
import RestApiHandler from '@zenstackhq/server/api/rpc';

app.use(express.json());
app.use(
    '/api/model',
    ZenStackMiddleware({
        getPrisma: (request) => withPresets(prisma, { user: getSessionUser(request) }),
        handler: RestApiHandler({ endpoint: 'http://localhost/api/model' }) 
    })
);`}
                            </CodeBlock>
                        </TabItem>
                        <TabItem value="Fastify" label="Fastify">
                            <CodeBlock language="ts" title="app.ts">
                                {`import { withPresets } from '@zenstackhq/runtime';
import { ZenStackFastifyPlugin } from '@zenstackhq/server/fastify';
import RestApiHandler from '@zenstackhq/server/api/rpc';

server.register(ZenStackFastifyPlugin, {
    prefix: '/api/model',
    getPrisma: (request) => withPresets(prisma, { user: getSessionUser(request) }),
    handler: RestApiHandler({ endpoint: 'http://localhost/api/model' }) 
});
`}
                            </CodeBlock>
                        </TabItem>
                        <TabItem value="Next.js" label="Next.js">
                            <CodeBlock language="ts" title="/src/pages/api/model/[...path].ts">
                                {`import { NextRequestHandler } from '@zenstackhq/server/next';
import RestApiHandler from '@zenstackhq/server/api/rest';
import { getPrisma } from '../../lib/db';

export default NextRequestHandler({ 
    getPrisma: (req, res) => withPresets({ user: getSessionUser(req, res) }),
    handler: RestApiHandler({ endpoint: 'http://localhost/api/model' }) 
});
`}
                            </CodeBlock>
                        </TabItem>
                        <TabItem value="SvelteKit" label="SvelteKit">
                            <CodeBlock language="ts" title="/src/hooks.server.ts">
                                {`import { withPresets } from '@zenstackhq/runtime';
import { SvelteKitHandler } from '@zenstackhq/server/sveltekit';
import RestApiHandler from '@zenstackhq/server/api/rpc';

export const handle = SvelteKitHandler({
    prefix: '/api/model',
    getPrisma: (event) => withPresets({ user: getSessionUser(event) }),
    handler: RestApiHandler({ endpoint: 'http://localhost/api/model' }) 
});`}
                            </CodeBlock>
                        </TabItem>

                        <TabItem value="Nuxt" label="Nuxt">
                            <CodeBlock>Coming soon</CodeBlock>
                        </TabItem>
                    </Tabs>

                    <LearnMore url="/docs/guides/api" />
                </section>

                <section>
                    <Badge>Full-stack</Badge>
                    <Title>Building Data-Driven UI</Title>
                    <Content></Content>
                </section>
            </div>
        </section>
    );
}
