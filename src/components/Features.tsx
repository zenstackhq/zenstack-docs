import React from 'react';

type FeatureItem = {
    title: string;
    Svg: React.ComponentType<React.ComponentProps<'svg'>>;
    description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
    {
        title: 'Skip backend boilerplate',
        Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
        description: (
            <>
                Most web apps are just UI talking to a database. It's time to
                trim the unnecessary complexities in between, and let your
                frontend talk to the database directly and securely.
            </>
        ),
    },
    {
        title: 'Single source of truth',
        Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
        description: (
            <>
                Data schema and access policies are the core of you app. Define
                them succinctly, keep them together, and generate everything
                else out of this single source of truth.
            </>
        ),
    },
    {
        title: 'Powered by Prisma',
        Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
        description: (
            <>
                Encapsulating database is a difficult task and there's no reason
                to reinvent the wheel. Instead, we built ZenStack as a powerful
                extension to the battle-tested ORM -{' '}
                <a href="https://prisma.io" target="_blank">
                    Prisma
                </a>
                .
            </>
        ),
    },
];

function Feature({ title, Svg, description }: FeatureItem) {
    return (
        <div className="lg:max-w-1/3 w-full">
            <div className="text--center">
                <Svg className="w-48 h-48" role="img" />
            </div>
            <div className="text--center padding-horiz--md">
                <h3>{title}</h3>
                <p className="text-center">{description}</p>
            </div>
        </div>
    );
}

export default function HomepageFeatures(): JSX.Element {
    return (
        <section className="flex align-center py-8 w-full">
            <div className="container mx-auto px-8 lg:px-16">
                <div className="row">
                    {FeatureList.map((props, idx) => (
                        <Feature key={idx} {...props} />
                    ))}
                </div>
            </div>
        </section>
    );
}
