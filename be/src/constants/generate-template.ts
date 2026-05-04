import * as XLSX from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';

const generateTemplate = () => {
  const data = [
    {
      'Họ tên': 'Nguyễn Văn A',
      'Số điện thoại': '0901111222',
      'Email': 'a@gmail.com',
      'Phía': 'Trai',
      'Người lớn': 2,
      'Trẻ em': 0,
      'Địa chỉ': '123 Đường ABC, Hà Nội',
      'Ghi chú': 'Ghi chú mẫu 1',
    },
    {
      'Họ tên': 'Trần Thị B',
      'Số điện thoại': '0903333444',
      'Email': 'b@gmail.com',
      'Phía': 'Gái',
      'Người lớn': 1,
      'Trẻ em': 1,
      'Địa chỉ': '456 Đường XYZ, TP.HCM',
      'Ghi chú': 'Ghi chú mẫu 2',
    },
  ];

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Guests');

  const dirPath = path.join(process.cwd(), 'src', 'constants', 'templates');
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const filePath = path.join(dirPath, 'guest_template.xlsx');
  XLSX.writeFile(wb, filePath);
  console.log('Sample Excel template created at:', filePath);
};

generateTemplate();
