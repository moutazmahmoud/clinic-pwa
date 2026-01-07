"use client";

export default function DebugPage() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key1 = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const key2 = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

    return (
        <div className="p-8 space-y-4">
            <h1 className="text-2xl font-bold">Environment Debugger</h1>

            <div className="space-y-2 p-4 border rounded bg-gray-50">
                <p><strong>URL Status:</strong> {url ? "✅ Defined" : "❌ Undefined"}</p>
                <p className="text-sm font-mono text-gray-600">{url ? url.substring(0, 10) + "..." : "Missing"}</p>
            </div>

            <div className="space-y-2 p-4 border rounded bg-gray-50">
                <p><strong>ANON_KEY Status:</strong> {key1 ? "✅ Defined" : "❌ Undefined"}</p>
                <p className="text-sm font-mono text-gray-600">{key1 ? key1.substring(0, 5) + "..." : "Missing"}</p>
            </div>

            <div className="space-y-2 p-4 border rounded bg-gray-50">
                <p><strong>DEFAULT_KEY Status:</strong> {key2 ? "✅ Defined" : "❌ Undefined"}</p>
                <p className="text-sm font-mono text-gray-600">{key2 ? key2.substring(0, 5) + "..." : "Missing"}</p>
            </div>

            <div className="p-4 bg-yellow-50 text-sm">
                <p>If these are missing:</p>
                <ul className="list-disc ml-4 mt-2">
                    <li>Ensure file is named exactly <code>.env.local</code></li>
                    <li>Ensure variables start with <code>NEXT_PUBLIC_</code></li>
                    <li>Restart the dev server after changes</li>
                </ul>
            </div>
        </div>
    );
}
