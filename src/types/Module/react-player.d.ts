declare module "react-player" {
  import * as React from "react";

  export interface ReactPlayerProps {
    src?: string | string[];
    url?: string | string[];
    playing?: boolean;
    controls?: boolean;
    width?: string | number;
    height?: string | number;

    onReady?: () => void;
    onStart?: () => void;
    onPlay?: () => void;
    onPause?: () => void;
    onEnded?: () => void;
    onDuration?: (duration: number) => void;
    onError?: (e: any) => void;

    config?: any;
  }

  const ReactPlayer: React.ForwardRefExoticComponent<
    ReactPlayerProps & React.RefAttributes<any>
  >;

  export default ReactPlayer;
}
