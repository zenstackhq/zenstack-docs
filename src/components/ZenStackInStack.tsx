import React, { ReactNode } from 'react';
import CodeBlock from '@theme/CodeBlock';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

function Badge({ children }: { children: ReactNode }) {
    return <div className="badge badge-outline badge-accent border-solid inline text-xs">{children}</div>;
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
        <div className="flex flex-col items-start lg:items-center w-full">
            <div className="flex flex-col gap-12 mt-8 text-left max-w-3/4">
                <h2 className="text-2xl lg:text-4xl w-full pb-4">Empower Every Layer of Your Stack</h2>

                <div>
                    <Badge>Backend</Badge>
                    <Title>Supercharged ORM For Your Node.js Code</Title>
                    <Content>
                        ZenStack extends Prisma ORM with a powerfull access control layer. By defining policies right
                        inside data model, your schema becomes the single source of truth. By using a policy-enabled
                        database client, you can enjoy the same Prisma API you already love, with ZenStack automagically
                        enforcing access control rules. Its core is framework-agnostic, and runs wherever Prisma runs.
                    </Content>
                    <img className="py-2 max-w-3/4 block" src="/img/banner-code.png" />
                    <LearnMore url="/docs/get-started/backend" />
                </div>

                <div>
                    <Badge>API</Badge>
                    <Title>Building Database-Centric APIs</Title>
                    <Content>
                        Wrapping APIs around database is tedious and error-prone. ZenStack can install CRUD APIs to the
                        framework of your choice with just a few lines of code. Thanks to the built-in access control
                        support, the APIs are fully secure and can be directly exposed to the public. What about
                        documentation? Turn on a plugin and an OpenAPI specification will be generated in seconds.
                    </Content>

                    <div className="max-w-3/4">
                        <Tabs>
                            <TabItem value="Express" label="Express">
                                <img src="/img/home/server-adapter-express.png" />
                                {/* <CodeBlock language="ts">
                                    {`
                        import { withPresets } from '@zenstackhq/runtime';
                        import { ZenStackMiddleware } from '@zenstackhq/server/express';
                        import RestApiHandler from '@zenstackhq/server/api/rpc';
                        
                        app.use(
                          '/api/model',
                          ZenStackMiddleware({
                            getPrisma: (req) => withPresets(prisma, { user: getSessionUser(req) }),
                            handler: RestApiHandler({ endpoint: 'http://localhost/api/model' }) 
                          })
                        );
                        `}
                                </CodeBlock> */}
                            </TabItem>
                            <TabItem value="Fastify" label="Fastify">
                                <img src="/img/home/server-adapter-fastify.png" />
                                {/* <CodeBlock language="ts">
                                    {`
                        import { withPresets } from '@zenstackhq/runtime';
                        import { ZenStackFastifyPlugin } from '@zenstackhq/server/fastify';
                        import RestApiHandler from '@zenstackhq/server/api/rpc';
                        
                        server.register(ZenStackFastifyPlugin, {
                          prefix: '/api/model',
                          getPrisma: (req) => withPresets(prisma, { user: getSessionUser(req) }),
                          handler: RestApiHandler({ endpoint: 'http://localhost/api/model' }) 
                        });
                            `}
                                </CodeBlock> */}
                            </TabItem>
                            <TabItem value="Next.js" label="Next.js">
                                <img src="/img/home/server-adapter-nextjs.png" />
                                {/* <CodeBlock language="ts">
                                    {`
                        import { withPresets } from '@zenstackhq/runtime';
                        import { NextRequestHandler } from '@zenstackhq/server/next';
                        import RestApiHandler from '@zenstackhq/server/api/rest';
                        
                        export default NextRequestHandler({ 
                          getPrisma: (req, res) => withPresets({ user: getSessionUser(req, res) }),
                          handler: RestApiHandler({ endpoint: 'http://localhost/api/model' }) 
                        });
                            `}
                                </CodeBlock> */}
                            </TabItem>
                            <TabItem value="SvelteKit" label="SvelteKit">
                                <img src="/img/home/server-adapter-sveltekit.png" />
                                {/* <CodeBlock language="ts">
                                    {`
                        import { withPresets } from '@zenstackhq/runtime';
                        import { SvelteKitHandler } from '@zenstackhq/server/sveltekit';
                        import RestApiHandler from '@zenstackhq/server/api/rpc';
                        
                        export const handle = SvelteKitHandler({
                          prefix: '/api/model',
                          getPrisma: (event) => withPresets({ user: getSessionUser(event) }),
                          handler: RestApiHandler({ endpoint: 'http://localhost/api/model' }) 
                        });
                            `}
                                </CodeBlock> */}
                            </TabItem>
                        </Tabs>
                    </div>

                    <img className="max-w-3/4 block" src="/img/home/swagger-ui.png" />

                    <LearnMore url="/docs/guides/api" />
                </div>

                <div>
                    <Badge>Full-stack</Badge>
                    <Title>Building Data-Driven Web Apps</Title>
                    <Content></Content>
                </div>
            </div>
        </div>
    );
}
