import CodeBlock from '@theme/CodeBlock';
import TabItem from '@theme/TabItem';
import Tabs from '@theme/Tabs';

interface Props {
    package: string;
    script: string;
    args: string;
}

const pkgManagers = [
    { name: 'npm', command: 'npx' },
    { name: 'pnpm', command: 'pnpm --package=%package dlx', addScript: true },
    { name: 'bun', command: 'bunx' },
    { name: 'yarn', command: 'npx' },
];

const PackageDlx = ({ package: pkg, script, args }: Props) => {
    return (
        <Tabs>
            {pkgManagers.map((pm) => (
                <TabItem key={pm.name} value={pm.name} label={pm.name}>
                    <CodeBlock language="bash">{`${pm.command.replace('%package', pkg)}${
                        pm.command.includes('%package') ? '' : ` ${pkg}`
                    }${pm.addScript ? ` ${script}` : ''}${args ? ` ${args}` : ''}`}</CodeBlock>
                </TabItem>
            ))}
        </Tabs>
    );
};

export default PackageDlx;
