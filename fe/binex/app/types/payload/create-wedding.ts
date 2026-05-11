/** Auto-generated payload */


export interface CreateWeddingDto {

  /**
   * example: Đám cưới Thế Kỷ
   */
  name?: string;

  /**
   * example: Mô tả ngắn về ngày vui
   */
  description?: string;

  /**
   * example: Nguyễn Văn A
   */
  groomName: string;

  /**
   * example: 0901234567
   */
  groomPhone?: string;

  /**
   * example: Nguyễn Văn B
   */
  fatherGroomName?: string;

  /**
   * example: Trần Thị C
   */
  motherGroomName?: string;

  /**
   * example: Lê Thị D
   */
  brideName: string;

  /**
   * example: 0907654321
   */
  bridePhone?: string;

  /**
   * example: Lê Văn E
   */
  fatherBrideName?: string;

  /**
   * example: Phạm Thị F
   */
  motherBrideName?: string;

  /**
   * example: 2026-12-25T18:00:00Z
   */
  weddingDate: string;

  /**
   * example: 2026-12-20T08:00:00Z
   */
  inviteDate?: string;

  /**
   * example: 18:30
   */
  ceremonyTime?: string;

  /**
   * example: Trung tâm tiệc cưới Gem Center
   */
  venueName: string;

  /**
   * example: 183 Nguyễn Bỉnh Khiêm
   */
  venueAddress: string;

  /**
   * example: Tư gia nhà gái
   */
  inviteAddress?: string;

  /**
   * example: 500
   */
  guestCount?: number;

  /**
   * example: 500000000
   */
  budget?: number;

  /**
   * example: https://wedding.com/abc
   */
  qrCode?: string;

  /**
   * example: Lưu ý đặc biệt cho đám cưới
   */
  note?: string;

  /**
   * example: draft
   */
  status?: string;

  /**
   * example: 2026-12-25T18:00:00Z
   */
  createdBy?: string;

  /**
   * example: false
   */
  autoSend?: boolean;

  /**
   * example: 2026-12-25T18:00:00Z
   */
  updatedBy?: string;

  /**
   * example: false
   */
  isDeleted?: boolean;

  /**
   * example: ['https://example.com/image1.jpg']
   */
  images?: string[];

  /**
   * example: ['https://example.com/video1.mp4']
   */
  videos?: string[];

}

