import sdk from '@stackblitz/sdk';
import TabItem from '@theme/TabItem';
import Tabs from '@theme/Tabs';
import mobile from 'is-mobile';
import React, { useEffect, useRef } from 'react';
import GithubCodeBlock from './GithubCodeBlock';

interface StackBlitzGithubEmbedProps {
    repoPath: string;
    height?: string;
    openFile?: string;
    plainCodeFiles?: string[];
    startScript?: string;
    clickToLoad?: boolean;
}

const StackBlitzGithubEmbed: React.FC<StackBlitzGithubEmbedProps> = ({
    repoPath,
    height = '600px',
    openFile = 'main.ts',
    plainCodeFiles = undefined,
    clickToLoad = false,
    startScript,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const options = {
        openFile,
        height,
        view: 'editor',
        startScript,
        clickToLoad,
    } as const;

    if (!plainCodeFiles) {
        plainCodeFiles = [openFile];
    }

    useEffect(() => {
        if (containerRef.current) {
            sdk.embedGithubProject(containerRef.current, repoPath, options);
        }
    }, [repoPath, height]);

    const PlainCode = () => (
        <>
            {plainCodeFiles.map((file) => (
                <GithubCodeBlock key={file} repoPath={repoPath} file={file} />
            ))}
        </>
    );

    if (mobile()) {
        return <PlainCode />;
    } else {
        return (
            <Tabs>
                <TabItem value="interactive" label="Interactive Sample" default>
                    <div>
                        <div className="italic text-sm mb-1">
                            Click{' '}
                            <a href="#" onClick={() => sdk.openGithubProject(repoPath, options)}>
                                here
                            </a>{' '}
                            to pop out if the embed doesn't load an interactive terminal.
                        </div>
                        <div ref={containerRef} style={{ width: '100%', height }} />
                    </div>
                </TabItem>
                <TabItem value="static" label="Plain Code">
                    <PlainCode />
                </TabItem>
            </Tabs>
        );
    }
};

export default StackBlitzGithubEmbed;
