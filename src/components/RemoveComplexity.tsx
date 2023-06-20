import React from 'react';

export default function RemoveComplexity(): JSX.Element {
    return (
        <section className="flex flex-col items-start lg:items-center w-full">
            <div>
                <h2 className="text-2xl lg:text-4xl flex items-center pb-4">
                    <span>Remove Complexity, Not Move Them Around</span>
                </h2>
            </div>
            <div className="container">
                ZenStack is a toolkit/library, not another service. Unlike products like Supabase, Hasura, and Convex,
                it solves problems without forcing you to depend on one more self-hosted or third-party service.
                Instead, it extends the power of the Node.js server you already have.
            </div>
        </section>
    );
}
