export const accountActivatedTemplate = (name: string, loginUrl: string) => {
  return `<!doctype html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Tài khoản đã được kích hoạt</title>
  <style>
    body { font-family: 'DM Sans', Arial, sans-serif; background-color: #f3f3f3; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
    .header { background: #1a1a1a; padding: 30px; text-align: center; }
    .content { padding: 40px; text-align: center; color: #333333; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #777777; background: #fafafa; }
    .button { display: inline-block; padding: 14px 30px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; }
    h1 { color: #1a1a1a; margin-bottom: 20px; }
    p { line-height: 1.6; margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://cloudfilesdm.com/postcards/ChatGPT_Image_13_05_23_4_thg_5_2026-61bfd000.png" width="126" alt="Binex Logo" />
    </div>
    <div class="content">
      <h1>Chúc mừng, ${name}!</h1>
      <p>Tài khoản của bạn trên hệ thống <strong>Binex</strong> đã được quản trị viên phê duyệt và kích hoạt thành công.</p>
      <p>Bây giờ bạn đã có thể đăng nhập vào hệ thống để bắt đầu sử dụng các dịch vụ của chúng tôi.</p>
      <a href="${loginUrl}" class="button">Đăng nhập ngay</a>
    </div>
    <div class="footer">
      <p>© 2026 Binex System. Đây là email tự động, vui lòng không trả lời.</p>
    </div>
  </div>
</body>
</html>`;
};
