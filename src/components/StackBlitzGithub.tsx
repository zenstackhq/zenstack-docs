import sdk from '@stackblitz/sdk';
import React from 'react';
import GithubCodeBlock from './GithubCodeBlock';

interface StackBlitzGithubProps {
    repoPath: string;
    openFile?: string;
    codeFiles?: string[];
    startScript?: string;
}

const StackBlitzGithub: React.FC<StackBlitzGithubProps> = ({
    repoPath,
    openFile = 'main.ts',
    codeFiles: plainCodeFiles = undefined,
    startScript,
}) => {
    const options = {
        openFile,
        view: 'editor',
        startScript,
    } as const;

    if (!plainCodeFiles) {
        plainCodeFiles = [openFile];
    }

    return (
        <>
            <div className="mb-1">
                Click{' '}
                <a href="#" onClick={() => sdk.openGithubProject(repoPath, options)}>
                    here
                </a>{' '}
                to open an interactive playground.
            </div>
            {plainCodeFiles.map((file) => (
                <GithubCodeBlock key={file} repoPath={repoPath} file={file} />
            ))}
        </>
    );
};

export default StackBlitzGithub;
