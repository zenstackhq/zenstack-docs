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
};

const StepItems: Omit<StepItem, 'index'>[] = [
    {
        title: 'Define data model',
        description: (
            <>
                Most web apps are just UI talking to a database. It's time to
                trim the unnecessary complexities in between, and let your
                frontend talk to the database directly and securely.
            </>
        ),
        code: <Step1 />,
    },
    {
        title: 'Generate API and client code',
        description: (
            <>
                Data schema and access policies are the core of you app. Define
                them succinctly, keep them together, and generate everything
                else out of this single source of truth.
            </>
        ),
    },
    {
        title: 'Mount the generated API to your framework',
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
        code: <Step3 />,
    },
    {
        title: 'Query data from the frontend',
        description: (
            <>
                Data schema and access policies are the core of you app. Define
                them succinctly, keep them together, and generate everything
                else out of this single source of truth.
            </>
        ),
        code: <Step4 />,
    },
];

function Step({ index, title, description, code }: StepItem) {
    return (
        <div>
            <h3>
                {index}. {title}
            </h3>
            <p>{description}</p>
            {code}
        </div>
    );
}

export default function Steps(): JSX.Element {
    return (
        <section className="flex flex-col items-center align-center py-8 w-full">
            <h2 className="text-3xl py-8">Connect Database to UI in 4 Steps</h2>
            <div className="flex flex-col container px-8 lg:px-16">
                {StepItems.map((props, idx) => (
                    <Step key={idx} {...props} index={idx + 1} />
                ))}
            </div>
        </section>
    );
}
