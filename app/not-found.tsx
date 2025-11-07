"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function NotFoundInner() {
    const params = useSearchParams(); // OK vì nằm trong Suspense
    const from = params.get("from") ?? "unknown";
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">404 – Không tìm thấy trang</h1>
            <p className="text-sm opacity-70 mt-2">Nguồn: {from}</p>
        </div>
    );
}

export default function NotFound() {
    return (
        <Suspense fallback={<div className="p-8">Đang tải…</div>}>
            <NotFoundInner />
        </Suspense>
    );
}
