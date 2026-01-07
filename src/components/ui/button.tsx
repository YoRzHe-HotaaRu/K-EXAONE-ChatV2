import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--purple-400)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                default:
                    'bg-[var(--gradient-primary)] text-black shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]',
                secondary:
                    'bg-[var(--gray-100)] text-[var(--foreground)] hover:bg-[var(--gray-200)] [&[data-theme="dark"]]:bg-[var(--gray-800)] [&[data-theme="dark"]]:hover:bg-[var(--gray-700)]',
                ghost:
                    'hover:bg-[var(--gray-100)] text-[var(--foreground-secondary)] hover:text-[var(--foreground)] [html[data-theme="dark"]_&]:hover:bg-[var(--gray-800)]',
                outline:
                    'border border-[var(--gray-200)] bg-transparent hover:bg-[var(--gray-50)] text-[var(--foreground)] [html[data-theme="dark"]_&]:border-[var(--gray-700)] [html[data-theme="dark"]_&]:hover:bg-[var(--gray-800)]',
                danger:
                    'bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg',
            },
            size: {
                default: 'h-10 px-4 py-2',
                sm: 'h-8 px-3 text-xs',
                lg: 'h-12 px-6 text-base',
                icon: 'h-10 w-10',
                'icon-sm': 'h-8 w-8',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
