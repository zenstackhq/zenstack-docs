import React, { FC } from 'react';
import Admonition from '@theme/Admonition';

interface ZModelVsPSLProps {
    children: React.ReactNode;
}

const ZModelVsPSL: FC<ZModelVsPSLProps> = ({ children }) => {
    return (
        <Admonition type="info" title="🔋 ZModel vs PSL">
            {children}
        </Admonition>
    );
};

export default ZModelVsPSL;
