import React from 'react';
import PrismaLogo from '../../static/img/prisma.svg';

type FeatureItem = {
    title: string;
    svg: React.ComponentType<React.ComponentProps<'svg'>>;
    description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
    {
        title: 'Stop wrapping APIs around DB',
        svg: require('@site/static/img/db-api.svg').default,
        description: (
            <>
                Most web apps are just UI talking to a database. It's time to
                trim the unnecessary plumbing in between and let your frontend
                speak to the database directly and securely.
            </>
        ),
    },
    {
        title: 'Keep a single source of truth',
        svg: require('@site/static/img/ssot.svg').default,
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
        svg: require('@site/static/img/type-safety.svg').default,
        description: (
            <>
                No more duplicating type definitions and manually syncing
                changes. Use one single toolkit to generate types for your
                entire stack, and enjoy flawless auto-completion.
            </>
        ),
    },
];

function Proposition({ title, svg: Svg, description }: FeatureItem) {
    return (
        <div className="lg:max-w-1/3 w-full">
            <div className="text-center">
                <Svg className="w-48 h-48" role="img" />
            </div>
            <div className="text--center padding-horiz--md">
                <h3 className="text-xl text-bold text-left lg:text-center">
                    {title}
                </h3>
                <p className="text-left lg:text-center text-base">
                    {description}
                </p>
            </div>
        </div>
    );
}

export default function ValueProposition(): JSX.Element {
    return (
        <section className="flex flex-col items-start lg:items-center w-full">
            <div>
                <h2 className="text-2xl lg:text-4xl flex items-center pb-4">
                    <span>
                        A Power Pack for{' '}
                        <a
                            href="https://prisma.io"
                            target="_blank"
                            className="underline"
                        >
                            Prisma
                        </a>
                    </span>
                    <PrismaLogo className="w-8 h-8 ml-1 hidden lg:block" />
                </h2>
            </div>
            <p className="max-w-[720px] text-left lg:text-center text-base md:text-lg mb-8">
                Prisma is a fantastic battle-tested ORM that abstracts away
                database complexities. ZenStack unleashes its full potential and
                lets you build web apps even faster.
            </p>{' '}
            <div className="flex flex-wrap gap-4 md:gap-0">
                {FeatureList.map((props, idx) => (
                    <Proposition key={idx} {...props} />
                ))}
            </div>
        </section>
    );
}
