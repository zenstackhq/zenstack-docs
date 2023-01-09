import React from 'react';

type FeatureItem = {
    title: string;
    Svg: React.ComponentType<React.ComponentProps<'svg'>>;
    description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
    {
        title: 'Stop wrapping APIs around database',
        Svg: require('@site/static/img/db-api.svg').default,
        description: (
            <>
                Most web apps are just UI talking to a database. It's time to
                trim the unnecessary plumbing in between, and let your frontend
                talk to the database directly and securely.
            </>
        ),
    },
    {
        title: 'Keep a single source of truth',
        Svg: require('@site/static/img/ssot.svg').default,
        description: (
            <>
                Data schema and access policies are the core of your app. Define
                them succinctly, keep them together, and generate everything
                else out of this single source of truth.
            </>
        ),
    },
    {
        title: 'Enjoy end-to-end type safety',
        Svg: require('@site/static/img/type-safety.svg').default,
        description: (
            <>
                No more duplicating type definitions and manually syncing
                changes. Use one single toolkit to generate types for your
                entire stack, and enjoy flawless auto-completion.
            </>
        ),
    },
];

function Proposition({ title, Svg, description }: FeatureItem) {
    return (
        <div className="lg:max-w-1/3 w-full">
            <div className="text--center">
                <Svg className="w-48 h-48" role="img" />
            </div>
            <div className="text--center padding-horiz--md">
                <h3 className="text-xl text-bold">{title}</h3>
                <p className="text-center text-base">{description}</p>
            </div>
        </div>
    );
}

export default function ValueProposition(): JSX.Element {
    return (
        <section className="flex flex-col items-center w-full">
            <h2 className="text-2xl md:text-3xl">
                A Power Pack for{' '}
                <a
                    href="https://prisma.io"
                    target="_blank"
                    className="underline"
                >
                    Prisma
                </a>
            </h2>
            <p className="max-w-[720px] text-center text-base md:text-lg mb-8">
                Prisma is a fantastic battle-tested ORM that abstracts away
                database complexities. ZenStack extends its power and lets you
                build web apps even faster.
            </p>{' '}
            <div className="flex flex-wrap gap-4 md:gap-0">
                {FeatureList.map((props, idx) => (
                    <Proposition key={idx} {...props} />
                ))}
            </div>
        </section>
    );
}
