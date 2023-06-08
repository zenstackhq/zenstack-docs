import React from 'react';

export default function UseCases(): JSX.Element {
    return (
        <section className="flex flex-col items-start lg:items-center w-full">
            <div className="flex flex-col w-3/4">
                <h2 className="text-2xl lg:text-4xl m-auto pb-16">What Can You Build With ZenStack?</h2>
                <div className="gap-8 items-center py-8 px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-2 sm:py-16 lg:px-6">
                    <div className="w-full flex justify-center">
                        <img className="w-80" src="/img/home/saas.png" alt="SaaS" />
                    </div>
                    <div className="mt-4 md:mt-0">
                        <h2 className="mb-4 text-3xl tracking-tight font-semibold">Software as a Service</h2>
                        <p className="mb-6 font-light text-gray-600 md:text-lg">
                            SaaS applications are by nature multi-tenant, and tenant data isolation is a key
                            requirement. Modern SaaS typically offer features involving collaboration and data sharing,
                            which further complicates the implementation.
                            <br />
                            <br />
                            ZenStack's unique way of centrally and declaratively defining data access policies helps you
                            achieve a clean, reliable, and DRY authorization model with significantly less effort.
                        </p>
                        <a href="/blog/multi-tenant">Learn More →</a>
                    </div>
                </div>

                <div className="gap-8 items-center py-8 px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-2 sm:py-16 lg:px-6">
                    <div className="mt-4 md:mt-0">
                        <h2 className="mb-4 text-3xl tracking-tight font-semibold">B2C Applications</h2>
                        <p className="mb-6 font-light text-gray-600 md:text-lg">
                            ZenStack streamlines full-stack development by automatically generating APIs and frontend
                            hooks, all from the single source of truth - your data model. This helps you and your team
                            reduce the time to market.
                            <br />
                            <br />
                            Write less boilerplate code. Focus on shipping features!
                        </p>
                    </div>
                    <div className="w-full flex justify-center">
                        <img className="w-80" src="/img/home/b2c.png" alt="SaaS" />
                    </div>
                </div>

                <div className="gap-8 items-center py-8 px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-2 sm:py-16 lg:px-6">
                    <div className="w-full flex justify-center">
                        <img className="w-80 p-4" src="/img/home/internal-tools.png" alt="SaaS" />
                    </div>
                    <div className="mt-4 md:mt-0">
                        <h2 className="mb-4 text-3xl tracking-tight font-semibold">Internal Tools</h2>
                        <p className="mb-6 font-light text-gray-600 md:text-lg">
                            Be it a workflow management system, a customer support tool, or a data analytics dashboard,
                            ZenStack helps you organize business entities with ease and query data with unlimited
                            flexibility. An alternative when No-Code builders can't cut it.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
