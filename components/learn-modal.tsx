"use client";

export default function LearnModal({
  lesson,
  effects,
  onClose,
}: {
  lesson?: string;
  effects?: { profit?: number; trust?: number; power?: number };
  onClose: () => void;
}) {
  // helper render 1 dòng bullet +/-
  const line = (label: string, v?: number) => {
    if (!v || v === 0) return null;
    const sign = v > 0 ? "+" : "";
    return (
      <li className="text-sm leading-relaxed">
        {`${sign}${v} ${label}`}
      </li>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white/95 backdrop-blur border border-white/40 shadow-xl p-6">
        {lesson ? (
          <>
            <h3 className="text-base font-bold mb-2">📚 Bài học</h3>
            <p className="text-sm text-foreground/90 mb-4 whitespace-pre-line">{lesson}</p>
          </>
        ) : (
          <h3 className="text-base font-bold mb-2"></h3>
        )}

        <div className="space-y-1 mb-6 text-sm leading-relaxed">
          {effects?.profit !== undefined && effects.profit !== 0 && (
            <div className={effects.profit > 0 ? "text-green-500" : "text-red-500"}>
              {effects.profit > 0 ? "+" : ""}{effects.profit} Profit
            </div>
          )}

          {effects?.trust !== undefined && effects.trust !== 0 && (
            <div className={effects.trust > 0 ? "text-green-500" : "text-red-500"}>
              {effects.trust > 0 ? "+" : ""}{effects.trust} Trust
            </div>
          )}

          {effects?.power !== undefined && effects.power !== 0 && (
            <div className={effects.power > 0 ? "text-green-500" : "text-red-500"}>
              {effects.power > 0 ? "+" : ""}{effects.power} Power
            </div>
          )}
        </div>


        <div className="text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
}
