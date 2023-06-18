import React from 'react';

function Tweet({ url, image }: { url: string; image: string }) {
    return (
        <div className="w-[300px] h-[426px] md:w-[360px] md:h-[512px]">
            <a href={url}>
                <img src={image} className="p-4 h-full shadow-xl rounded-xl border border-gray-100 border-solid" />
            </a>
        </div>
    );
}

function Quote({
    author,
    company,
    avatar,
    children,
}: {
    author: string;
    company: string;
    avatar: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex justify-center items-center w-[300px] h-[426px] md:w-[360px] md:h-[512px] p-4 shadow-xl rounded-xl border border-gray-100 border-solid">
            <div className="flex flex-col h-full text-center py-6">
                <div className="flex-grow flex items-center justify-center">
                    <div className="flex flex-col">
                        <svg
                            aria-hidden="true"
                            className="w-8 h-8 lg:w-10 lg:h-10 mx-auto mb-3 text-gray-400 dark:text-gray-600"
                            viewBox="0 0 24 27"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z"
                                fill="currentColor"
                            />
                        </svg>
                        <p className="text-lg md:text-xl italic px-4 pb-6 font-medium text-gray-800 dark:text-white">
                            {children}
                        </p>
                    </div>
                </div>
                <figcaption className="flex items-center justify-center space-x-3">
                    <img className="h-8 rounded-full" src={avatar} alt="profile picture" />
                    <div className="flex items-center divide-x-2 divide-gray-500 dark:divide-gray-700">
                        <cite className="pr-3 font-medium text-gray-900 dark:text-white">{author}</cite>
                        <cite className="pl-3 text-sm text-gray-500 dark:text-gray-400">{company}</cite>
                    </div>
                </figcaption>
            </div>
        </div>
    );
}

export default function VOC(): JSX.Element {
    return (
        <div className="flex flex-col items-start lg:items-center w-full">
            <h2 className="text-2xl md:text-3xl lg:text-4xl flex items-center pb-20 mx-auto">Voice of Developers</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-16 mx-auto">
                <Tweet url="https://twitter.com/nikolasburk/status/1625066262555504641" image="/img/home/tweet1.png" />

                <Tweet url="https://twitter.com/mike_alche/status/1634568367351767041" image="/img/home/tweet2.png" />

                <Tweet
                    url="https://twitter.com/faruk_encoded/status/1637358537121624066"
                    image="/img/home/tweet3.png"
                />

                <Quote author="Leevis" company="Cofounder Ptmind" avatar="/img/logo/leevis.png">
                    We have a fairly complex authorization model, and I'm really impressed that ZenStack has the
                    flexibility to support it!
                </Quote>

                <Quote
                    author="Sid"
                    company="MermaidChart"
                    avatar="https://avatars.githubusercontent.com/u/10703445?v=4"
                >
                    We've launched{' '}
                    <a href="https://www.mermaidchart.com/" target="_blank">
                        MermaidChart
                    </a>
                    's team feature using ZenStack. Thanks for creating such a wonderful product! It was a breeze to
                    adopt, and everyone in the team loves how easy writing the policies are.
                </Quote>

                <Quote author="Augustin" company="" avatar="https://avatars.githubusercontent.com/u/43639468">
                    Thank you @ymc9 and @jiasheng for all the hard work 👏. It's great to have so many features already
                    for a beta. Can't wait for version 1.0 😄.
                </Quote>
            </div>
        </div>
    );
}
