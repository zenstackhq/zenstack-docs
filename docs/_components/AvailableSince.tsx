import Admonition from '@theme/Admonition';
import { FC } from 'react';

interface AvailableSinceProps {
    version: string;
}

const AvailableSince: FC<AvailableSinceProps> = ({ version }) => {
    return <Admonition type="note" title={`Available since ${version}`}></Admonition>;
};

export default AvailableSince;
