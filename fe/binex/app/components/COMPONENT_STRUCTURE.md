# Quy tắc tổ chức Component - Binex System

Hệ thống Component của Binex được tổ chức theo mô hình **Atomic Design** rút gọn để đảm bảo tính tái sử dụng và quản lý dễ dàng.

## 1. Phân loại tiền tố (Naming Convention)

| Tiền tố | Ý nghĩa | Ví dụ | Vị trí |
| :--- | :--- | :--- | :--- |
| **Cm** | **Common / Atomic**: Các thành phần cơ bản, nhỏ nhất hoặc các utility component dùng chung. | `CmButton`, `CmModal`, `CmFadeIn`, `CmSkeleton` | `app/components/commons/` |
| **Ci** | **Integration**: Các thành phần phức hợp, được lắp ghép từ nhiều `Cm` hoặc chứa logic nghiệp vụ phức tạp. | `CiHeader`, `CiFooter`, `CiSidebar`, `CiFinanceDashboard` | `app/components/integrations/` |
| **Vp** | **View Page**: Các component đại diện cho một trang hoàn chỉnh. | `VpHome`, `VpNews`, `VpFinance` | `app/pages/web/` |

## 2. Quy tắc thư mục

- **`app/components/commons/`**: Chứa toàn bộ các component bắt đầu bằng `Cm`. Không được chứa logic nghiệp vụ (business logic) quá sâu, tập trung vào UI/UX.
- **`app/components/integrations/`**: Chứa toàn bộ các component bắt đầu bằng `Ci`. Đây là nơi xử lý các khối giao diện lớn của ứng dụng.
- **`app/pages/`**: Nơi định nghĩa route. Các file tại đây thường sẽ gọi đến các `Vp` component để hiển thị.

## 3. Lưu ý khi tạo mới
- Mọi component mới **phải** có tiền tố đúng theo phân loại trên.
- Không đặt các component phức hợp vào thư mục `commons`.
- Ưu tiên sử dụng `Cm` để xây dựng `Ci`.
