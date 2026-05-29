export enum ParticipantStatus {
  PENDING = 'pending', // Chưa gửi/Chờ xác nhận
  CONFIRMED = 'confirmed', // Đã xác nhận tham gia
  DECLINED = 'declined', // Đã từ chối
}

export enum ParticipantSide {
  GROOM = 'groom', // Nhà trai
  BRIDE = 'bride', // Nhà gái
}
