import clsx from 'clsx';
import React from 'react';

export const Twitter = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={36}
        height={36}
        fill="none"
        {...props}
        viewBox="0 0 24 24"
        className={clsx('text-black dark:text-white', props.className)}
    >
        <title>Twitter</title>
        <rect
            width={24}
            height={24}
            fill="currentColor"
            rx={12}
            className={clsx('text-gray-200 dark:text-black', props.className)}
        />
        <path
            fill="currentColor"
            fillRule="evenodd"
            d="m6 6 4.62 6.75L6.098 18H7.1l3.963-4.604L14.214 18H18l-4.827-7.052L17.433 6h-1l-3.703 4.3L9.786 6H6Zm1.196.632h2.258l7.35 10.736h-2.258L7.196 6.632Z"
            clipRule="evenodd"
        />
    </svg>
);
