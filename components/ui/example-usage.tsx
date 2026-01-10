// Example usage of the Input component
// This file is for reference only - you can delete it

import { Input } from "@/components/ui/Input";

export function ExampleUsage() {
    return (
        <div className="space-y-4 p-4">
            {/* Text Input */}
            <Input
                type="text"
                label="Full Name"
                placeholder="Enter your full name"
                required
            />

            {/* Email Input */}
            <Input
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                helperText="We'll never share your email"
            />

            {/* Password Input with reveal */}
            <Input
                type="password"
                label="Password"
                placeholder="Enter your password"
                required
            />

            {/* Number Input */}
            <Input
                type="number"
                label="Age"
                placeholder="Enter your age"
                min="0"
                max="150"
            />

            {/* Input with error */}
            <Input
                type="text"
                label="Username"
                placeholder="Choose a username"
                error="Username is already taken"
            />

            {/* Disabled Input */}
            <Input
                type="text"
                label="Disabled Field"
                value="Cannot edit this"
                disabled
            />
        </div>
    );
}
