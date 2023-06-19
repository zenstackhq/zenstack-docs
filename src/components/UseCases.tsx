import React from 'react';

function Title({ children }: { children: React.ReactNode }) {
    return <h3 className="mb-4 text-xl md:text-2xl lg:text-3xl tracking-tight font-semibold">{children}</h3>;
}

function Content({ children }: { children: React.ReactNode }) {
    return <p className="mb-4 font-light text-slate-700 dark:text-slate-400 md:text-lg">{children}</p>;
}

export default function UseCases(): JSX.Element {
    return (
        <section className="flex flex-col items-center w-full">
            <div className="flex flex-col xl:w-3/4 gap-12 lg:gap-16">
                <h2 className="text-center text-2xl md:text-3xl lg:text-4xl m-auto pb-4 lg:pb-16">
                    What Can You Build With ZenStack?
                </h2>
                <div className="gap-8 w-full px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-2 lg:px-6">
                    <div className="w-full flex justify-center">
                        <img className="w-80" src="/img/home/saas.png" alt="SaaS" />
                    </div>
                    <div className="mt-4 md:mt-0">
                        <Title>Software as a Service</Title>
                        <Content>
                            SaaS applications are by nature multi-tenant, and tenant data isolation is a key
                            requirement. Modern SaaS typically offers features involving collaboration and data sharing,
                            further complicating implementation.
                            <br />
                            <br />
                            ZenStack's unique way of centrally and declaratively defining data access policies helps you
                            achieve a clean, reliable, and DRY authorization model with significantly less effort.
                        </Content>
                        <a href="/blog/multi-tenant">Learn More →</a>
                    </div>
                </div>

                <div className="gap-8 items-center px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-2 lg:px-6">
                    <div className="flex lg:hidden w-full justify-center">
                        <img className="w-80" src="/img/home/b2c.png" alt="SaaS" />
                    </div>
                    <div className="mt-4 md:mt-0">
                        <Title>B2C Applications</Title>
                        <Content>
                            ZenStack streamlines full-stack development by automatically generating APIs and frontend
                            hooks, all from the single source of truth - your data model. This helps you and your team
                            reduce the time to market.
                            <br />
                            <br />
                            Write less boilerplate code. Focus on shipping features!
                        </Content>
                    </div>
                    <div className="hidden lg:flex w-full justify-center">
                        <img className="w-80" src="/img/home/b2c.png" alt="SaaS" />
                    </div>
                </div>

                <div className="gap-8 items-center px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-2 lg:px-6">
                    <div className="w-full flex justify-center">
                        <img className="w-80 p-4" src="/img/home/internal-tools.png" alt="SaaS" />
                    </div>
                    <div className="mt-4 md:mt-0">
                        <Title>Internal Tools</Title>
                        <Content>
                            Whether a workflow management system, a customer support tool, or a data analytics
                            dashboard, ZenStack helps you easily organize business entities and query data with
                            unlimited flexibility — an alternative when No-Code builders can't cut it.
                        </Content>
                    </div>
                </div>
            </div>
        </section>
    );
}
