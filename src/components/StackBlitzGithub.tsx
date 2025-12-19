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

    // construct StackBlitz URL
    const url = new URL(`https://stackblitz.com/~/github/${repoPath}`);
    url.searchParams.append('view', 'editor');
    if (openFiles && openFiles.length > 0) {
        openFiles.forEach((f) => url.searchParams.append('file', f));
    }
    if (startScript) {
        url.searchParams.append('startScript', startScript);
    }

    if (!plainCodeFiles) {
        plainCodeFiles = [...openFiles];
    }

    return (
        <>
            <a href={url.toString()} target="_blank" rel="noopener noreferrer">
                <img alt="Open in StackBlitz" src="https://developer.stackblitz.com/img/open_in_stackblitz.svg" />
            </a>
            {plainCodeFiles.map((file) => (
                <GithubCodeBlock key={file} repoPath={repoPath} file={file} />
            ))}
        </>
    );
};

export default StackBlitzGithub;
