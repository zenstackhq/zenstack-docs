import React from 'react';

export default function UseCases(): JSX.Element {
    return (
        <section className="flex flex-col items-start lg:items-center w-full">
            <div>
                <h2 className="text-2xl lg:text-4xl flex items-center pb-4">
                    <span>What Can You Build With ZenStack?</span>
                </h2>
            </div>
            <ul className="flex flex-col gap-4 md:gap-0">
                <li>B2B/SaaS</li>
                <li>B2C Web Apps</li>
                <li>Internal Apps</li>
            </ul>
        </section>
    );
}
