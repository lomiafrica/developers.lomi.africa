import { FC } from 'react';

interface IconProps {
    width?: number;
    height?: number;
    className?: string;
}

export const ZapierIcon: FC<IconProps> = ({ width = 24, height = 24, className }) => {
    return (
        <div style={{ width, height }} className={className}>
            <img
                src="/icon/zapier.png"
                alt="Zapier"
                width={width}
                height={height}
                style={{ objectFit: 'contain' }}
            />
        </div>
    );
}; 