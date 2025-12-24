import React, { FC } from 'react';
import Admonition from '@theme/Admonition';

interface ZenStackVsPrismaProps {
    children: React.ReactNode;
}

const ZenStackVsPrisma: FC<ZenStackVsPrismaProps> = ({ children }) => {
    return (
        <Admonition type="note" title="🔋 ZenStack vs Prisma">
            {children}
        </Admonition>
    );
};

export default ZenStackVsPrisma;
