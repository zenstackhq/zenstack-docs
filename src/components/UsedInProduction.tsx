import React from 'react';

export default function UsedInProduction(): JSX.Element {
    return (
        <section className="flex flex-col items-start lg:items-center w-full">
            <div>
                <h2 className="text-2xl lg:text-4xl flex items-center pb-4">
                    <span>Powered by ZenStack In Production</span>
                </h2>
            </div>
            <div className="flex flex-col gap-4 md:gap-0">
                <p>Ptengine</p>
                <p>Mermaid Chart</p>
                <p>ForeverVacation</p>
            </div>
        </section>
    );
}
