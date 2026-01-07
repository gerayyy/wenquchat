import { cn } from '../../lib/utils';
import { type ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}

export function Card({ children, className, onClick }: CardProps) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-lg text-white transition-all duration-300",
                onClick && "cursor-pointer hover:bg-white/20 hover:scale-[1.02]",
                className
            )}
        >
            {children}
        </div>
    );
}
