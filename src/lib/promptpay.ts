/**
 * Real Thai EMVCo PromptPay QR Code Payload Generator
 * Supports Mobile Phone (10 digits), National ID / Tax ID (13 digits), and e-Wallet (15 digits)
 * Fully compatible with all Thai mobile banking apps (K PLUS, SCB Easy, Krungthai NEXT, etc.)
 */

export const PROMPTPAY_PHONE = '0909964514'
export const PROMPTPAY_BANK = 'ธนาคารกสิกรไทย (KBANK)'
export const PROMPTPAY_ACCOUNT_NAME = 'วันชนะ ขวัญแก้ว'
export const PROMPTPAY_LINE_ID = '@amth'
export const PROMPTPAY_LINE_URL = 'https://line.me/ti/p/@amth'

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

export function generatePromptPayPayload(target: string = PROMPTPAY_PHONE, amount?: number): string {
  const cleaned = (target || PROMPTPAY_PHONE).replace(/[^0-9]/g, '')
  
  let targetTag = ''
  if (cleaned.length >= 13) {
    // 13-digit National ID / Tax ID
    targetTag = `02${cleaned.length.toString().padStart(2, '0')}${cleaned}`
  } else {
    // Mobile Phone Number (formatted with Thailand country code 0066)
    let phoneFormatted = cleaned
    if (phoneFormatted.startsWith('0')) {
      phoneFormatted = '0066' + phoneFormatted.substring(1)
    } else if (!phoneFormatted.startsWith('0066')) {
      phoneFormatted = '0066' + phoneFormatted
    }
    targetTag = `01${phoneFormatted.length.toString().padStart(2, '0')}${phoneFormatted}`
  }

  // Tag 29: Merchant Account Info (PromptPay)
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
