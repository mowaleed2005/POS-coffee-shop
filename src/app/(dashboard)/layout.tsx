"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");

        if (!token) {
            router.replace("/login");
            return;
        }
        setReady(true);
    }, [router]);

    if (!ready) return null;

    return (
        <div className="w-full h-dvh flex flex-col">
            {children}
        </div>
    );
}