"use client";

import { domain } from "@/store/Store";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type User = { id: number; username: string; email: string };

export default function POSHeader() {
    const router = useRouter();
    const [shiftOpen, setShiftOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");

        if (!token) {
            router.replace("/login");
            return;
        }

        const fetchUser = async () => {
            try {
                const res = await axios.get(`${domain}api/users/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(res.data);
            } catch (err) {
                if (axios.isAxiosError(err) && err.response?.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    sessionStorage.removeItem("token");
                    sessionStorage.removeItem("user");
                    router.replace("/login");
                } else {
                    console.log("Failed to load user", err);
                }
            }
        };

        fetchUser();
    }, [router]);

    return (
        <div className="w-full p-4 flex justify-between items-center bg-white border-b border-slate-200">
            <div className="flex items-center gap-4">
                <h1 className="text-[20px] font-bold">Register POS</h1>

                <span className="text-[13px] font-semibold text-[#0f766e] bg-[#e6f4f1] px-3 py-1 rounded-full">
                    {shiftOpen ? "Shift open" : "Shift closed"}
                </span>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-sm text-slate-600">Cashier: {user?.username ?? "..."}</span>

                <button onClick={() => setShiftOpen((prev) => !prev)} className="btn btn-neutral">
                    {shiftOpen ? "Close Shift" : "Open Shift"}
                </button>
            </div>
        </div>
    );
}