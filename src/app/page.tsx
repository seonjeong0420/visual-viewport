"use client";
import { useEffect, useRef } from "react";
import styles from "./page.module.css";

export default function Home() {
  const chatContainer = useRef<HTMLDivElement>(null);

  // 📍 resize
  const bodyHeightText = useRef<HTMLSpanElement>(null);
  const windowHeightText = useRef<HTMLSpanElement>(null);
  const viewportHeightText = useRef<HTMLSpanElement>(null);
  function viewportResize() {
    const bodyHeight = document.body.offsetHeight;
    const windowInnerHeight = window.innerHeight;
    const viewportHeight = visualViewport?.height || 0;

    // body height 확인용
    if (bodyHeightText.current) {
      bodyHeightText.current.innerText = `bodyHeight : ${bodyHeight.toString()}`;
    }
    // window height 확인용
    if (windowHeightText.current) {
      windowHeightText.current.innerText = `windowInnerHeight : ${windowInnerHeight.toString()}`;
    }
    // viewport height 확인용
    if (viewportHeightText.current) {
      viewportHeightText.current.innerText = `viewportHeight : ${viewportHeight.toString()}`;
    }

    if (windowInnerHeight > viewportHeight) {
      console.log("키보드 on", window.scrollY, viewportHeight, document.body.offsetHeight);

      // 가상 영역까지 스크롤 내려가는 것을 방지
      if (window.scrollY + viewportHeight > document.body.offsetHeight - 2) {
        window.scrollTo(0, document.body.offsetHeight - viewportHeight - 1);
      }
    } else {
      console.log("키보드 off");
    }
  }

  // 🤖 chatGPT
  function adjustChatUI() {
    const viewportHeight = window.visualViewport?.height || 0;
    chatContainer.current?.style.setProperty("height", `${viewportHeight / 10}rem`);
  }

  useEffect(() => {
    // visualVieport resize 사용
    window.visualViewport?.addEventListener("resize", () => {
      viewportResize();
      adjustChatUI();
    });
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.visualVieportText}>
        <span ref={bodyHeightText}></span>
        <span ref={windowHeightText}></span>
        <span ref={viewportHeightText}></span>
      </div>
      <div className={styles.chat}>
        <div className={styles.chat__detail} ref={chatContainer}>
          <div className={styles.chat__unit}>
            <div className={styles.chat__unit__box} style={{ height: "20rem" }}></div>
            <div className={styles.chat__unit__box} style={{ height: "10rem" }}></div>
          </div>
          <div className={styles.chat__user}>
            <div className={styles.chat__unit__box} style={{ height: "20rem" }}></div>
            <div className={styles.chat__unit__box} style={{ height: "10rem" }}></div>
          </div>
          <div className={styles.chat__unit}>
            <div className={styles.chat__unit__box} style={{ height: "20rem" }}></div>
            <div className={styles.chat__unit__box} style={{ height: "10rem" }}></div>
          </div>
        </div>
        <div className={styles.chat__textarea}>
          <div className={styles.chat__textarea__inner}>
            <button className={styles.button}>BTN1</button>
            <div className={styles.box_textarea}>
              <textarea
                name=""
                id=""
                className={styles.textarea}
                onFocus={(e: React.FocusEvent<HTMLTextAreaElement>) => {
                  const target = e.currentTarget;

                  requestAnimationFrame(() => {
                    setTimeout(() => {
                      if (target) {
                        target.scrollIntoView({ behavior: "smooth", block: "end" });
                      }
                    }, 100);
                  });
                }}
              ></textarea>
            </div>
            <button className={styles.button}>BTN2</button>
          </div>
        </div>
      </div>
    </main>
  );
}
