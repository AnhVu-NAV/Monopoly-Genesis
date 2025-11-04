"use client";
import { useEffect, useRef, useState } from "react";

type Prologue = {
    title?: string;
    paragraphs: string[];
    audio?: string[];
    voice?: { lang?: string; name?: string; rate?: number; pitch?: number; volume?: number };
};

export default function NarrationScreen({
    prologue,
    onComplete,
    onSkip,
    disableTTS = false,
}: {
    prologue: Prologue;
    onComplete?: () => void;
    onSkip?: () => void;
    disableTTS?: boolean;
}) {
    const { title, paragraphs, audio = [], voice } = prologue;
    const [idx, setIdx] = useState(0);
    const [started, setStarted] = useState(false);
    const [typing, setTyping] = useState("");
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const typeTimer = useRef<number | null>(null);

    // typewriter
    useEffect(() => {
        if (!started) return;
        if (!paragraphs[idx]) return;
        setTyping("");
        if (typeTimer.current) window.clearInterval(typeTimer.current);
        const text = paragraphs[idx];
        let i = 0;
        typeTimer.current = window.setInterval(() => {
            i++;
            setTyping(text.slice(0, i));
            if (i >= text.length && typeTimer.current) {
                window.clearInterval(typeTimer.current);
                typeTimer.current = null;
            }
        }, 18);
        return () => {
            if (typeTimer.current) window.clearInterval(typeTimer.current);
            typeTimer.current = null;
        };
    }, [idx, started, paragraphs]);

    // phát audio / TTS khi chuyển đoạn (sau khi đã started)
    useEffect(() => {
        if (!started) return;
        playCurrent(idx);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idx, started]);

    function log(msg: string, ...rest: any[]) {
        // tiện debug
        console.log("[Narration]", msg, ...rest);
    }

    function stopAll() {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = "";
        }
        try { window.speechSynthesis.cancel(); } catch { }
        setIsPlaying(false);
    }

    /** Quan trọng: phát trong handler click đầu tiên để tránh autoplay block */
    function handleStart() {
        stopAll();
        // nếu có audio cho đoạn 0 → play ngay trong handler (cùng user gesture)
        const url = audio[0];
        if (url) {
            const el = new Audio();
            audioRef.current = el;
            // nếu khác origin và server cho phép, có thể bật
            // el.crossOrigin = "anonymous";
            el.src = url.startsWith("/") ? url : url; // đảm bảo đúng path
            el.preload = "auto";
            el.onended = handleNextAuto;
            el.onerror = () => {
                log("Audio error on START", { url, code: el.error?.code });
            };
            el.oncanplaythrough = () => log("Audio canplaythrough", url);
            el.onplay = () => setIsPlaying(true);
            el.onpause = () => setIsPlaying(false);

            el.play()
                .then(() => {
                    log("Audio playing (gesture)", url);
                    setStarted(true); // chỉ set sau khi đã play OK để iOS happy
                })
                .catch((err) => {
                    log("Audio play blocked on START, fallback TTS", err);
                    setStarted(true);
                });
        } else {
            // không có file → dùng TTS
            setStarted(true);
        }
    }

    function playCurrent(i: number) {
        stopAll();
        const url = audio[i];
        if (url) {
            const el = new Audio();
            audioRef.current = el;
            // el.crossOrigin = "anonymous";
            el.src = url;
            el.preload = "auto";
            el.onended = handleNextAuto;
            el.onerror = () => {
                log("Audio error", { url, code: el.error?.code });
            };
            el.oncanplaythrough = () => log("Audio canplaythrough", url);
            el.onplay = () => setIsPlaying(true);
            el.onpause = () => setIsPlaying(false);

            el.play().then(
                () => log("Audio playing", url),
                (err) => {
                    log("Audio play blocked (not gesture), fallback TTS", err);
                }
            );
        } else {
        }
    }

    function handleNextAuto() {
        setIsPlaying(false);
        if (idx < paragraphs.length - 1) {
            setIdx((i) => i + 1);
        } else {
            onComplete?.();
        }
    }

    function handleNextManual() {
        stopAll();
        handleNextAuto();
    }

    function handleSkip() {
        stopAll();
        onSkip ? onSkip() : onComplete?.();
    }

    function handleReplay() {
        if (!started) return;
        stopAll();
        setTyping("");
        // retrigger typewriter & play
        setTimeout(() => {
            setIdx((i) => i); // trigger useEffect
        }, 0);
    }

    return (
        <div className="fixed inset-0 z-[60] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-3xl bg-white/80 backdrop-blur border border-white/50 rounded-2xl p-5 shadow-2xl">
                {title && <h2 className="text-xl sm:text-2xl font-bold mb-3">{title}</h2>}

                {!started ? (
                    <div className="text-center py-8">
                        <p className="text-slate-700 mb-4">
                            Nhấn “Bắt đầu” để nghe lời dẫn chuyện (cần thao tác để phát audio trên di động).
                        </p>
                        <button className="px-4 py-2 rounded-lg border bg-slate-900 text-white" onClick={handleStart}>
                            Bắt đầu
                        </button>
                        <button className="ml-3 px-4 py-2 rounded-lg border" onClick={handleSkip}>
                            Bỏ qua
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="min-h-[120px] sm:min-h-[150px] bg-white/70 border rounded-xl p-4">
                            <p className="text-slate-900 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                                {typing}
                            </p>
                            <div className="mt-3 text-xs text-slate-600">
                                Đoạn {idx + 1}/{paragraphs.length} {isPlaying ? "• Đang phát…" : ""}
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <div className="text-xs text-slate-600">
                                {audio[idx] ? "Nguồn: Audio file" : "Nguồn: TTS (fallback)"}
                            </div>
                            <div className="flex items-center gap-2">
                                {/* <button className="px-3 py-1.5 border rounded-lg" onClick={handleReplay}>
                                    Phát lại
                                </button> */}
                                <button className="px-3 py-1.5 border rounded-lg" onClick={handleNextManual}>
                                    Tiếp
                                </button>
                                <button className="px-3 py-1.5 border rounded-lg" onClick={handleSkip}>
                                    Bỏ qua
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
