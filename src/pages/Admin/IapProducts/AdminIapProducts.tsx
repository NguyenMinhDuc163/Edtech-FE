import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Apple,
  Check,
  ChevronRight,
  Copy,
  ExternalLink,
  Filter,
  Globe2,
  PackagePlus,
  RefreshCw,
  Search,
  ShoppingBag,
  Smartphone,
  X,
} from "lucide-react";
import { useToast } from "@/components/Notification/common/ToastProvider";
import { iapAdminService } from "@/services/Iap/iapAdminService";
import type {
  IapAdminCourse,
  IapGlobalParameter,
  IapStoreProduct,
  StorePlatform,
} from "@/types/Iap/iapAdmin.type";
import "./AdminIapProducts.css";

type StatusFilter = "ALL" | "ENABLED" | "READY" | "MISSING";

const platformDetails: Record<
  StorePlatform,
  { label: string; store: "PLAY_STORE" | "APP_STORE"; className: string }
> = {
  ANDROID: { label: "Google Play", store: "PLAY_STORE", className: "android" },
  IOS: { label: "App Store", store: "APP_STORE", className: "ios" },
};

function getErrorMessage(error: unknown, fallback: string) {
  const candidate = error as { response?: { data?: { message?: string } }; message?: string };
  return candidate.response?.data?.message || candidate.message || fallback;
}

function AdminSwitch({
  checked,
  disabled,
  label,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      className={`iap-admin-switch ${checked ? "is-on" : ""}`}
      onClick={() => onChange(!checked)}
    >
      <span />
    </button>
  );
}

function ProductWizard({
  courses,
  initialCourseId,
  onClose,
  onCreated,
}: {
  courses: IapAdminCourse[];
  initialCourseId?: string;
  onClose: () => void;
  onCreated: () => Promise<void>;
}) {
  const { showToast } = useToast();
  const [courseId, setCourseId] = useState(initialCourseId ?? courses[0]?.courseId ?? "");
  const [platforms, setPlatforms] = useState<StorePlatform[]>(["ANDROID", "IOS"]);
  const [submitting, setSubmitting] = useState(false);
  const selectedCourse = courses.find((course) => course.courseId === courseId);
  const productId = selectedCourse ? `edtech.course.${selectedCourse.courseId}.lifetime` : "";
  const entitlementId = selectedCourse ? `course_${selectedCourse.courseId}_access` : "";

  useEffect(() => {
    if (!selectedCourse) return;
    const missingPlatforms = (["ANDROID", "IOS"] as StorePlatform[]).filter(
      (platform) => !selectedCourse.products.some((product) => product.platform === platform),
    );
    setPlatforms(missingPlatforms);
  }, [courseId, selectedCourse]);

  const copyValue = async (value: string, label: string) => {
    await navigator.clipboard.writeText(value);
    showToast(`Đã sao chép ${label}`, "success");
  };

  const togglePlatform = (platform: StorePlatform) => {
    setPlatforms((current) =>
      current.includes(platform)
        ? current.filter((item) => item !== platform)
        : [...current, platform],
    );
  };

  const submit = async () => {
    if (!selectedCourse || platforms.length === 0) return;
    setSubmitting(true);
    try {
      if (!selectedCourse.isPaid) {
        await iapAdminService.updateCourseIap(selectedCourse.courseId, {
          mobileIapEnabled: false,
          isPaid: true,
        });
      }
      const results = await Promise.allSettled(
        platforms.map((platform) =>
          iapAdminService.createStoreProduct(selectedCourse.courseId, {
            platform,
            store: platformDetails[platform].store,
            productId,
            entitlementId,
            productType: "NON_CONSUMABLE",
            isActive: false,
          }),
        ),
      );
      const succeeded = results.filter((result) => result.status === "fulfilled").length;
      const failed = results.length - succeeded;
      if (succeeded > 0) {
        showToast(
          `Đã tạo ${succeeded} mapping ở trạng thái tắt${failed ? `, ${failed} mapping lỗi` : ""}`,
          failed ? "warning" : "success",
        );
        await onCreated();
        onClose();
        return;
      }
      const firstFailure = results.find(
        (result): result is PromiseRejectedResult => result.status === "rejected",
      );
      throw firstFailure?.reason ?? new Error("Không thể tạo mapping");
    } catch (error) {
      showToast(getErrorMessage(error, "Tạo cấu hình sản phẩm thất bại"), "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="iap-admin-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="iap-admin-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="iap-product-wizard-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="iap-admin-modal-header">
          <div>
            <span className="iap-admin-eyebrow">Cấu hình nhanh</span>
            <h2 id="iap-product-wizard-title">Tạo sản phẩm IAP mới</h2>
            <p>Chọn bằng tên khóa học, hệ thống tự tạo mã chuẩn để bạn không phải nhớ ID.</p>
          </div>
          <button type="button" className="iap-admin-icon-btn" onClick={onClose} aria-label="Đóng">
            <X size={20} />
          </button>
        </header>

        <div className="iap-admin-modal-body">
          <label className="iap-admin-field">
            <span>Khóa học</span>
            <select value={courseId} onChange={(event) => setCourseId(event.target.value)}>
              {courses.map((course) => (
                <option key={course.courseId} value={course.courseId}>
                  {course.title}
                </option>
              ))}
            </select>
          </label>

          <div className="iap-admin-code-grid">
            <div className="iap-admin-code-card">
              <span>Product ID đề xuất</span>
              <strong>{productId}</strong>
              <button type="button" onClick={() => copyValue(productId, "Product ID")}>
                <Copy size={15} /> Sao chép
              </button>
            </div>
            <div className="iap-admin-code-card">
              <span>Entitlement RevenueCat</span>
              <strong>{entitlementId}</strong>
              <button type="button" onClick={() => copyValue(entitlementId, "Entitlement ID")}>
                <Copy size={15} /> Sao chép
              </button>
            </div>
          </div>

          <fieldset className="iap-admin-platform-picker">
            <legend>Nền tảng cần cấu hình</legend>
            {(["ANDROID", "IOS"] as StorePlatform[]).map((platform) => {
              const exists = selectedCourse?.products.some((product) => product.platform === platform);
              return (
                <label key={platform} className={exists ? "is-disabled" : ""}>
                  <input
                    type="checkbox"
                    checked={platforms.includes(platform)}
                    disabled={exists}
                    onChange={() => togglePlatform(platform)}
                  />
                  <span className={`iap-admin-platform-icon ${platformDetails[platform].className}`}>
                    {platform === "IOS" ? <Apple size={20} /> : <Smartphone size={20} />}
                  </span>
                  <span>
                    <strong>{platformDetails[platform].label}</strong>
                    <small>{exists ? "Đã có mapping" : "Tạo mapping mới (đang tắt)"}</small>
                  </span>
                  {exists && <Check size={18} className="iap-admin-check-icon" />}
                </label>
              );
            })}
          </fieldset>

          <div className="iap-admin-store-note">
            <ShoppingBag size={19} />
            <div>
              <strong>Bước này tạo mapping trong hệ thống, chưa tạo sản phẩm thật trên Store.</strong>
              <p>
                Dùng Product ID phía trên để tạo Non-consumable trên App Store Connect và One-time
                product trên Google Play, sau đó import vào RevenueCat rồi mới bật công tắc.
              </p>
              <div>
                <a href="https://play.google.com/console/developers" target="_blank" rel="noreferrer">
                  Google Play Console <ExternalLink size={13} />
                </a>
                <a href="https://appstoreconnect.apple.com/apps" target="_blank" rel="noreferrer">
                  App Store Connect <ExternalLink size={13} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <footer className="iap-admin-modal-footer">
          <button type="button" className="iap-admin-btn secondary" onClick={onClose}>
            Hủy
          </button>
          <button
            type="button"
            className="iap-admin-btn primary"
            disabled={!selectedCourse || platforms.length === 0 || submitting}
            onClick={submit}
          >
            {submitting ? <RefreshCw size={17} className="iap-admin-spin" /> : <PackagePlus size={17} />}
            Tạo cấu hình
          </button>
        </footer>
      </section>
    </div>
  );
}

export default function AdminIapProducts() {
  const { showToast } = useToast();
  const [courses, setCourses] = useState<IapAdminCourse[]>([]);
  const [globalParameter, setGlobalParameter] = useState<IapGlobalParameter | null>(null);
  const [searchDraft, setSearchDraft] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [loading, setLoading] = useState(true);
  const [busyKeys, setBusyKeys] = useState<string[]>([]);
  const [wizardCourseId, setWizardCourseId] = useState<string | undefined>();
  const [wizardOpen, setWizardOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [courseResponse, parameter] = await Promise.all([
        iapAdminService.getCourses({ page: 1, limit: 100, title: search || undefined }),
        iapAdminService.getGlobalIapParameter(),
      ]);
      const enabledCourses = courseResponse.courses.filter((rawCourse) => Boolean(rawCourse.contentEnabled));
      const courseRows = await Promise.all(
        enabledCourses.map(async (rawCourse) => {
          const courseId = String(rawCourse.courseId);
          const products: IapStoreProduct[] = await iapAdminService.getStoreProducts(courseId);
          return {
            courseId,
            title: String(rawCourse.title ?? "Khóa học chưa đặt tên"),
            status: String(rawCourse.status ?? "DRAFT"),
            visibility: rawCourse.visibility === "PUBLIC" ? "PUBLIC" : "PRIVATE",
            isPaid: Boolean(rawCourse.isPaid),
            mobileIapEnabled: Boolean(rawCourse.mobileIapEnabled),
            contentEnabled: true,
            price: String(rawCourse.price ?? 0),
            currency: String(rawCourse.currency ?? "VND"),
            products,
          } satisfies IapAdminCourse;
        }),
      );
      setCourses(courseRows);
      setGlobalParameter(parameter);
    } catch (error) {
      showToast(getErrorMessage(error, "Không thể tải danh sách sản phẩm IAP"), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [search]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const hasProduct = course.products.length > 0;
      const hasActiveProduct = course.products.some((product) => product.is_active);
      if (statusFilter === "ENABLED") return course.mobileIapEnabled;
      if (statusFilter === "READY") return hasActiveProduct && !course.mobileIapEnabled;
      if (statusFilter === "MISSING") return !hasProduct;
      return true;
    });
  }, [courses, statusFilter]);

  const globalEnabled = globalParameter?.param_value.toUpperCase() === "Y";
  const configuredCount = courses.filter((course) => course.products.length > 0).length;
  const enabledCount = courses.filter((course) => course.mobileIapEnabled).length;
  const activeProductCount = courses.reduce(
    (total, course) => total + course.products.filter((product) => product.is_active).length,
    0,
  );

  const markBusy = (key: string, busy: boolean) => {
    setBusyKeys((current) => (busy ? [...current, key] : current.filter((item) => item !== key)));
  };

  const patchCourse = (courseId: string, patch: Partial<IapAdminCourse>) => {
    setCourses((current) =>
      current.map((course) => (course.courseId === courseId ? { ...course, ...patch } : course)),
    );
  };

  const handleGlobalToggle = async (enabled: boolean) => {
    if (!globalParameter) {
      showToast("Không tìm thấy tham số MOBILE_IAP_ENABLED", "error");
      return;
    }
    if (!enabled && !window.confirm("Tắt IAP toàn hệ thống? Người dùng sẽ không thể bắt đầu giao dịch mới.")) {
      return;
    }
    markBusy("global", true);
    try {
      await iapAdminService.updateGlobalIap(globalParameter.param_id, enabled);
      setGlobalParameter({ ...globalParameter, param_value: enabled ? "Y" : "N" });
      showToast(enabled ? "Đã bật IAP toàn hệ thống" : "Đã tắt IAP toàn hệ thống", "success");
    } catch (error) {
      showToast(getErrorMessage(error, "Cập nhật IAP toàn hệ thống thất bại"), "error");
    } finally {
      markBusy("global", false);
    }
  };

  const handleCourseIapToggle = async (course: IapAdminCourse, enabled: boolean) => {
    const key = `iap-${course.courseId}`;
    markBusy(key, true);
    try {
      await iapAdminService.updateCourseIap(course.courseId, {
        mobileIapEnabled: enabled,
        isPaid: enabled ? true : undefined,
      });
      patchCourse(course.courseId, { mobileIapEnabled: enabled, isPaid: enabled || course.isPaid });
      showToast(`${enabled ? "Đã bật" : "Đã tắt"} IAP cho “${course.title}”`, "success");
    } catch (error) {
      showToast(getErrorMessage(error, "Cập nhật IAP khóa học thất bại"), "error");
    } finally {
      markBusy(key, false);
    }
  };

  const handleProductToggle = async (
    course: IapAdminCourse,
    product: IapStoreProduct,
    enabled: boolean,
  ) => {
    if (
      enabled &&
      !window.confirm(
        `Xác nhận sản phẩm ${platformDetails[product.platform].label} đã được tạo trên Store, import vào RevenueCat và gắn đúng entitlement?`,
      )
    ) {
      return;
    }
    const key = `product-${product.id}`;
    markBusy(key, true);
    try {
      const isLastActiveProduct =
        !enabled &&
        product.is_active &&
        !course.products.some((item) => item.id !== product.id && item.is_active);
      const updated = await iapAdminService.updateStoreProduct(course.courseId, product.id, {
        isActive: enabled,
      });
      patchCourse(course.courseId, {
        mobileIapEnabled: isLastActiveProduct ? false : course.mobileIapEnabled,
        products: course.products.map((item) => {
          if (item.id === product.id) return updated;
          if (enabled && item.platform === product.platform) return { ...item, is_active: false };
          return item;
        }),
      });
      showToast(`${enabled ? "Đã bật" : "Đã tắt"} ${platformDetails[product.platform].label}`, "success");
    } catch (error) {
      showToast(getErrorMessage(error, "Cập nhật Store product thất bại"), "error");
    } finally {
      markBusy(key, false);
    }
  };

  const openWizard = (courseId?: string) => {
    setWizardCourseId(courseId);
    setWizardOpen(true);
  };

  return (
    <div className="iap-admin-page">
      <header className="iap-admin-page-header">
        <div>
          <span className="iap-admin-eyebrow">Mobile commerce</span>
          <h1>Quản lý sản phẩm IAP</h1>
          <p>Chỉ các khóa học đã bật nội dung mới xuất hiện tại đây để cấu hình Google Play và App Store.</p>
        </div>
        <button type="button" className="iap-admin-btn primary" onClick={() => openWizard()} disabled={!courses.length}>
          <PackagePlus size={18} /> Tạo cấu hình sản phẩm
        </button>
      </header>

      <section className={`iap-admin-global-card ${globalEnabled ? "is-enabled" : ""}`}>
        <div className="iap-admin-global-icon"><Globe2 size={24} /></div>
        <div className="iap-admin-global-copy">
          <div>
            <h2>IAP toàn hệ thống</h2>
            <span className={`iap-admin-status-pill ${globalEnabled ? "success" : "neutral"}`}>
              {globalEnabled ? "Đang mở bán" : "Đang tạm dừng"}
            </span>
          </div>
          <p>Công tắc tổng cho giao dịch mới trên mobile. Tắt công tắc này không xóa giao dịch hay quyền học đã có.</p>
        </div>
        <AdminSwitch
          checked={globalEnabled}
          disabled={!globalParameter || busyKeys.includes("global")}
          label="Bật hoặc tắt IAP toàn hệ thống"
          onChange={handleGlobalToggle}
        />
      </section>

      <section className="iap-admin-stats" aria-label="Tổng quan IAP">
        <article><span>Khóa học đã cấu hình</span><strong>{configuredCount}</strong><small>/ {courses.length} khóa học</small></article>
        <article><span>Đang bật bán mobile</span><strong>{enabledCount}</strong><small>theo từng khóa học</small></article>
        <article><span>Store product active</span><strong>{activeProductCount}</strong><small>Android và iOS</small></article>
      </section>

      <section className="iap-admin-toolbar">
        <form
          className="iap-admin-search"
          onSubmit={(event) => {
            event.preventDefault();
            setSearch(searchDraft.trim());
          }}
        >
          <Search size={18} />
          <input
            value={searchDraft}
            onChange={(event) => setSearchDraft(event.target.value)}
            placeholder="Tìm theo tên khóa học..."
          />
          {searchDraft && (
            <button type="button" onClick={() => { setSearchDraft(""); setSearch(""); }} aria-label="Xóa tìm kiếm">
              <X size={16} />
            </button>
          )}
        </form>
        <label className="iap-admin-filter">
          <Filter size={17} />
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}>
            <option value="ALL">Tất cả trạng thái</option>
            <option value="ENABLED">Đang bật IAP</option>
            <option value="READY">Có product, chưa bật bán</option>
            <option value="MISSING">Chưa có product</option>
          </select>
        </label>
        <button type="button" className="iap-admin-icon-btn bordered" onClick={() => void loadData()} disabled={loading} aria-label="Làm mới">
          <RefreshCw size={18} className={loading ? "iap-admin-spin" : ""} />
        </button>
      </section>

      <section className="iap-admin-catalog">
        <div className="iap-admin-catalog-head">
          <strong>Khóa học đủ điều kiện cấu hình</strong>
          <span>{filteredCourses.length} kết quả</span>
        </div>

        {loading ? (
          <div className="iap-admin-skeleton-list">
            {[1, 2, 3].map((item) => <div key={item} className="iap-admin-skeleton" />)}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="iap-admin-empty">
            <Search size={28} />
            <h3>Không tìm thấy khóa học phù hợp</h3>
            <p>Thử đổi từ khóa hoặc bộ lọc trạng thái.</p>
          </div>
        ) : (
          <div className="iap-admin-course-list">
            {filteredCourses.map((course) => {
              const hasActiveProduct = course.products.some((product) => product.is_active);
              return (
                <article key={course.courseId} className={`iap-admin-course-card ${course.mobileIapEnabled ? "is-selling" : ""}`}>
                  <div className="iap-admin-course-main">
                    <div className="iap-admin-course-title-row">
                      <div>
                        <h3>{course.title}</h3>
                        <div className="iap-admin-course-badges">
                          <span className={`iap-admin-status-pill ${course.status === "APPROVED" ? "success" : "warning"}`}>
                            {course.status === "APPROVED" ? "Đã duyệt" : "Chưa duyệt"}
                          </span>
                          <span className="iap-admin-status-pill info">Nội dung đã bật</span>
                        </div>
                      </div>
                      <div className="iap-admin-course-row-actions">
                        <button type="button" className="iap-admin-text-btn" onClick={() => openWizard(course.courseId)}>
                          <PackagePlus size={16} /> Thêm Store product
                        </button>
                      </div>
                    </div>

                    <div className="iap-admin-course-controls">
                      <div>
                        <span>Bán qua mobile IAP</span>
                        <small>{hasActiveProduct ? "Đã có Store product active" : "Cần bật ít nhất một Store product"}</small>
                        <AdminSwitch
                          checked={course.mobileIapEnabled}
                          disabled={busyKeys.includes(`iap-${course.courseId}`) || (!course.mobileIapEnabled && !hasActiveProduct)}
                          label={`Bật IAP cho khóa học ${course.title}`}
                          onChange={(checked) => void handleCourseIapToggle(course, checked)}
                        />
                      </div>
                    </div>

                    <div className="iap-admin-products">
                      {(["ANDROID", "IOS"] as StorePlatform[]).map((platform) => {
                        const product = course.products.find((item) => item.platform === platform);
                        const details = platformDetails[platform];
                        return (
                          <div key={platform} className={`iap-admin-product ${product?.is_active ? "is-active" : ""}`}>
                            <span className={`iap-admin-platform-icon ${details.className}`}>
                              {platform === "IOS" ? <Apple size={20} /> : <Smartphone size={20} />}
                            </span>
                            <div className="iap-admin-product-copy">
                              <strong>{details.label}</strong>
                              {product ? (
                                <span title={product.product_id}>{product.product_id}</span>
                              ) : (
                                <span>Chưa có cấu hình</span>
                              )}
                            </div>
                            {product ? (
                              <AdminSwitch
                                checked={product.is_active}
                                disabled={busyKeys.includes(`product-${product.id}`)}
                                label={`Bật ${details.label} cho ${course.title}`}
                                onChange={(checked) => void handleProductToggle(course, product, checked)}
                              />
                            ) : (
                              <button type="button" className="iap-admin-mini-btn" onClick={() => openWizard(course.courseId)}>
                                Thêm <ChevronRight size={14} />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <div className="iap-admin-footnote">
        <AlertTriangle size={17} />
        <span>Chỉ bật Store product sau khi đã tạo đúng mã trên Store, import vào RevenueCat và gắn entitlement. Product ID đã có giao dịch không nên đổi.</span>
      </div>

      {wizardOpen && (
        <ProductWizard
          courses={courses}
          initialCourseId={wizardCourseId}
          onClose={() => setWizardOpen(false)}
          onCreated={loadData}
        />
      )}
    </div>
  );
}
