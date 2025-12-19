import CodeBlock from '@theme/CodeBlock';
import TabItem from '@theme/TabItem';
import Tabs from '@theme/Tabs';

interface Props {
    dependencies: string[];
}

const pkgManagers = [
    { name: 'npm', command: 'npm uninstall' },
    { name: 'pnpm', command: 'pnpm remove' },
    { name: 'bun', command: 'bun remove' },
    { name: 'yarn', command: 'yarn remove' },
];

const PackageUninstall = ({ dependencies }: Props) => {
    return (
        <Tabs>
            {pkgManagers.map((pkg) => (
                <TabItem key={pkg.name} value={pkg.name} label={pkg.name}>
                    <CodeBlock language="bash">
                        {`${dependencies?.length ? `${pkg.command} ${dependencies.join(' ')}` : ''}`}
                    </CodeBlock>
                </TabItem>
            ))}
        </Tabs>
    );
};

export default PackageUninstall;
