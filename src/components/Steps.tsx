import React from 'react';
import { ReactNode } from 'react';
import Step1 from '../../docs/home/_step1.md';
import Step3 from '../../docs/home/_step3.md';
import Step4 from '../../docs/home/_step4.md';

type StepItem = {
    index: number;
    title: string;
    description: JSX.Element;
    code?: ReactNode;
    video?: { url: string; cover: string };
};

const StepItems: Omit<StepItem, 'index'>[] = [
    {
        title: 'Define data model',
        description: (
            <>
                <p>
                    ZenStack provides a data modeling language that's a superset
                    of Primsa schema. It adds <strong>custom attributes</strong>
                    , <strong>custom functions</strong> and a set of standard
                    attributes for declaring{' '}
                    <span className="text-primary">
                        <strong>access policies</strong>
                    </span>{' '}
                    and{' '}
                    <span className="text-primary">
                        <strong>validation rules</strong>
                    </span>
                    .
                </p>
                <p>
                    In this example, <code>@allow</code> attribute is used for
                    attaching CRUD permissions to the models. These will be
                    enforced automatically in the back-end services by using an
                    enhanced Prisma client.
                </p>
                <p>
                    Most people with Prisma experiences find it easy to pick up
                    ZenStack. Prisma schema itself is also very intuitive, so
                    don't worry if it's new to you.
                </p>
            </>
        ),
        code: <Step1 />,
    },
    {
        title: 'Generate API and client code',
        description: (
            <>
                <p>
                    A CLI is provided to generate code from the schema,
                    typically including Prisma schema, access policy rules,
                    strongly typed frontend data query libraries (hooks), as
                    well as{' '}
                    <a href="https://trpc.io" target="_blank">
                        tRPC
                    </a>{' '}
                    routers (if you've enabled the plugin).
                </p>
                <p>
                    The toolkit is <strong>extensible</strong>, so you can write
                    your own plugins to run custom code generation. Plugins have
                    access to the AST parsed from the schema, and can declare
                    custom attributes and functions.
                </p>
            </>
        ),
        video: {
            url: '/video/zenstack-generate.mp4',
            cover: '/video/zenstack-generate.png',
        },
    },
    {
        title: 'Mount CRUD services as an API route',
        description: (
            <>
                <p>
                    To add a set of APIs that wrap around the database, use a
                    framework-specific helper to create a request handler and
                    install it as an API route. The example here demonstrates
                    the integration with Next.js. Check out documentation for
                    guides about other frameworks.
                </p>
                <p>
                    The services are a thin wrapper around Prisma and exposes
                    all essential query and mutation operations, like{' '}
                    <code>findMany</code>, <code>create</code>,{' '}
                    <code>update</code>, and <code>aggregate</code>, etc.
                </p>
                <p>
                    If you're a fan of{' '}
                    <a href="https://trpc.io" target="_blank">
                        tRPC
                    </a>
                    , you can also use the tRPC plugin to generate routers, and
                    include them in your tRPC setup.
                </p>
            </>
        ),
        code: <Step3 />,
    },
    {
        title: 'Query and mutate from the frontend',
        description: (
            <>
                <p>
                    You can now use the generated front-end library (hooks) to
                    talk to the API. The library is fully typed and offers
                    exactly the same programming experiences like using a Prisma
                    client on the server side. This example shows how to query
                    in a React component.
                </p>
                <p>
                    All client requests are governed by the access policies
                    defined in the schema, so even if you don't add any filter,
                    the client can't accidently read or write data that's not
                    supposed to be allowed.
                </p>
            </>
        ),
        code: <Step4 />,
    },
];

function Video({ videoUrl, coverUrl }: { videoUrl: string; coverUrl: string }) {
    return (
        <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full shadow-xl rounded-lg p-4 bg-black"
        >
            <source src={videoUrl} type="video/mp4" />
            You need a browser that supports HTML5 video to view this video.
        </video>
    );
}

function Step({ index, title, description, code, video }: StepItem) {
    return (
        <div>
            <div className="flex mb-2">
                <div className="flex flex-none text-white dark:text-gray-800 bg-primary items-center justify-center w-7 h-7 rounded-full mr-2">
                    {index}
                </div>{' '}
                <h3>{title}</h3>
            </div>
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-16">
                <div className="lg:w-1/3">{description}</div>
                {code && (
                    <div className="lg:flex-grow overflow-hidden">{code}</div>
                )}
                {video && (
                    <div className="flex lg:w-2/3">
                        <Video videoUrl={video.url} coverUrl={video.cover} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Steps(): JSX.Element {
    return (
        <section className="flex flex-col items-center align-center lg:p-8">
            <h2 className="text-2xl md:text-3xl pb-8 text-center">
                From Database to UI in 4 Steps
            </h2>
            <div className="flex flex-col w-full gap-8">
                {StepItems.map((props, idx) => (
                    <Step key={idx} {...props} index={idx + 1} />
                ))}
            </div>
        </section>
    );
}
