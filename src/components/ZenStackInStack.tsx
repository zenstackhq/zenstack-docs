import React from 'react';

export default function ZenStackInStack(): JSX.Element {
    return (
        <section className="flex flex-col items-start lg:items-center w-full">
            <div>
                <h2 className="text-2xl lg:text-4xl flex items-center pb-4">
                    <span>Integrates to Every Layer Of Your Stack</span>
                </h2>
            </div>
            <ul className="flex flex-col gap-4 md:gap-0">
                <li>In backend code, as an ORM but with access control</li>
                <li>For building database-centric API</li>
                <li>For building data-driven UI</li>
            </ul>
        </section>
    );
}
