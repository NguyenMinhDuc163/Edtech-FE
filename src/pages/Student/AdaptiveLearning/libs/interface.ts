interface TargetContent {
  contentId: string;
  title: string;
  description?: string;
  sectionId?: string;
  files?: Array<{
    fileId: string;
    fileType: string;
    filename: string;
    title?: string;
  }>;
}

interface AdaptiveSuggestionData {
  action: "NEXT" | "REVIEW" | "REMEDIAL";
  reason: string;
  targetContent: TargetContent;
}

export interface Props {
  data: AdaptiveSuggestionData | null;
  onNavigate: (contentId: string) => void;
}
