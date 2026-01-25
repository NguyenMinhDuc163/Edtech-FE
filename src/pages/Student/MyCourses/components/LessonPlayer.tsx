import React, { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import { useVideoTracking } from "@/hooks/useVideoTracking";
import { learningApi } from "@/services/Course/learningService";

// 1. Interface Props chuẩn
interface LessonPlayerProps {
  courseId: string;
  contentId: string;
  videoUrl: string;
  onLessonComplete?: () => void; // Callback quan trọng để trigger Auto Next
}

// 2. Type cho item bài học trả về từ API (để tránh lỗi implicit any)
interface LessonProgressItem {
  contentId: string;
  lastPosition?: number;
  isCompleted?: boolean;
}

interface ReactPlayerInstance {
  seekTo(amount: number, type?: "seconds" | "fraction"): void;
  getCurrentTime(): number;
  getDuration(): number;
  getInternalPlayer(key?: string): Record<string, any>;
}

const LessonPlayer: React.FC<LessonPlayerProps> = ({
  courseId,
  contentId,
  videoUrl,
  onLessonComplete,
}) => {
  const playerRef = useRef<ReactPlayerInstance | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [totalDuration, setTotalDuration] = useState(0);
  const [initialSeekDone, setInitialSeekDone] = useState(false);
  const [savedPosition, setSavedPosition] = useState(0);

  console.log("🎥 Player Debug:", { contentId, videoUrl, isPlaying });

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await learningApi.getCourseProgress(courseId);

        const lessons = (res.data?.lessons || []) as LessonProgressItem[];

        const currentLesson = lessons.find((l) => l.contentId === contentId);

        if (currentLesson) {
          setSavedPosition(currentLesson.lastPosition || 0);
          setInitialSeekDone(false);
        }
      } catch (error) {
        console.error("Lỗi lấy tiến độ", error);
      }
    };

    if (courseId && contentId) {
      fetchProgress();
    }
  }, [contentId, courseId]);

  const { onComplete } = useVideoTracking({
    courseId,
    contentId,
    playerRef,
    isPlaying,
    totalDuration,
  });

  return (
    <div className="player-wrapper w-full h-full bg-black relative">
      <ReactPlayer
        ref={playerRef as any}
        src={videoUrl}
        playing={isPlaying}
        controls={true}
        width="100%"
        height="100%"
        onDuration={(duration: number) => setTotalDuration(duration)}
        onReady={() => {
          if (!initialSeekDone && savedPosition > 0) {
            playerRef.current?.seekTo(savedPosition, "seconds");
            setInitialSeekDone(true);
          }
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          onComplete();
          if (onLessonComplete) onLessonComplete();
        }}
        config={
          {
            file: {
              attributes: {
                controlsList: "nodownload",
                onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
              },
            },
          } as any
        }
        onError={(e) => console.error("Video Error:", e)}
      />
    </div>
  );
};

export default LessonPlayer;
