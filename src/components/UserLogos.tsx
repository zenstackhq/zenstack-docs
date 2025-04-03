import React from 'react';

interface UserLogoProps {
    src: string;
    name: string;
    website: string;
    className?: string;
    style?: React.CSSProperties;
    imageStyle?: React.CSSProperties;
    darkSrc?: string;
}

function UserLogo({ src, name, website, className, style }: UserLogoProps): JSX.Element {
    return (
        <div className="flex flex-col items-center gap-4">
            <img src={src} className="object-contain w-28 dark:hidden" alt={name} style={imageStyle} />
            <img src={darkSrc ?? src} className="object-contain hidden dark:block w-28" alt={name} style={imageStyle} />
            <a className={className} href={website} style={style}>
                {name}
            </a>
        </div>
    );
}

export default function UserLogs(): JSX.Element {
    return (
        <div className="flex justify-center w-full">
            <div className="flex flex-col text- center xl:w-3/4">
                <h2 className="text-2xl md:text-3xl lg:text-4xl pb-20">Used and Loved by</h2>
                <div className="flex flex-wrap justify-evenly gap-8 items-end w-full font-bold">
                    <UserLogo
                        src="/img/logo/marblism-logo.png"
                        name="Marblism"
                        website="https://www.marblism.com/?utm_source=zen"
                        className="text-gray-500 hover:text-gray-500"
                    />
                    <UserLogo
                        src="/img/logo/coderabbit.png"
                        name="CodeRabbit"
                        website="https://coderabbit.ai/"
                        style={{ color: 'rgb(236 86 41)' }}
                    />
                    <UserLogo
                        src="/img/logo/veeva.svg"
                        name="Veeva"
                        website="https://quickvault.veeva.com/"
                        style={{ color: 'rgb(236 159 69)' }}
                    />
                    <UserLogo
                        src="/img/logo/mermaidicon.svg"
                        name="Mermaid Chart"
                        website="https://www.mermaidchart.com/"
                        style={{ color: 'rgb(236 75 114)' }}
                    />
                    <UserLogo
                        src="/img/logo/techlockdown.png"
                        name="TECH LOCKDOWN"
                        website="https://www.techlockdown.com/"
                        className="text-gray-500 hover:text-gray-500"
                    />
                    <UserLogo
                        src="/img/logo/carrot.jpeg"
                        name="Carrot"
                        website="https://carrot.tech/"
                        style={{ color: 'rgb(231, 235, 93)' }}
                    />
                    <UserLogo
                        src="/img/logo/brainbase.svg"
                        darkSrc="/img/logo/brainbase_dark.svg"
                        name="Brainbase"
                        website="https://usebrainbase.com/"
                        style={{ color: 'rgb(59, 59, 59)' }}
                        imageStyle={{ padding: '0.6em' }}
                    />
                </div>
            </div>
        </div>
    );
}
