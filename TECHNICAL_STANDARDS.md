# Binex Technical Standards

Tài liệu quy định các từ khóa (Keys) và cấu trúc dữ liệu dùng chung toàn hệ thống để đảm bảo tính đồng bộ giữa Backend, Frontend và Mobile.

## 1. Phân trang (Pagination Standards)

Mọi API có chức năng danh sách phải tuân thủ quy chuẩn này.

### Request (Query Parameters)
| Key | Type | Default | Description |
|:---|:---|:---|:---|
| `page` | `number` | `1` | Số thứ tự trang hiện tại (bắt đầu từ 1) |
| `limit` | `number` | `10` | Số lượng bản ghi muốn lấy trên một trang |

### Response (Object Structure)
| Key | Type | Description |
|:---|:---|:---|
| `data` | `Array` | Danh sách các bản ghi của trang hiện tại |
| `total` | `number` | Tổng số lượng bản ghi thỏa mãn điều kiện trong DB |

---

## 2. API Response Wrapper (Hành vi trả về)

Hệ thống ưu tiên trả về dữ liệu phẳng (Flat) nếu không có yêu cầu đặc biệt về Meta-data bổ sung.

- **Thành công (Success):** Trả về Object dữ liệu hoặc Array kèm HTTP Status `200` hoặc `201`.
- **Thất bại (Error):**
    - `statusCode`: Mã lỗi HTTP (400, 401, 403, 404, 500).
    - `message`: Thông báo lỗi chi tiết (Dùng cho Developer).
    - `error`: Tên loại lỗi (BadRequestException, NotFoundException...).

---

## 3. Định dạng Ngày tháng (DateTime)

Sử dụng định dạng ISO 8601 để đồng bộ hóa múi giờ:
- Ví dụ: `2026-05-06T10:37:02Z`
