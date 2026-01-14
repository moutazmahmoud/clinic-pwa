"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface DashboardContextType {
    title: string;
    setTitle: (title: string) => void;
    userName: string | undefined;
    setUserName: (name: string) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
    const [title, setTitle] = useState("");
    const [userName, setUserName] = useState<string | undefined>(undefined);

    return (
        <DashboardContext.Provider value={{ title, setTitle, userName, setUserName }}>
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboard() {
    const context = useContext(DashboardContext);
    if (context === undefined) {
        throw new Error("useDashboard must be used within a DashboardProvider");
    }
    return context;
}
