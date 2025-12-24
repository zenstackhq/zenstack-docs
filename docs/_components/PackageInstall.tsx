import CodeBlock from '@theme/CodeBlock';
import TabItem from '@theme/TabItem';
import Tabs from '@theme/Tabs';

interface Props {
    devDependencies: string[];
    dependencies: string[];
}

const pkgManagers = [
    { name: 'npm', command: 'npm install', dev: '--save-dev' },
    { name: 'pnpm', command: 'pnpm add', dev: '--save-dev' },
    { name: 'bun', command: 'bun add', dev: '--dev' },
    { name: 'yarn', command: 'yarn add', dev: '--dev' },
];

const PackageInstall = ({ devDependencies, dependencies }: Props) => {
    return (
        <Tabs>
            {pkgManagers.map((pkg) => (
                <TabItem key={pkg.name} value={pkg.name} label={pkg.name}>
                    <CodeBlock language="bash">
                        {`${dependencies?.length ? `${pkg.command} ${dependencies.join(' ')}` : ''}
${devDependencies?.length ? `${pkg.command} ${pkg.dev} ${devDependencies.join(' ')}\n` : ''}`}
                    </CodeBlock>
                </TabItem>
            ))}
        </Tabs>
    );
};

export default PackageInstall;
