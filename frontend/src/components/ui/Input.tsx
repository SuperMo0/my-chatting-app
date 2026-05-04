import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export const Input = ({ className, ref, ...props }: ComponentProps<"input">) => {
    return (
        <input
            {...props}
            ref={ref}
            className={twMerge("input focus:outline-0 w-full rounded-xl bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-blue", className)}
        />
    );
};

export default Input;