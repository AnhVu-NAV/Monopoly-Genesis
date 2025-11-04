"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function AnalyticsListener() {
    const pathname = usePathname();
    const search = useSearchParams();

    useEffect(() => {
        if (!GA_ID) return;
        const url = pathname + (search?.toString() ? `?${search}` : "");
        // @ts-ignore
        window.gtag?.("config", GA_ID, { page_path: url, anonymize_ip: true });
    }, [pathname, search]);

    return null;
}
