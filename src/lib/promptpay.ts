/**
 * Real Thai EMVCo PromptPay QR Code Payload Generator
 * Generates standard PromptPay QR string compatible with all Thai mobile banking apps (K PLUS, SCB Easy, Krungthai NEXT, etc.)
 */

export const PROMPTPAY_PHONE = '0909964514'
export const PROMPTPAY_BANK = 'ธนาคารกสิกรไทย (KBANK)'
export const PROMPTPAY_ACCOUNT_NAME = 'วันชนะ ขวัญแก้ว'

function crc16(data: string): string {
  let crc = 0xffff
  for (let i = 0; i < data.length; i++) {
    const charCode = data.charCodeAt(i)
    crc ^= charCode << 8
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff
      } else {
        crc = (crc << 1) & 0xffff
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

export function generatePromptPayPayload(phoneNumber: string = PROMPTPAY_PHONE, amount?: number): string {
  // Clean phone number: 0909964514 -> 0066909964514
  let cleaned = phoneNumber.replace(/[^0-9]/g, '')
  if (cleaned.startsWith('0')) {
    cleaned = '0066' + cleaned.substring(1)
  }

  // Tag 29: Merchant Account Info (PromptPay)
  const targetTag = `01${cleaned.length.toString().padStart(2, '0')}${cleaned}`
  const aidTag = '0016A000000677010111'
  const tag29Content = aidTag + targetTag
  const tag29 = `29${tag29Content.length.toString().padStart(2, '0')}${tag29Content}`

  let payload = '000201' // Payload Format Indicator
  payload += amount && amount > 0 ? '010212' : '010211' // Dynamic (with amount) or Static
  payload += tag29
  payload += '5802TH' // Country Code (TH)
  payload += '5303764' // Currency Code (764 for THB)

  if (amount && amount > 0) {
    const amountStr = amount.toFixed(2)
    payload += `54${amountStr.length.toString().padStart(2, '0')}${amountStr}`
  }

  payload += '6304' // CRC Tag
  const checksum = crc16(payload)
  return payload + checksum
}
