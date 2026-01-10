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
        const [inputType, setInputType] = useState(type);

        const togglePasswordVisibility = () => {
            setShowPassword(!showPassword);
            setInputType(showPassword ? "password" : "text");
        };

        const isPasswordType = type === "password";

        return (
            <div className={cn("space-y-2", containerClassName)}>
                {label && (
                    <label className="text-sm font-medium text-gray-700">
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                <div className="relative">
                    <input
                        type={isPasswordType ? inputType : type}
                        className={cn(
                            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                            "placeholder:text-muted-foreground",
                            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                            error && "border-red-500 focus:ring-red-500",
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
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    )}
                </div>

                {error && (
                    <p className="text-sm text-red-500">{error}</p>
                )}

                {helperText && !error && (
                    <p className="text-sm text-gray-500">{helperText}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";
