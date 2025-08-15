import React, { useEffect, useRef } from 'react';
import sdk from '@stackblitz/sdk';

interface StackBlitzEmbedProps {
    projectId: string;
    height?: string;
}

const StackBlitzEmbed: React.FC<StackBlitzEmbedProps> = ({ projectId, height = '600px' }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            sdk.embedProjectId(containerRef.current, projectId, {
                openFile: 'main.ts',
                height,
                view: 'editor',
                forceEmbedLayout: true,
            });
        }
    }, [projectId, height]);

    return <div ref={containerRef} style={{ width: '100%', height }} />;
};

export default StackBlitzEmbed;
