import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import './carousel.css';

function Tweet({ url, image }: { url: string; image: string }) {
    return (
        <a href={url}>
            <img
                src={image}
                className="w-96 p-4 mx-auto my-10 shadow-xl rounded-xl border border-gray-100 border-solid"
            />
        </a>
    );
}

function Quote({ text, author, company, avatar }: { text: string; author: string; company: string; avatar: string }) {
    return (
        <figure className="mx-auto text-center h-full">
            <svg
                aria-hidden="true"
                className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-600"
                viewBox="0 0 24 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z"
                    fill="currentColor"
                />
            </svg>
            <div>
                <p className="max-w-3/4 mx-auto text-2xl italic font-medium text-gray-900 dark:text-white">{text}</p>
            </div>
            <figcaption className="flex items-center justify-center mt-6 space-x-3">
                <img className="h-8 rounded-full" src={avatar} alt="profile picture" />
                <div className="flex items-center divide-x-2 divide-gray-500 dark:divide-gray-700">
                    <cite className="pr-3 font-medium text-gray-900 dark:text-white">{author}</cite>
                    <cite className="pl-3 text-sm text-gray-500 dark:text-gray-400">{company}</cite>
                </div>
            </figcaption>
        </figure>
    );
}

export default function VOC(): JSX.Element {
    var settings = {
        arrows: true,
        autoplay: true,
        infinite: true,
        speed: 600,
        slidesToShow: 1,
        slidesToScroll: 1,
    };
    return (
        <div className="flex flex-col items-start lg:items-center w-full">
            <h2 className="text-2xl lg:text-4xl flex items-center pb-6">Voice of Developers</h2>
            <div className="w-3/4">
                <Slider {...settings}>
                    <div>
                        <Tweet
                            url="https://twitter.com/nikolasburk/status/1625066262555504641"
                            image="/img/home/tweet1.png"
                        />
                    </div>

                    <div>
                        <Tweet
                            url="https://twitter.com/mike_alche/status/1634568367351767041"
                            image="/img/home/tweet2.png"
                        />
                    </div>

                    <div>
                        <Quote
                            text="We have a fairly complex authorization model, and I'm really impressed that ZenStack has the flexibility to support it!"
                            author="Leevis"
                            company="Cofounder Ptmind"
                            avatar="/img/logo/leevis.png"
                        />
                    </div>

                    <div>
                        <Quote
                            text="Thanks for creating such a wonderful product! It was a breeze to adopt, and
                                    everyone in the team loves how easy writing the policies are."
                            author="Sid"
                            company="MermaidChart"
                            avatar="/img/logo/discord.png"
                        />
                    </div>
                </Slider>
            </div>
        </div>
    );
}
