"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, type = "text", label, error, helperText, containerClassName, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);

        const togglePasswordVisibility = () => {
            setShowPassword(!showPassword);
        };

        const isPasswordType = type === "password";
        const currentType = isPasswordType ? (showPassword ? "text" : "password") : type;

        return (
            <div className={cn("space-y-2", containerClassName)}>
                {label && (
                    <label className="text-sm font-bold text-gray-700 ml-1">
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                <div className="relative">
                    <input
                        type={currentType}
                        className={cn(
                            "flex w-full rounded-2xl border-gray-200 bg-gray-50/50 px-4 py-3.5 text-sm font-medium transition-all",
                            "placeholder:text-gray-400",
                            "focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                            error && "border-red-200 bg-red-50/50 focus:border-red-500 focus:ring-red-500/10",
                            isPasswordType && "pr-10",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />

                    {isPasswordType && (
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    )}
                </div>

                {error && (
                    <p className="text-xs font-medium text-red-500 ml-1 animate-in slide-in-from-left-1">{error}</p>
                )}

                {helperText && !error && (
                    <p className="text-xs text-gray-500 ml-1">{helperText}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";
