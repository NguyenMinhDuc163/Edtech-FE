import api from "@/services/api";
export const createCourse = async (formData: FormData) => {
  try {
    const response = await api.post("/courses", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Lỗi khi tạo khóa học:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const updateCourse = async (
  courseId: string,
  payload: {
    title?: string;
    description?: string;
    category?: string;
    price?: number;
    currency?: string;
    visibility?: string;
    courseDuration?: string;
    teacher?: string;
    discountAmount?: number;
    courseDescription?: string;
    thumbnailUrl?: string;
  }
) => {
  try {
    const response = await api.patch(`/courses/${courseId}`, payload);
    return response.data;
  } catch (error: any) {
    console.error(
      "Lỗi khi cập nhật khóa học:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};


export const submitCourseForApproval = async (courseId: string) => {
  try {
    const response = await api.post(`/courses/${courseId}/submit`);
    return response.data;
  } catch (error: any) {
    console.error("Lỗi khi submit khóa học:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

interface Lesson {
  title: string;
}

interface Section {
  title: string;
  lessons: Lesson[];
}

interface Syllabus {
  courseTitle: string;
  objective?: string;
  sections: Section[];
}

const parseSyllabusRaw = (raw: string): Syllabus => {
  if (!raw || typeof raw !== 'string') {
    return { courseTitle: '', sections: [] };
  }

  const lines = raw.split('\n').map(line => line.trim()).filter(Boolean);

  if (lines.length === 0) {
    return { courseTitle: '', sections: [] };
  }

  const courseTitle = lines[0];
  let objective: string | undefined;
  const sections: Section[] = [];
  let currentSection: Section | null = null;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];

    if (/^Mục tiêu( khóa học)?:/.test(line)) {
      objective = line.replace(/^Mục tiêu( khóa học)?:\s*/, '');
      continue;
    }

    if (/^Chủ đề:/.test(line)) {
      continue;
    }

    if (/^(Chương|Phụ lục)/.test(line)) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        title: line,
        lessons: []
      };
    } else {
      if (!currentSection) {
        currentSection = {
          title: 'Nội dung chính',
          lessons: []
        };
      }
      currentSection.lessons.push({ title: line });
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  return { courseTitle, objective, sections };
};

export const previewAICourse = async (payload: {
  instruction: string;
}) => {
  try {
    const response = await api.post("/chat/syllabus", payload, {
      skipLoading: true
    });
    const syllabusRaw = response.data.data.syllabus_raw;

    if (!syllabusRaw) {
      throw new Error("Không nhận được dữ liệu giáo án từ server");
    }

    return parseSyllabusRaw(syllabusRaw);
  } catch (error: any) {
    console.error(
      "Lỗi khi xem trước giáo án AI:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};


export const importAICourse = async (payload: {
  syllabus: any;
  thumbnail_url?: string;
}) => {
  try {
    const response = await api.post("/courses/ai/import", payload);
    return response.data;
  } catch (error: any) {
    console.error(
      "Lỗi khi import giáo án AI:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};