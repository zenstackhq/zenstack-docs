import React, { FC } from 'react';
import Admonition from '@theme/Admonition';

interface PreviewFeatureProps {
    name: string;
    children: React.ReactNode;
}

const PreviewFeature: FC<PreviewFeatureProps> = ({ name, children }) => {
    return (
        <Admonition type="warning" title="Preview Feature">
            {name} is in preview and may be subject to breaking changes in future releases.
            {children}
        </Admonition>
    );
};

export default PreviewFeature;
