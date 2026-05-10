"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export function VehicleGallery({
  images,
  alt
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const total = images.length;
  const heroRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<number | null>(null);

  const showPrev = useCallback(() => {
    setActive((current) => (current === 0 ? total - 1 : current - 1));
  }, [total]);

  const showNext = useCallback(() => {
    setActive((current) => (current === total - 1 ? 0 : current + 1));
  }, [total]);

  useEffect(() => {
    if (!lightboxOpen) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setLightboxOpen(false);
      else if (event.key === "ArrowLeft") showPrev();
      else if (event.key === "ArrowRight") showNext();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [lightboxOpen, showPrev, showNext]);

  function onTouchStart(event: React.TouchEvent) {
    touchStart.current = event.changedTouches[0]?.clientX ?? null;
  }

  function onTouchEnd(event: React.TouchEvent) {
    if (touchStart.current === null) return;
    const delta = (event.changedTouches[0]?.clientX ?? 0) - touchStart.current;
    if (Math.abs(delta) > 40) {
      if (delta < 0) showNext();
      else showPrev();
    }
    touchStart.current = null;
  }

  if (total === 0) {
    return (
      <div className="vehicle-gallery">
        <div className="gallery-hero gallery-hero-empty">
          <Image
            src="/placeholder-car.svg"
            alt={alt}
            fill
            sizes="(max-width: 980px) 100vw, 58vw"
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="vehicle-gallery">
        <div
          ref={heroRef}
          className="gallery-hero"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <button
            type="button"
            className="gallery-hero-button"
            aria-label="Open photo gallery"
            onClick={() => setLightboxOpen(true)}
          >
            <Image
              src={images[active]!}
              alt={alt}
              fill
              priority={active === 0}
              sizes="(max-width: 980px) 100vw, 58vw"
            />
            <span className="gallery-zoom" aria-hidden="true">
              <ZoomIcon />
            </span>
          </button>

          {total > 1 ? (
            <>
              <button
                type="button"
                className="gallery-nav gallery-nav-prev"
                aria-label="Previous photo"
                onClick={showPrev}
              >
                <ArrowLeftIcon />
              </button>
              <button
                type="button"
                className="gallery-nav gallery-nav-next"
                aria-label="Next photo"
                onClick={showNext}
              >
                <ArrowRightIcon />
              </button>
              <span className="gallery-counter" aria-hidden="true">
                {active + 1} / {total}
              </span>
            </>
          ) : null}
        </div>

        {total > 1 ? (
          <ul className="gallery-thumbs" aria-label="Photo thumbnails">
            {images.map((url, index) => (
              <li key={`${url}-${index}`}>
                <button
                  type="button"
                  className={`gallery-thumb ${index === active ? "is-active" : ""}`}
                  aria-label={`Show photo ${index + 1}`}
                  aria-current={index === active}
                  onClick={() => setActive(index)}
                >
                  <Image
                    src={url}
                    alt=""
                    width={160}
                    height={108}
                    sizes="160px"
                  />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {lightboxOpen ? (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${alt} photo gallery`}
          onClick={(event) => {
            if (event.target === event.currentTarget) setLightboxOpen(false);
          }}
        >
          <button
            type="button"
            className="gallery-lightbox-close"
            aria-label="Close gallery"
            onClick={() => setLightboxOpen(false)}
          >
            <CloseIcon />
          </button>

          <div
            className="gallery-lightbox-stage"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <Image
              src={images[active]!}
              alt={alt}
              fill
              sizes="100vw"
              priority
            />
          </div>

          {total > 1 ? (
            <>
              <button
                type="button"
                className="gallery-nav gallery-nav-prev gallery-nav-lightbox"
                aria-label="Previous photo"
                onClick={showPrev}
              >
                <ArrowLeftIcon />
              </button>
              <button
                type="button"
                className="gallery-nav gallery-nav-next gallery-nav-lightbox"
                aria-label="Next photo"
                onClick={showNext}
              >
                <ArrowRightIcon />
              </button>
              <span className="gallery-lightbox-counter">
                {active + 1} / {total}
              </span>
            </>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

function ArrowLeftIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 6 9 12l6 6" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 6 18 18" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

function ZoomIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
      <path d="M11 8v6" />
      <path d="M8 11h6" />
    </svg>
  );
}
