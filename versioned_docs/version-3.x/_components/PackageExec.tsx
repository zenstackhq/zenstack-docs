import CodeBlock from '@theme/CodeBlock';
import TabItem from '@theme/TabItem';
import Tabs from '@theme/Tabs';

interface Props {
    command: string;
}

const pkgManagers = [
    { name: 'npm', command: 'npx' },
    { name: 'pnpm', command: 'pnpm' },
    { name: 'bun', command: 'bunx' },
    { name: 'yarn', command: 'npx' },
];

const PackageInstall = ({ command }: Props) => {
    return (
        <Tabs>
            {pkgManagers.map((pkg) => (
                <TabItem key={pkg.name} value={pkg.name} label={pkg.name}>
                    <CodeBlock language="bash">{`${pkg.command} ${command}`}</CodeBlock>
                </TabItem>
            ))}
        </Tabs>
    );
};

export default PackageInstall;
