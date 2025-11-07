"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function ClarityRoute() {
    const pathname = usePathname();
    const search = useSearchParams();

    useEffect(() => {
        const page = pathname + (search?.toString() ? `?${search}` : "");
        // @ts-ignore
        if (typeof window !== "undefined" && window.clarity) {
            // @ts-ignore
            window.clarity("set", "page", page);
            // @ts-ignore
            window.clarity("pageview");
        }
    }, [pathname, search]);

    return null;
}
