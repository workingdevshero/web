/**
 * Plays the home hero's background loop without costing anyone who can't see it.
 *
 * The hero has two loops, a 16:9 one shown at lg+ and a 9:16 one below that;
 * the other is display:none. Both use preload="none", so a video only
 * downloads once it is played here, and only the visible one is played.
 * People who ask for reduced motion keep the poster, which is the loop's
 * first frame.
 */
export interface HeroVideo {
  readonly offsetParent: Element | null;
  muted: boolean;
  play(): Promise<void>;
  pause(): void;
}

export function syncHeroVideos(videos: Iterable<HeroVideo>, reduceMotion: boolean): void {
  for (const video of videos) {
    // offsetParent is null for an element inside a display:none ancestor.
    const visible = video.offsetParent !== null;
    if (visible && !reduceMotion) {
      // Autoplay is only allowed muted; set the property, not just the attribute.
      video.muted = true;
      // Rejects if the browser still blocks it (e.g. Low Power Mode); the poster stays.
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }
}
