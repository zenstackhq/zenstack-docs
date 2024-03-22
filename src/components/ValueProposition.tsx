import React from 'react';
import PrismaLogo from '../../static/img/prisma.svg';

type FeatureItem = {
    title: string;
    img: string;
    description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
    {
        title: 'Easy access control',
        img: '/img/access-control.png',
        description: (
            <>
                Access control policies right inside your data model. No more brittle imperative authorization code. No
                more complex SQL Row-Level-Security rules.
            </>
        ),
    },
    {
        title: 'Generated API & hooks',
        img: '/img/auto-api.png',
        description: (
            <>
                CRUD APIs and frontend hooks are automatically generated. With access control support, the APIs are safe
                to be called directly from the frontend.
            </>
        ),
    },
    {
        title: 'E2E type safety',
        img: '/img/type-safety.png',
        description: (
            <>
                No more duplicating type definitions and syncing changes. Use one single toolkit to generate types for
                your entire stack and enjoy flawless auto-completion.
            </>
        ),
    },
];

function Proposition({ title, img, description }: FeatureItem) {
    return (
        <div className="w-full flex flex-col space-y-4">
            <img className="block w-20 h-auto aspect-square" src={img} alt={title} />
            <h3 className="text-xl text-bold lg:text-2xl text-gray-800 dark:text-gray-200">{title}</h3>
            <p className="text-base lg:text-lg text-gray-500 dark:text-gray-300">{description}</p>
        </div>
    );
}

export default function ValueProposition(): JSX.Element {
    return (
        <div className="container flex flex-col w-full">
            <span className="text-primary uppercase opacity-50 font-medium">Expand on the APIs you already know</span>
            <h2 className="mt-3 max-readable-text-width flex flex-col text-4xl md:text-5xl leading-relaxed">
                <span className="sr-only">Built on top of Prisma, More than an ORM.</span>
                <span className="inline-flex items-center mb-2 flex-wrap">
                    Built on top of&nbsp;
                    <span className="inline-flex items-center">
                        <a
                            href="https://prisma.io"
                            target="_blank"
                            rel="nofollow noreferrer"
                            className="ml-1 inline-block underline underline-offset-4"
                        >
                            Prisma
                        </a>
                        &nbsp;
                        <PrismaLogo className="inline-block h-8 md:h-12 lg:h-16 w-auto mr-1" />,
                    </span>
                </span>
                <span className="opacity-75">More than an ORM.</span>
            </h2>
            <div className="mt-24 md:mt-28 grid md:grid-cols-3 gap-14 md:gap-8">
                {FeatureList.map((props, idx) => (
                    <Proposition key={idx} {...props} />
                ))}
            </div>
        </div>
    );
}
