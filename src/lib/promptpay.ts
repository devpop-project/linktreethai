/**
 * PromptPay EMVCo Payload Generator & CRC16-CCITT Calculator
 * Generates valid EMVCo QR Code payload for Thai PromptPay (Phone / Tax ID / E-Wallet) with custom amount.
 */

// Default Fallback PromptPay & Contact Constants
export const PROMPTPAY_PHONE = '0909964514'
export const PROMPTPAY_BANK = 'ธนาคารกสิกรไทย (KBANK)'
export const PROMPTPAY_ACCOUNT_NAME = 'วันชนะ ขวัญแก้ว'
export const PROMPTPAY_LINE_ID = '@amth'
export const PROMPTPAY_LINE_URL = 'https://line.me/ti/p/@amth'

function crc16(data: string): string {
  let crc = 0xffff
  for (let i = 0; i < data.length; i++) {
    let x = ((crc >> 8) ^ data.charCodeAt(i)) & 0xff
    x ^= x >> 4
    crc = ((crc << 8) ^ (x << 12) ^ (x << 5) ^ x) & 0xffff
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

function formatField(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0')
  return `${id}${len}${value}`
}

export function generatePromptPayPayload(target: string, amount?: number | null): string {
  const digits = (target || PROMPTPAY_PHONE).replace(/[^0-9]/g, '')
  
  let subtagId = '01'
  let billerVal = ''

  if (digits.length === 10 && digits.startsWith('0')) {
    // 1. Thai Mobile Phone (0812345678 -> 0066812345678) -> Tag 01
    subtagId = '01'
    billerVal = '0066' + digits.substring(1)
  } else if (digits.length === 13) {
    // 2. Thai Citizen ID / Tax ID (13 digits) -> Tag 02
    subtagId = '02'
    billerVal = digits
  } else if (digits.length === 15) {
    // 3. E-Wallet ID (15 digits) -> Tag 03
    subtagId = '03'
    billerVal = digits
  } else {
    // Fallback: Mobile Phone format
    subtagId = '01'
    billerVal = '0066' + digits.replace(/^0+/, '')
  }

  // Tag 29: Merchant Account Information - PromptPay
  // Tag 00: AID = A000000677010111 (PromptPay)
  // Tag 01: Mobile (0066...), Tag 02: National ID, Tag 03: E-Wallet
  const aid = formatField('00', 'A000000677010111')
  const biller = formatField(subtagId, billerVal)
  const tag29 = formatField('29', aid + biller)

  // Tag 00: Payload Format Indicator (01)
  // Tag 01: Point of Initiation Method (11 = Static, 12 = Dynamic with Amount)
  const isDynamic = amount !== undefined && amount !== null && amount > 0
  const tag00 = formatField('00', '01')
  const tag01 = formatField('01', isDynamic ? '12' : '11')

  // Tag 53: Transaction Currency (764 = THB)
  const tag53 = formatField('53', '764')

  // Tag 54: Transaction Amount
  let tag54 = ''
  if (isDynamic) {
    tag54 = formatField('54', Number(amount).toFixed(2))
  }

  // Tag 58: Country Code (TH)
  const tag58 = formatField('58', 'TH')

  const rawPayload = tag00 + tag01 + tag29 + tag53 + tag54 + tag58 + '6304'
  const checksum = crc16(rawPayload)

  return rawPayload + checksum
}

/**
 * Returns QR Code Image URL for PromptPay
 */
export function getPromptPayQRImageUrl(target: string, amount?: number | null, size: number = 260): string {
  const payload = generatePromptPayPayload(target || PROMPTPAY_PHONE, amount)
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=10&data=${encodeURIComponent(payload)}`
}
