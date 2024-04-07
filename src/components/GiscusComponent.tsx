import React from 'react';
import Giscus from '@giscus/react';
import { useColorMode } from '@docusaurus/theme-common';

export default function GiscusComponent() {
    const { colorMode } = useColorMode();

    return (
        <div style={{ paddingTop: 32 }}>
            <h6>Comments</h6>
            <span>
                Feel free to ask questions, give feedback, or report issues.{' '}
                <p
                    className={'text-sm text-gray-500 italic'}
                    style={{
                        display: 'inline',
                        fontStyle: 'italic',
                    }}
                >
                    Don't Spam
                </p>
            </span>
            <hr />
            <div className={'text-sm text-gray-600'}>
                You can edit/delete your comments by going directly to the discussion, clicking on the 'comments' link
                below
            </div>
            <div
                style={{
                    padding: 2,
                    backgroundColor: colorMode === 'dark' ? '#1e1e1e' : 'rgb(255, 255, 255)',
                }}
            >
                <Giscus
                    repo="zenstachhq/zenstack-docs"
                    repoId="R_kgDOIvA9Bg"
                    category="Comments"
                    categoryId="DIC_kwDOIvA9Bs4Cego9" // id of "Comments"
                    mapping="pathname" // Important! To map comments to URL
                    term="Welcome zenstack site comments!"
                    strict="0"
                    reactionsEnabled="1"
                    emitMetadata="0"
                    inputPosition="top"
                    theme={colorMode}
                    lang="en"
                    loading="lazy"
                />
            </div>
        </div>
    );
}
