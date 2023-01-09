import React, { FC } from 'react';
import {
    FaCode,
    FaPuzzlePiece,
    FaRegHandPeace,
    FaRegSmileBeam,
    FaRocket,
    FaSpellCheck,
} from 'react-icons/fa';

const features = [
    {
        title: 'Intuitive API',
        description:
            'Prisma provides an elegant set of APIs for talking to the database. ZenStack pushes its power further to the frontend.',
        icon: <FaRegSmileBeam size={20} />,
        color: 'dark:bg-emerald-900/50 bg-emerald-200 dark:text-emerald-300 text-emerald-600',
    },
    {
        title: 'E2E type safety',
        description:
            'Type sharing between frontend and backend is effortless thanks to the code generation from a central schema.',
        icon: <FaSpellCheck size={20} />,
        color: 'dark:bg-indigo-900/50 bg-indigo-200 dark:text-indigo-300 text-indigo-600',
    },
    {
        title: 'Extensible schema',
        description:
            "Custom attributes and a plugin system give you the power to extend ZenStack's schema language to your needs.",
        icon: <FaPuzzlePiece size={20} />,
        color: 'dark:bg-amber-900/50 bg-amber-200 dark:text-amber-300 text-amber-600',
    },
    {
        title: 'Fullstack or backend',
        description:
            'Although ZenStack shines in full-stack development, it can also help you build just the backend more efficiently.',
        icon: <FaCode size={20} />,
        color: 'dark:bg-purple-900/50 bg-purple-200 dark:text-purple-300 text-purple-600',
    },
    {
        title: 'Framework agnostic',
        description:
            "ZenStack works with any Javascript framework. It's also easy to migrate your existing Prisma projects.",
        icon: <FaRegHandPeace size={20} />,
        color: 'dark:bg-lime-900/50 bg-lime-200 dark:lime-orange-300 text-lime-600',
    },
    {
        title: 'Uncompromised performance',
        description:
            'Access policies and validation rules are precompiled and pushed down to the database engine whenever possible.',
        icon: <FaRocket size={20} />,
        color: 'dark:bg-sky-900/50 bg-sky-200 dark:lime-sky-300 text-sky-600',
    },
];

export const Features: FC = () => {
    return (
        <div className="flex flex-col items-center">
            <h2 className="text-2xl md:text-3xl pb-8 text-center">
                What's in the whole package
            </h2>
            <div className="grid grid-cols-1 gap-6 mx-auto lg:grid-cols-3">
                {features.map((feature) => {
                    return (
                        <div key={feature.title}>
                            <h2
                                className={`${feature.color} mb-3 rounded-xl w-12 h-12 grid place-items-center`}
                            >
                                {feature.icon}
                            </h2>
                            <h3 className="text-lg font-bold md:text-xl">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 md:text-base">
                                {feature.description}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
