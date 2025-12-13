import sdk from '@stackblitz/sdk';
import React from 'react';
import GithubCodeBlock from './GithubCodeBlock';

interface StackBlitzGithubProps {
    repoPath: string;
    openFile?: string | string[];
    codeFiles?: string[];
    startScript?: string;
}

const StackBlitzGithub: React.FC<StackBlitzGithubProps> = ({
    repoPath,
    openFile = 'main.ts',
    codeFiles: plainCodeFiles = undefined,
    startScript,
}) => {
    const openFiles = Array.isArray(openFile) ? openFile : openFile ? openFile.split(',') : [];

    const options = {
        openFile: openFiles ? openFiles.join(',') : undefined,
        view: 'editor',
        startScript,
    } as const;

    if (!plainCodeFiles) {
        plainCodeFiles = [...openFiles];
    }

    return (
        <>
            <a href="#" onClick={() => sdk.openGithubProject(repoPath, options)}>
                <img alt="Open in StackBlitz" src="https://developer.stackblitz.com/img/open_in_stackblitz.svg" />
            </a>
            {plainCodeFiles.map((file) => (
                <GithubCodeBlock key={file} repoPath={repoPath} file={file} />
            ))}
        </>
    );
};

export default StackBlitzGithub;
