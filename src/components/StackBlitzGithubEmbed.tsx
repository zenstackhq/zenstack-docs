import React, { useEffect, useRef } from 'react';
import sdk from '@stackblitz/sdk';

interface StackBlitzGithubEmbedProps {
    repoPath: string;
    height?: string;
}

const StackBlitzGithubEmbed: React.FC<StackBlitzGithubEmbedProps> = ({ repoPath, height = '600px' }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            sdk.embedGithubProject(containerRef.current, repoPath, {
                openFile: 'main.ts',
                height,
                view: 'editor',
                forceEmbedLayout: true,
            });
        }
    }, [repoPath, height]);

    return <div ref={containerRef} style={{ width: '100%', height }} />;
};

export default StackBlitzGithubEmbed;
