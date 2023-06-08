import React from 'react';

export default function VOC(): JSX.Element {
    return (
        <section className="flex flex-col items-start lg:items-center w-full">
            <div>
                <h2 className="text-2xl lg:text-4xl flex items-center pb-4">
                    <span>Voice of Developers</span>
                </h2>
            </div>
            <ul className="flex flex-col gap-4 md:gap-0"></ul>
        </section>
    );
}
