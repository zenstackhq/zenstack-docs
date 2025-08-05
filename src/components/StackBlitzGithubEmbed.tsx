import React, { useEffect, useRef } from 'react';
import sdk from '@stackblitz/sdk';

interface StackBlitzGithubEmbedProps {
    repoPath: string;
    height?: string;
    openFile?: string;
    startScript?: string;
    clickToLoad?: boolean;
}

const StackBlitzGithubEmbed: React.FC<StackBlitzGithubEmbedProps> = ({
    repoPath,
    height = '600px',
    openFile = 'main.ts',
    clickToLoad = false,
    startScript,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            sdk.embedGithubProject(containerRef.current, repoPath, {
                openFile,
                height,
                view: 'editor',
                hideNavigation: true,
                startScript,
                clickToLoad,
            });
        }
    }, [repoPath, height]);

    return <div ref={containerRef} style={{ width: '100%', height }} />;
};

export default StackBlitzGithubEmbed;
