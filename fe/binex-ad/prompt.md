# promt.md

# Quy định tạo và chia Component Page

## 1. Cấu trúc tổng quan

Thư mục `components` được chia thành 3 nhóm chính:

```txt
components/
├── common/
├── page/
└── integration/
```

Quy ước tiền tố component:

```txt
Cm = Common component
Ci = Integration component
Cp = Page component
```

Ví dụ:

```txt
CmButton.vue
CmInput.vue
CmCard.vue

CiFilterForm.vue
CiDataTable.vue

CpUserList.vue
CpUserModal.vue
CpUserFilter.vue
```

---

# 2. View Page là gì?

`View Page` là trang người dùng nhìn thấy trực tiếp.

Ví dụ:

```txt
pages/users/index.vue
pages/courses/detail.vue
pages/orders/index.vue
```

Một `View Page` được cấu thành từ nhiều phần chức năng riêng biệt.

Ví dụ:

```txt
- Bộ lọc
- Danh sách
- Modal thêm
- Modal sửa
- Modal xoá
```

Mỗi phần chức năng riêng biệt nên được tách thành `Cp`.

---

# 3. Quy tắc View Page

Trong `View Page`:

- Chỉ chứa:
  - `Cp`
  - `Ci`
  - `Cm`

- Không chứa:
  - button gốc
  - input gốc
  - select gốc
  - checkbox gốc
  - radio gốc
  - table gốc

Sai:

```vue
<template>
  <button />
  <input />
</template>
```

Đúng:

```vue
<template>
  <CpUserFilter />
  <CpUserTable />
  <CiConfirmModal />
  <CmButton />
</template>
```

---

# 4. Component Page - Cp

`Cp` là component thuộc riêng một page cụ thể.

Cp đại diện cho một chức năng riêng biệt của page đó.

Ví dụ:

```txt
components/page/users/
├── CpUserFilter.vue
├── CpUserTable.vue
├── CpUserCreateModal.vue
└── CpUserUpdateModal.vue
```

Cp được tạo nên từ:

```txt
- Cm
- Ci
```

Cp có thể chứa:

```txt
- Cm
- Ci
```

Cp không nên dùng trực tiếp component UI gốc.

Sai:

```vue
<button />
<input />
<UButton />
<UInput />
```

Đúng:

```vue
<CmButton />
<CmInput />
```

---

# 5. Component Integration - Ci

`Ci` là component dùng lại ở nhiều page khác nhau.

Ci cũng đại diện cho một chức năng riêng biệt nhưng không thuộc riêng một page nào.

Ví dụ:

```txt
CiConfirmModal.vue
CiDataTable.vue
CiUploadImage.vue
CiSearchFilter.vue
```

Ci chỉ được chứa:

```txt
- Cm
```

Ci không được chứa:

```txt
- Cp
```

Sai:

```vue
<template>
  <CpUserModal />
</template>
```

Đúng:

```vue
<template>
  <CmButton />
  <CmInput />
</template>
```

---

# 6. Component Common - Cm

`Cm` là component đơn vị dùng chung toàn hệ thống.

Cm thường được custom từ NuxtUI hoặc component UI gốc.

Ví dụ:

```txt
CmButton.vue
CmInput.vue
CmSelect.vue
CmCheckbox.vue
CmRadio.vue
CmTable.vue
CmModal.vue
CmCard.vue
```

Cm là lớp component thấp nhất.

Tất cả hệ thống nên dùng `Cm` thay vì component gốc.

Không dùng:

```vue
<button />
<input />
<select />
<UButton />
<UInput />
```

Nên dùng:

```vue
<CmButton />
<CmInput />
<CmSelect />
```

---

# 7. Cách phân biệt Cp và Ci

## Cp

- Chỉ dùng riêng cho một page
- Đại diện cho chức năng riêng của page
- Có thể chứa:
  - Ci
  - Cm

Ví dụ:

```txt
CpCourseHero.vue
CpCourseTeacher.vue
CpCourseRegisterModal.vue
```

---

## Ci

- Dùng lại ở nhiều page
- Đại diện cho chức năng dùng chung
- Chỉ được chứa:
  - Cm

Không được chứa:

```txt
- Cp
```

Ví dụ:

```txt
CiConfirmModal.vue
CiDataTable.vue
CiDateRangeFilter.vue
```

---

# 8. Quy tắc phụ thuộc

Luồng phụ thuộc đúng:

```txt
View Page
├── Cp
│   ├── Ci
│   │   └── Cm
│   └── Cm
├── Ci
│   └── Cm
└── Cm
```

Không được:

```txt
Ci → Cp
Cm → Cp
Cm → Ci
```

---

# 9. Quy tắc style

Sử dụng:

```txt
- TailwindCSS
- color.scss
- Token màu hệ thống
```

Không gắn cứng màu.

Sai:

```vue
class="text-[#ff0000] bg-[#ffffff]"
```

Đúng:

```vue
class="text-primary bg-background"
```

Hoặc dùng token từ `color.scss`.

---

# 10. Quy tắc style cho Cm

Hạn chế style lặp lại ở nhiều nơi.

Nếu tất cả `Cm` đều dùng chung style thì phải setting trực tiếp trong `Cm`.

Sai:

```vue
<CmButton class="h-10 rounded-lg px-4 font-semibold" />
<CmButton class="h-10 rounded-lg px-4 font-semibold" />
<CmButton class="h-10 rounded-lg px-4 font-semibold" />
```

Đúng:

```vue
<CmButton />
```

Và config style mặc định bên trong `CmButton.vue`.

---

# 11. Quy tắc thư mục page

Cp của page nào phải nằm trong thư mục page đó.

Ví dụ:

```txt
pages/users/index.vue

components/page/users/
├── CpUserFilter.vue
├── CpUserTable.vue
├── CpUserCreateModal.vue
└── CpUserUpdateModal.vue
```

Nếu dùng lại ở nhiều page thì phải chuyển thành `Ci`.

---

# 12. Quy trình tạo component

## Bước 1

Nếu là component đơn vị:

```txt
Button
Input
Select
Checkbox
Card
Modal
Table
```

→ tạo `Cm`

---

## Bước 2

Nếu là chức năng dùng nhiều page:

```txt
Confirm modal
Data table
Upload image
Search filter
```

→ tạo `Ci`

---

## Bước 3

Nếu là chức năng riêng của page:

```txt
User filter
User table
Course hero
Course register modal
```

→ tạo `Cp`

---

# 13. Checklist trước khi code

```txt
[ ] Đây là Cm, Ci hay Cp?
[ ] Cp đã nằm đúng thư mục page chưa?
[ ] Ci có chứa Cp không?
[ ] Có dùng button/input/select gốc không?
[ ] Có dùng tailwindcss không?
[ ] Có gắn cứng màu không?
[ ] Có dùng color.scss không?
[ ] Có style lặp lại nhiều nơi không?
[ ] Có nên đưa style đó vào Cm không?
```

---

# 14. Tổng kết

```txt
Cm = Component đơn vị dùng chung toàn hệ thống
Ci = Component chức năng dùng lại nhiều page
Cp = Component chức năng riêng của page
View Page = Trang người dùng nhìn thấy
```

Luồng chuẩn:

```txt
View Page → Cp → Ci → Cm
View Page → Ci → Cm
View Page → Cm
```

Không đảo ngược phụ thuộc.

Không để `Ci` chứa `Cp`.

Không dùng trực tiếp component gốc trong `Cp` và `Ci`.

Ưu tiên dùng:

```txt
- TailwindCSS
- color.scss
- Cm system
```
