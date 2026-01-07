import { type ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
}

export function Button({
    children,
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    disabled,
    ...props
}: ButtonProps) {
    const variants = {
        primary: "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg border-transparent",
        secondary: "bg-white/20 hover:bg-white/30 text-white border-transparent backdrop-blur-sm",
        ghost: "hover:bg-white/10 text-white border-transparent",
        outline: "border-white/30 hover:bg-white/10 text-white border"
    };

    const sizes = {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-lg",
        icon: "h-10 w-10 p-2 flex items-center justify-center"
    };

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center rounded-2xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95",
                variants[variant],
                sizes[size],
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
    );
}
