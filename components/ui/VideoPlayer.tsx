'use client';

import { useRef, useEffect, useState } from 'react';

interface VideoPlayerProps {
  src: string;
  poster: string;
  ariaLabel?: string;
}

export default function VideoPlayer({ src, poster, ariaLabel = 'Travel marketing showreel' }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <div className="relative rounded-sm overflow-hidden border border-line shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
      <div
        className="absolute -inset-4 bg-gradient-to-br from-flight-900/30 via-transparent to-flight-950/20 rounded-lg blur-2xl pointer-events-none"
        aria-hidden="true"
      />
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        loop
        muted
        playsInline
        preload="none"
        aria-label={ariaLabel}
        className="relative w-full h-auto block"
        style={{ objectFit: 'contain' }}
      />

      {/* Unmute / Mute button */}
      <button
        onClick={toggleMute}
        aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        className="absolute bottom-4 right-4 z-10 flex items-center gap-2 px-3 py-2 rounded-full bg-carbon/70 border border-white/15 backdrop-blur-sm hover:bg-carbon/90 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-runway"
      >
        {isMuted ? (
          <>
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707A1 1 0 0112 5v14a1 1 0 01-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-white/80">Tap for sound</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4 text-runway" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707A1 1 0 0112 5v14a1 1 0 01-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728" />
            </svg>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-runway">Sound on</span>
          </>
        )}
      </button>
    </div>
  );
}
