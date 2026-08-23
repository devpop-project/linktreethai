import { GET as baseGET, POST as basePOST } from '../route'

export const dynamic = 'force-dynamic'

export async function GET() {
  return baseGET()
}

export async function POST(request: Request) {
  return basePOST(request)
}
