import type { ExamAssignType, ExamType } from "@/utils/ui/constants";

export interface Exam {
  id: string;
  title: string;
  description: string;
  type: ExamType;
  assignType: ExamAssignType;
}

export interface AnonymousStudent {
  id: string;
  fullName: string;
}
