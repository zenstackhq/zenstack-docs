import CodeBlock from '@theme/CodeBlock';
import { useEffect, useState } from 'react';

interface GithubCodeBlockProps {
    repoPath: string;
    file: string;
}

const GithubCodeBlock: React.FC<GithubCodeBlockProps> = ({ repoPath, file }) => {
    const [code, setCode] = useState<string>('Loading...');

    useEffect(() => {
        (async function () {
            const response = await fetch(`https://cdn.jsdelivr.net/gh/${repoPath}/${file}`);
            if (!response.ok) {
                setCode(`Unable to load "${repoPath}/${file}"`);
                return;
            }
            const text = await response.text();
            setCode(text);
        })();
    }, [repoPath, file]);

    const getLanguage = (file: string): string => {
        if (file.endsWith('.ts')) {
            return 'typescript';
        } else if (file.endsWith('.zmodel')) {
            return 'zmodel';
        } else {
            return 'plaintext';
        }
    };
    return (
        <CodeBlock language={getLanguage(file)} title={file}>
            {code}
        </CodeBlock>
    );
};

export default GithubCodeBlock;
