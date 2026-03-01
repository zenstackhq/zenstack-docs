import React, { FC } from 'react';
import Admonition from '@theme/Admonition';

interface ExperimentalFeatureProps {
    name: string;
    children: React.ReactNode;
}

const ExperimentalFeature: FC<ExperimentalFeatureProps> = ({ name, children }) => {
    return (
        <Admonition type="danger" title="Experimental Feature">
            {name} is experimental and should be used with caution.
            {children}
        </Admonition>
    );
};

export default ExperimentalFeature;
