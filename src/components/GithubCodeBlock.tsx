import CodeBlock from '@theme/CodeBlock';

interface GithubCodeBlockProps {
    repoPath: string;
    file: string;
}

const GithubCodeBlock: React.FC<GithubCodeBlockProps> = ({ repoPath, file }) => {
    const code = require(`!!raw-loader!@site/code-repos/${repoPath}/${file}`).default;

    const getLanguage = (file: string): string => {
        if (file.endsWith('.ts')) {
            return 'typescript';
        } else if (file.endsWith('.tsx')) {
            return 'tsx';
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
