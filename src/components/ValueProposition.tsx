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
                CRUD APIs and frontend hooks are automatically generated. With access control support, the APIs are safe
                to be called directly from the frontend.
            </>
        ),
    },
    {
        title: 'E2E Type Safety',
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
        <div className="lg:max-w-1/3 w-full">
            <div className="text-center">
                <img className="w-48 p-10" src={img} />
            </div>
            <div className="text--center padding-horiz--md">
                <h3 className="text-xl text-bold text-center lg:text-2xl text-gray-700 dark:text-gray-300">{title}</h3>
                <p className="text-center text-base lg:text-lg text-gray-600 dark:text-gray-400">{description}</p>
            </div>
        </div>
    );
}

export default function ValueProposition(): JSX.Element {
    return (
        <div className="flex flex-col items-start lg:items-center w-full">
            <div className="w-full">
                <h2 className="flex flex-col lg:flex-row text-2xl md:text-3xl lg:text-4xl items-center justify-center pb-4">
                    <div className="flex items-center">
                        <span>
                            Built Above{' '}
                            <a href="https://prisma.io" target="_blank" className="underline">
                                Prisma
                            </a>
                        </span>
                        <PrismaLogo className="w-6 h-6 lg:w-8 lg:h-8 ml-1" />
                        <span className="hidden lg:inline">{', '} </span>
                    </div>
                    <div className="lg:ml-4">More Than ORM</div>
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
