import React from 'react';

export default function UsedInProduction(): JSX.Element {
    return (
        <section className="flex flex-col items-start lg:items-center w-full">
            <h2 className="text-2xl lg:text-4xl pb-16">Powered by ZenStack</h2>
            <div className="flex flex-row items-center gap-12">
                <a href="https://ptengine.com">
                    <img className="h-12" src="/img/logo/ptengine.svg" />
                </a>
                <a href="https://www.mermaidchart.com/">
                    {' '}
                    <img className="h-8" src="/img/logo/mermaidchart.svg" />
                </a>
                <a href="https://forevervacation.com">
                    <img className="h-12" src="/img/logo/forevervacation.png" />
                </a>
            </div>
        </section>
    );
}
