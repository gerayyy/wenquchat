import { type InputHTMLAttributes, forwardRef, useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';

export interface AutoResizeInputProps extends InputHTMLAttributes<HTMLInputElement> {
    minWidth?: number;
}

export const AutoResizeInput = forwardRef<HTMLInputElement, AutoResizeInputProps>(
    ({ className, type, value, defaultValue, onChange, minWidth = 20, ...props }, ref) => {
        // Track the value to measure. 
        // If controlled (value provided), use it. 
        // If uncontrolled, use local state initialized with defaultValue.
        const [localValue, setLocalValue] = useState(defaultValue || '');
        const [width, setWidth] = useState(minWidth);
        const spanRef = useRef<HTMLSpanElement>(null);

        // Determine the value to measure
        const valueToMeasure = value !== undefined ? value : localValue;

        useEffect(() => {
            if (spanRef.current) {
                // Use value, or placeholder, or a non-breaking space to ensure minimum width
                const text = (valueToMeasure as string) || (props.placeholder as string) || ' ';
                spanRef.current.textContent = text;

                // Measure and set width (with some buffer for padding)
                // 16px buffer: 8px padding left + 8px padding right approx
                const newWidth = Math.max(spanRef.current.offsetWidth + 20, minWidth);
                setWidth(newWidth);
            }
        }, [valueToMeasure, props.placeholder, minWidth]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            // If uncontrolled, update local value to trigger measurement update
            if (value === undefined) {
                setLocalValue(e.target.value);
            }
            // Always call parent onChange
            onChange?.(e);
        };

        return (
            <div className="relative inline-block align-middle">
                {/* Hidden span for measurement */}
                <span
                    ref={spanRef}
                    className={cn(
                        "absolute opacity-0 pointer-events-none whitespace-pre",
                        "text-xs", // Match input text size (text-xs is used in Fill.tsx)
                        "px-2", // Match input padding
                        className // Inherit other styles
                    )}
                    aria-hidden="true"
                    style={{
                        fontFamily: 'inherit',
                        fontSize: 'inherit',
                        fontWeight: 'inherit',
                        letterSpacing: 'inherit'
                    }}
                >
                </span>

                <input
                    type={type}
                    className={cn(
                        "flex h-8 rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-xs ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-white backdrop-blur-sm transition-all",
                        className
                    )}
                    style={{ width: `${width}px`, minWidth: `${minWidth}px` }}
                    value={value}
                    defaultValue={defaultValue}
                    onChange={handleChange}
                    ref={ref}
                    {...props}
                />
            </div>
        )
    }
)
AutoResizeInput.displayName = "AutoResizeInput"
