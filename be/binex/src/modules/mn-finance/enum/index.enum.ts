export enum FiStatusTransaction {
  SUCCESS = 'success',
  FAILED = 'failed',
}

export enum FiTransactionType {
  DEPOSIT = 'deposit', // Nạp tiền từ ví wallet
  WITHDRAW = 'withdraw', // Rút tiền ra ví wallet
  BUY = 'buy', // Mua token
  SELL = 'sell', // Bán token
}
