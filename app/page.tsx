"use client"

import React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Link from "next/link"
import classes from "./style.module.css"
import { useEffect } from "react";
import { resetAllProgress } from "@/lib/story";

import home from "@/public/home.png"

export default function TrangChu() {
  const router = useRouter()

  useEffect(() => {
    resetAllProgress();
  }, []);

  const goPlay = () => router.push("/player")


  return (
    <>
      {/* ------- Desktop ------- */}
      <div className={classes.desktop}>
        <div className={classes.stage}>
          <div className={classes.card}>
            <Link href="/guide" className={classes.guideLink}>Hướng dẫn</Link>

            <div className={classes.logoText}>Monopoly Genesis</div>
            <div className={classes.mainTitle}>
              Con đường trở thành <br /> Tập đoàn Độc Quyền
            </div>

            <button onClick={goPlay} className={classes.buttonCta}>Bắt đầu</button>

            <Image className={classes.homeImage} alt="Home" src={home} priority />
          </div>
        </div>
      </div>


      {/* ------- Mobile (≤ 768px) ------- */}
      <div className={classes.mobile}>
        <div className={classes.mobileWrap}>
          <div className={classes.mobileHeader}>
            <span className={classes.mobileBrand}>Monopoly Genesis</span>
            <Link href="/guide" className={classes.mobileGuide}>
              Hướng dẫn
            </Link>
          </div>

          <h1 className={classes.mobileTitle}>
            Con đường trở thành{" "}
            <span className={classes.mobileBreak}>Tập đoàn Độc Quyền</span>
          </h1>

          <div className={classes.mobileHero}>
            <Image
              src={home}
              alt="Home"
              className={classes.mobileImage}
              sizes="(max-width: 768px) 90vw, 600px"
              priority
            />
          </div>

          <button className={classes.mobileCta} onClick={goPlay}>
            Bắt đầu
          </button>
        </div>
      </div>
    </>
  )
}
