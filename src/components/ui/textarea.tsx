import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    autoResize?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, autoResize = false, onChange, ...props }, ref) => {
        const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

        const handleResize = React.useCallback(() => {
            const textarea = textareaRef.current;
            if (textarea && autoResize) {
                textarea.style.height = 'auto';
                textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
            }
        }, [autoResize]);

        const handleChange = React.useCallback(
            (e: React.ChangeEvent<HTMLTextAreaElement>) => {
                handleResize();
                onChange?.(e);
            },
            [handleResize, onChange]
        );

        React.useEffect(() => {
            handleResize();
        }, [handleResize, props.value]);

        return (
            <textarea
                className={cn(
                    'flex min-h-[44px] w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:border-[var(--input-focus)] focus:outline-none focus:ring-2 focus:ring-[var(--purple-400)]/20 disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-all duration-200',
                    className
                )}
                ref={(node) => {
                    textareaRef.current = node;
                    if (typeof ref === 'function') {
                        ref(node);
                    } else if (ref) {
                        ref.current = node;
                    }
                }}
                onChange={handleChange}
                {...props}
            />
        );
    }
);
Textarea.displayName = 'Textarea';

export { Textarea };
