export type StorePlatform = "ANDROID" | "IOS";
export type StoreProvider = "PLAY_STORE" | "APP_STORE";

export interface IapStoreProduct {
  id: string;
  course_id: string;
  platform: StorePlatform;
  store: StoreProvider;
  product_id: string;
  entitlement_id: string;
  product_type: "NON_CONSUMABLE";
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface IapAdminCourse {
  courseId: string;
  title: string;
  status: string;
  visibility: "PUBLIC" | "PRIVATE";
  isPaid: boolean;
  mobileIapEnabled: boolean;
  contentEnabled: boolean;
  price: string | number;
  currency: string;
  products: IapStoreProduct[];
}

export interface IapGlobalParameter {
  param_id: string;
  param_key: string;
  param_value: string;
}

export interface CreateIapProductPayload {
  platform: StorePlatform;
  store: StoreProvider;
  productId: string;
  entitlementId: string;
  productType: "NON_CONSUMABLE";
  isActive: boolean;
}

export interface IapContentFileAccess {
  fileId: string;
  title: string;
  fileType: string;
  isActive: boolean;
}

export interface IapContentAccess {
  contentId: string;
  title: string;
  isActive: boolean;
  isPreview: boolean;
  files: IapContentFileAccess[];
}

export interface IapSectionAccess {
  sectionId: string;
  title: string;
  isActive: boolean;
  isPreview: boolean;
  contents: IapContentAccess[];
}

export interface IapCourseContentAccess {
  courseId: string;
  courseTitle: string;
  contentEnabled: boolean;
  sections: IapSectionAccess[];
}
