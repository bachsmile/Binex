export const permissionExtendedTemplate = (name: string, expiredAt: string) => {
  return `<!doctype html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Tài khoản đã được gia hạn</title>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header { text-align: center; margin-bottom: 30px; }
    .content { color: #333333; line-height: 1.6; }
    .highlight { color: #28a745; font-weight: bold; font-size: 18px; }
    .footer { margin-top: 30px; font-size: 12px; color: #777777; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://cloudfilesdm.com/postcards/ChatGPT_Image_13_05_23_4_thg_5_2026-61bfd000.png" width="100" alt="Logo" />
    </div>
    <div class="content">
      <p>Xin chào <strong>${name}</strong>,</p>
      <p>Chúng tôi xin thông báo dịch vụ của bạn đã được gia hạn thành công.</p>
      <p>Thời hạn sử dụng mới của bạn là: <span class="highlight">${expiredAt}</span></p>
      <p>Cảm ơn bạn đã tiếp tục tin tưởng và sử dụng dịch vụ của Binex.</p>
    </div>
    <div class="footer">
      <p>© 2026 Binex System. Đây là email tự động.</p>
    </div>
  </div>
</body>
</html>`;
};
