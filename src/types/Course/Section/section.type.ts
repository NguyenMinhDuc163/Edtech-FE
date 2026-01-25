import type { Lession } from "../Lession/lession.type";
import type { Content } from "../Content/content.type";

export interface Section {
  sectionId: string;
  title: string;
  order: number;
  orderIndex: number;        
  description?: string;
  contentsCount?: number; 
  lessons?: Lession[];       
  contents?: Content[];
}

export interface CreateSectionPayload {
  title: string;
  description?: string;
  order_index: number;
  course_id: string;
}

export interface SectionItemProps {
  sectionId: string;
  title: string;
  description?: string;
  contentsCount?: number;   
  contents?: Content[];
}
