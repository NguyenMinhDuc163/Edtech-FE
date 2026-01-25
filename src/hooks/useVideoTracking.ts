import { learningApi } from "@/services/Course/learningService";
import { useEffect, useRef, useCallback } from "react";

const HEARTBEAT_INTERVAL = 300000;
interface UseVideoTrackingProps {
  courseId: string;
  contentId: string;
  playerRef: any; 
  isPlaying: boolean;
  totalDuration: number; 
}

export const useVideoTracking = ({
  courseId,
  contentId,
  playerRef,
  isPlaying,
  totalDuration,
}: UseVideoTrackingProps) => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastLogTimeRef = useRef<number>(Date.now());
  const hasStartedRef = useRef(false);

  const getDurationWatched = () => {
    const now = Date.now();
    const duration = Math.round((now - lastLogTimeRef.current) / 1000);
    lastLogTimeRef.current = now;
    return duration > 0 ? duration : 0;
  };

  const sendLog = useCallback(
    (action: "VIDEO_START" | "VIDEO_WATCHING" | "VIDEO_PAUSE" | "VIDEO_COMPLETE") => {
      if (!playerRef.current) return;

      const currentTime = playerRef.current.getCurrentTime
        ? playerRef.current.getCurrentTime()
        : playerRef.current.currentTime;

      const durationWatched = action === "VIDEO_START" ? 0 : getDurationWatched();

      learningApi.updateProgress({
        courseId,
        contentId,
        action,
        videoTimestamp: currentTime,
        durationWatched,
        totalDuration, 
      });
    },
    [courseId, contentId, totalDuration]
  );

  useEffect(() => {
    if (isPlaying) {
      lastLogTimeRef.current = Date.now();

      if (!hasStartedRef.current) {
        sendLog("VIDEO_START");
        hasStartedRef.current = true;
      }

      intervalRef.current = setInterval(() => {
        sendLog("VIDEO_WATCHING");
      }, HEARTBEAT_INTERVAL);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        sendLog("VIDEO_PAUSE");
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, sendLog]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!playerRef.current) return;
      const currentTime = playerRef.current.getCurrentTime
        ? playerRef.current.getCurrentTime()
        : playerRef.current.currentTime;

      const payload = {
        courseId,
        contentId,
        action: "PAUSE",
        videoTimestamp: currentTime,
        durationWatched: getDurationWatched(),
        totalDuration,
      };

      learningApi.sendBeaconLog(payload);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (isPlaying) sendLog("VIDEO_PAUSE");
    };
  }, [courseId, contentId, totalDuration, isPlaying]);

  return {
    onComplete: () => sendLog("VIDEO_COMPLETE"),
  };
};
