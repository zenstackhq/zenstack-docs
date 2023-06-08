import React from 'react';
import PrismaLogo from '../../static/img/prisma.svg';

type FeatureItem = {
    title: string;
    img: string;
    description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
    {
        title: 'Easy Access Control',
        img: '/img/access-control.png',
        description: (
            <>
                Access control policies right inside your data model. No more brittle imperative authorization code. No
                more complex SQL Row-Level-Security rules.
            </>
        ),
    },
    {
        title: 'Generated API & Hooks',
        img: '/img/auto-api.png',
        description: (
            <>
                CRUD APIs and frontend hooks are automatically generated. With the access control support, the APIs are
                safe to be called directly from the frontend.
            </>
        ),
    },
    {
        title: 'E2E Type Safety',
        img: '/img/type-safety.png',
        description: (
            <>
                No more duplicating type definitions and syncing changes. Use one single toolkit to generate types for
                your entire stack, and enjoy flawless auto-completion.
            </>
        ),
    },
];

function Proposition({ title, img, description }: FeatureItem) {
    return (
        <div className="lg:max-w-1/3 w-full">
            <div className="text-center">
                <img className="w-48 p-10" src={img} />
            </div>
            <div className="text--center padding-horiz--md">
                <h3 className="text-xl text-bold text-left lg:text-center lg:text-2xl">{title}</h3>
                <p className="text-left lg:text-center text-base lg:text-lg">{description}</p>
            </div>
        </div>
    );
}

export default function ValueProposition(): JSX.Element {
    return (
        <div className="flex flex-col items-start lg:items-center w-full">
            <div>
                <h2 className="text-2xl lg:text-4xl flex items-center pb-4">
                    <span>
                        Built Above{' '}
                        <a href="https://prisma.io" target="_blank" className="underline">
                            Prisma
                        </a>
                    </span>
                    <PrismaLogo className="w-8 h-8 ml-1 hidden lg:block" />
                    {', '}
                    <span className="ml-4"> More Than ORM</span>
                </h2>
            </div>
            <div className="flex flex-wrap gap-4 md:gap-0">
                {FeatureList.map((props, idx) => (
                    <Proposition key={idx} {...props} />
                ))}
            </div>
        </div>
    );
}
