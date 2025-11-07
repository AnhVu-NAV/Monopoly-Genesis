"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function ClarityRoute() {
    const pathname = usePathname();
    const search = useSearchParams();

    useEffect(() => {
        const page = pathname + (search?.toString() ? `?${search}` : "");

        // Only run in the browser and when clarity is a function
        if (typeof window !== "undefined" && typeof window.clarity === "function") {
            try {
                // Update virtual page
                // @ts-ignore
                window.clarity("set", "page", page);
                // Send a custom event instead of "pageview"
                // @ts-ignore
                window.clarity("event", "route_change");
            } catch (e) {
                // swallow
            }
        }
    }, [pathname, search]);

    return null;
}
