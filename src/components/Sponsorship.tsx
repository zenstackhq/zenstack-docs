import React from 'react';
export default function Sponsorship(): JSX.Element {
    return (
        <div className="flex justify-center w-full">
            <div className="flex flex-col text-center xl:w-3/4">
                <h2 className="text-2xl md:text-3xl lg:text-4xl pb-20">Our Generous Sponsors</h2>
                <div className="flex flex-auto justify-center">
                    <Sponsor src="/img/logo/marblism-logo.png" name="Marblism" website="https://www.marblism.com/?utm_source=zen" />
                </div>
            </div>
        </div>
    );
}

function Sponsor({ src, name, website }: { src: string; name: string; website: string }): JSX.Element {
    const alt = src.split('/').pop()?.split('.')[0] ?? 'logo';
    return (
        <a href={website} target="_blank" className="no-underline">
            <img src={src} className="h-40 object-contain" alt={alt} />
            <h2>{name}</h2>
        </a>
    );
}
