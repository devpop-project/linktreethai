import { NextRequest, NextResponse } from 'next/server'

// Generates 13 modular Custom Salepage sections based on product details and AI analysis
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      productName,
      category,
      keyFeatures,
      price,
      originalPrice,
      productImage,
      customThemeColor,
      customBgColor,
      customTextColor,
      customCardStyle,
      customBgImage,
      customHeadline,
      customSubheadline,
      customPainPoints,
      customBenefits,
      customFaqs,
      customReviews,
      customChatReviews,
      customStory,
      customGuarantee,
      customTiers,
      customTrustBadges,
      analysis,
      userApiKey
    } = body

    const title = productName || analysis?.productName || 'ผลิตภัณฑ์พรีเมียม'
    const offerPrice = price ? parseFloat(price) : (analysis?.price ? parseFloat(analysis.price) : 490)
    const origPrice = originalPrice ? parseFloat(originalPrice) : (analysis?.originalPrice ? parseFloat(analysis.originalPrice) : Math.round(offerPrice * 2))
    const themeColor = customThemeColor || analysis?.themeColor || '#8B5CF6'
    const bgColor = customBgColor || analysis?.bgColor || '#0B0F17'
    const textColor = customTextColor || analysis?.textColor || '#FFFFFF'
    const cardStyle = customCardStyle || analysis?.cardStyle || 'glass'
    const bgImage = customBgImage || analysis?.bgImage || ''
    const heroImg = productImage || analysis?.productImage || analysis?.hero_image_url || analysis?.heroImg || ''

    // Split features into array
    const rawFeatures = keyFeatures || analysis?.keyFeatures || ''
    const featureList = rawFeatures
      ? rawFeatures.split(/[,\n•-]/).map((s: string) => s.trim()).filter((s: string) => s.length > 0)
      : ['คุณภาพเกรดพรีเมียม 100%', 'คัดสรรวัตถุดิบและส่วนประกอบชั้นเลิศ', 'เห็นผลลัพธ์ชัดเจน ปลอดภัย', 'ส่งฟรีด่วนทั่วไทย พร้อมบริการเก็บเงินปลายทาง']

    // Tiers calculation
    const tiers = (customTiers && customTiers.length > 0)
      ? customTiers
      : (analysis?.tiers && analysis.tiers.length > 0
          ? analysis.tiers
          : [
              { name: 'ชุดทดลอง 1 ชุด (คัดพิเศษ)', price: offerPrice, original: origPrice, note: 'เหมาะสำหรับเริ่มต้นทดลองทาน/ใช้งาน', isPopular: false },
              { name: 'ชุดสุดคุ้ม 2 ชุด (แถมฟรี 1 ชุด)', price: Math.round(offerPrice * 1.8), original: origPrice * 2, note: '🔥 ยอดนิยม ขายดีอันดับ 1', isPopular: true },
              { name: 'ชุดครอบครัว 4 ชุด (แถมฟรี 2 ชุด + ส่งฟรี)', price: Math.round(offerPrice * 3.2), original: origPrice * 4, note: '👑 คุ้มค่าที่สุด ประหยัดจุใจ', isPopular: false }
            ])

    const painPoints = (customPainPoints && customPainPoints.length > 0)
      ? customPainPoints
      : (analysis?.painPoints && analysis.painPoints.length > 0
          ? analysis.painPoints
          : [
              'เจอปัญหาเดิมๆ ซ้ำซาก เสียเงินลองมาหลายอย่างแต่ไม่ได้ผลลัพธ์ที่ต้องการ',
              'กังวลเรื่องความปลอดภัย สารเคมีตกค้าง และสินค้าที่ไม่ได้มาตรฐาน',
              'ขาดความมั่นใจ ต้องการทางออกที่ปลอดภัยและเห็นผลลัพธ์จริง'
            ])

    const benefits = (customBenefits && customBenefits.length > 0)
      ? customBenefits
      : (analysis?.benefits && analysis.benefits.length > 0
          ? analysis.benefits
          : [
              'สัมผัสความเปลี่ยนแปลงและผลลัพธ์ที่ยอดเยี่ยมได้อย่างชัดเจน',
              'คัดสรรสารสกัดธรรมชาติเกรดพรีเมียม 100% ปลอดภัย มีมาตรฐาน',
              'รับประกันความพึงพอใจ มั่นใจได้ในคุณภาพทุกชิ้น'
            ])

    const faqs = (customFaqs && customFaqs.length > 0)
      ? customFaqs
      : (analysis?.faqs && analysis.faqs.length > 0
          ? analysis.faqs
          : [
              { q: 'วิธีรับประทาน หรือวิธีใช้งานที่ถูกต้องเป็นอย่างไร?', a: 'คำแนะนำการใช้งานอย่างละเอียดเพื่อให้ได้ผลลัพธ์สูงสุดตามคำแนะนำบนบรรจุภัณฑ์ค่ะ' },
              { q: 'สินค้าเป็นของแท้และปลอดภัยหรือไม่?', a: 'สินค้าของแท้ 100% คัดสรรเกรดพรีเมียม ผ่านการตรวจสอบมาตรฐานความปลอดภัย มั่นใจได้แน่นอนค่ะ' },
              { q: 'มีบริการจัดส่งด่วน และเก็บเงินปลายทาง (COD) ไหม?', a: 'มีบริการจัดส่งด่วน Flash/Kerry ถึงหน้าบ้านภายใน 1-2 วันทำการ และมีบริการเก็บเงินปลายทางค่ะ' },
              { q: 'สั่งซื้อโปรโมชั่นวันนี้มีของแถมหรือส่วนลดอย่างไร?', a: 'สามารถเลือกแพ็กเกจชุดสุดคุ้มด้านล่างเพื่อรับส่วนลดและของแถมพิเศษได้ทันทีค่ะ' }
            ])

    const reviews = (customReviews && customReviews.length > 0)
      ? customReviews
      : (analysis?.reviews && analysis.reviews.length > 0
          ? analysis.reviews
          : [
              { name: 'คุณกิตติศักดิ์ (กรุงเทพฯ)', comment: `สั่ง ${title} มาทาน/ใช้งานแล้วประทับใจมากครับ คุณภาพดีเยี่ยม ตรงตามที่โฆษณาไว้ทุกประการ สั่งซ้ำแน่นอนครับ`, stars: 5, date: 'เมื่อวานนี้' },
              { name: 'คุณศิริพร (เชียงใหม่)', comment: 'ได้รับสินค้าเรียบร้อย แพ็กมาอย่างดี ผลลัพธ์ประทับใจมาก คุ้มค่าคุ้มราคามากค่ะ', stars: 5, date: '3 วันที่แล้ว' },
              { name: 'คุณณภัทร (ภูเก็ต)', comment: 'จัดส่งรวดเร็วทันใจ คุณภาพเกรดพรีเมียมแท้ 100% แนะนำต่อให้เพื่อนๆ แล้วครับ', stars: 5, date: 'สัปดาห์ที่แล้ว' }
            ])

    const chatReviews = (customChatReviews && customChatReviews.length > 0)
      ? customChatReviews
      : (analysis?.chatReviews && analysis.chatReviews.length > 0
          ? analysis.chatReviews
          : [
              { sender: 'ลูกค้า', text: `ได้รับ ${title} แล้วนะคะ แพ็กมาเรียบร้อยมากค่ะ ลองทาน/ใช้แล้วชอบมากๆ เลยค่ะ` },
              { sender: 'ร้านค้า', text: 'ขอบคุณมากค่า แนะนำทาน/ใช้งานอย่างต่อเนื่องเพื่อผลลัพธ์ที่ดีที่สุดนะคะ ❤️' },
              { sender: 'ลูกค้า', text: 'ประทับใจมากค่ะ รอบนี้ขอสั่งชุด 2 ซอง/ชิ้นแถม 1 เพิ่มให้เพื่อนด้วยนะคะ' }
            ])

    const brandStory = customStory || analysis?.brandStory || `เรื่องราวของ ${title} เริ่มต้นจากความตั้งใจที่จะส่งมอบสิ่งที่ดีที่สุด คัดสรรวัตถุดิบและส่วนประกอบเกรดพรีเมียมจากแหล่งธรรมชาติ เพื่อมอบคุณภาพและผลลัพธ์ที่เหนือกว่าให้แก่คุณ`
    const founderName = analysis?.founderName || 'ผู้ก่อตั้งและทีมงาน'
    const guaranteeText = customGuarantee || analysis?.guaranteeText || `รับประกันความพึงพอใจ ${title} ของแท้ 100% คัดสรรเกรดพรีเมียม ส่งตรงถึงมือคุณอย่างปลอดภัย`
    const trustBadges = customTrustBadges || analysis?.trustBadges || ['ส่งฟรีด่วนทั่วไทย', 'ของแท้ 100%', 'บริการเก็บเงินปลายทาง COD']

    const headline = customHeadline || analysis?.headline || `${title} นวัตกรรมเกรดพรีเมียมเพื่อผลลัพธ์ที่ดีที่สุด`
    const subheadline = customSubheadline || analysis?.subheadline || 'คัดสรรสารสกัดบริสุทธิ์เพื่อความคุ้มค่าและผลลัพธ์ที่คุณสัมผัสได้จริง'

    // Construct 13 Modular Sections with the actual tailored AI content
    const sections = [
      {
        id: 'sec-nav-' + Date.now(),
        type: 'navbar',
        title: 'แถบแบรนด์ด้านบน (Navbar)',
        visible: true,
        layoutStyle: 'sticky_glassmorphic_dock',
        data: {
          brand_name: title,
          logo_url: heroImg,
          cta_text: 'สั่งซื้อโปรโมชั่นด่วน',
          cta_url: '#checkout',
          phone_number: '0909964514',
          line_url: 'https://line.me/ti/p/@amth',
          ticker_text: `🔥 โปรโมชั่นพิเศษ ${title} ลดกระหน่ำวันนี้เท่านั้น | ส่งฟรีทั่วไทย`
        }
      },
      {
        id: 'sec-count-' + Date.now(),
        type: 'countdown',
        title: 'แถบนับถอยหลังโปรโมชั่น (Flash Countdown)',
        visible: true,
        layoutStyle: 'floating_voucher_pill',
        data: {
          headline: `⚡ Flash Sale โปรโมชั่นจำกัดเวลาสำหรับ ${title}`,
          minutes: 15,
          stock_left: 9,
          voucher_code: 'SPECIAL50'
        }
      },
      {
        id: 'sec-hero-' + Date.now(),
        type: 'hero',
        title: 'ส่วนพาดหัวและรูปสินค้าหลัก (Hero Banner)',
        visible: true,
        layoutStyle: 'scroll_float_animated',
        data: {
          headline: headline,
          subheadline: subheadline,
          hero_image_url: heroImg,
          image_url: heroImg,
          video_url: '',
          badge: trustBadges[0] || 'เกรดพรีเมียม คัดพิเศษ',
          trust_badge_1: trustBadges[0] || 'ส่งฟรีด่วนทั่วไทย',
          trust_badge_2: trustBadges[1] || 'ของแท้ 100%',
          trust_badge_3: trustBadges[2] || 'เก็บเงินปลายทางได้',
          cta_text: 'สั่งซื้อโปรโมชั่นนี้ทันที',
          cta_url: '#checkout'
        }
      },
      {
        id: 'sec-price-' + Date.now(),
        type: 'pricing',
        title: 'กล่องราคาและตารางแพ็กเกจ (Offer & Pricing)',
        visible: true,
        layoutStyle: '3_tier_comparison_cards',
        data: {
          offer_price: offerPrice.toString(),
          original_price: origPrice.toString(),
          badge_text: `Special Offer โปรโมชั่นสุดคุ้ม ${title}`,
          features: featureList,
          tiers: tiers
        }
      },
      {
        id: 'sec-gallery-' + Date.now(),
        type: 'gallery',
        title: 'แกลเลอรีรูปภาพสินค้า (Photo Gallery)',
        visible: true,
        layoutStyle: 'featured_hero_thumbnails',
        data: {
          headline: 'ภาพถ่ายสินค้าจริงและการคัดสรร',
          images: [
            heroImg,
            'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
            'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800',
            'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800'
          ],
          before_image: 'https://images.unsplash.com/photo-1512290900672-1f4a9844f2d7?w=800',
          after_image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800',
          before_text: 'ก่อนใช้ ❌',
          after_text: 'หลังใช้ 7 วัน ✅'
        }
      },
      {
        id: 'sec-pain-' + Date.now(),
        type: 'pain_points',
        title: 'ปัญหาของลูกค้า (Pain Points)',
        visible: true,
        layoutStyle: 'alert_warning_box',
        data: {
          headline: 'คุณกำลังเจอปัญหาเหล่านี้อยู่ใช่หรือไม่?',
          items: painPoints,
          points: painPoints
        }
      },
      {
        id: 'sec-benefit-' + Date.now(),
        type: 'benefits',
        title: 'จุดเด่นและผลลัพธ์ (Benefits & Timeline)',
        visible: true,
        layoutStyle: 'timeline_steps',
        data: {
          headline: `ทางออกและผลลัพธ์ที่คุณจะได้รับจาก ${title}:`,
          items: benefits,
          benefits: benefits,
          steps: [
            { day: 'ขั้นตอนที่ 1', desc: 'คัดสรรวัตถุดิบธรรมชาติเกรดพรีเมียม 100%' },
            { day: 'ขั้นตอนที่ 2', desc: 'ผ่านกระบวนการผลิตและควบคุมคุณภาพอย่างพิถีพิถัน' },
            { day: 'ขั้นตอนที่ 3', desc: 'จัดส่งด่วนพิเศษถึงหน้าบ้าน รวดเร็ว ปลอดภัย' }
          ]
        }
      },
      {
        id: 'sec-story-' + Date.now(),
        type: 'story',
        title: 'เรื่องราวของแบรนด์ (Brand Story)',
        visible: true,
        layoutStyle: 'quote_founder_card',
        data: {
          founder_quote: brandStory,
          founder_name: founderName,
          body: brandStory
        }
      },
      {
        id: 'sec-review-' + Date.now(),
        type: 'reviews',
        title: 'รีวิวจากลูกค้าจริง (Customer Reviews)',
        visible: true,
        layoutStyle: 'chat_bubble_screenshots',
        data: {
          rating: 4.9,
          review_count: '1,420+ รีวิวจากผู้ใช้งานจริง',
          testimonials: reviews,
          reviews: reviews,
          chat_reviews: chatReviews
        }
      },
      {
        id: 'sec-guar-' + Date.now(),
        type: 'guarantee',
        title: 'ตรารับประกันคุณภาพ (Guarantee Badge)',
        visible: true,
        layoutStyle: 'money_back_100',
        data: {
          guarantee_text: guaranteeText,
          text: guaranteeText,
          badges: trustBadges
        }
      },
      {
        id: 'sec-checkout-' + Date.now(),
        type: 'checkout',
        title: 'แบบฟอร์มชำระเงินและสั่งซื้อ (Checkout Form)',
        visible: true,
        layoutStyle: 'dynamic_promptpay_and_cod',
        data: {
          form_theme: 'neon_emerald',
          promptpay_number: '0909964514',
          promptpay_name: 'Enter The Amanita Thailand',
          enable_promptpay: true,
          enable_cod: true
        }
      },
      {
        id: 'sec-faq-' + Date.now(),
        type: 'faq',
        title: 'คำถามที่พบบ่อย (FAQ)',
        visible: true,
        layoutStyle: '2_column_faq_grid',
        data: {
          faqs: faqs
        }
      },
      {
        id: 'sec-sticky-' + Date.now(),
        type: 'sticky_cta',
        title: 'ปุ่ม Action ลอยติดขอบล่าง (Sticky Bottom)',
        visible: true,
        layoutStyle: 'floating_cta_duo',
        data: {
          order_text: 'สั่งซื้อโปรโมชั่นด่วน',
          line_text: 'แชทไลน์ สอบถาม',
          line_url: 'https://line.me/ti/p/@amth',
          call_text: 'โทรปรึกษาด่วน',
          call_phone: 'tel:0909964514',
          btn1_text: 'สั่งซื้อโปรโมชั่นด่วน',
          btn1_url: '#checkout',
          btn1_color: themeColor,
          btn1_text_color: '#FFFFFF',
          btn1_icon: 'bag',
          btn1_enabled: true,
          btn2_text: 'แชท LINE',
          btn2_url: 'https://line.me/ti/p/@amth',
          btn2_color: '#10B981',
          btn2_text_color: '#FFFFFF',
          btn2_icon: 'line',
          btn2_enabled: true,
          btn3_text: 'โทรด่วน',
          btn3_url: 'tel:0909964514',
          btn3_color: '#8B5CF6',
          btn3_text_color: '#FFFFFF',
          btn3_icon: 'phone',
          btn3_enabled: true,
          show_price: true
        }
      }
    ]

    return NextResponse.json({
      success: true,
      pageTitle: title,
      headline: headline,
      subheadline: subheadline,
      themeColor: themeColor,
      bgColor: bgColor,
      textColor: textColor,
      cardStyle: cardStyle,
      bgImage: bgImage,
      painPoints: painPoints,
      benefits: benefits,
      brandStory: brandStory,
      reviews: reviews,
      chatReviews: chatReviews,
      faqs: faqs,
      guaranteeText: guaranteeText,
      tiers: tiers,
      marketingHooks: analysis?.marketingHooks || {
        tiktok: `สคริปต์วิดีโอสั้นสำหรับ ${title}: เปิดด้วยปัญหา แล้วโชว์ผลลัพธ์ ปิดด้วยโปรโมชั่นพิเศษ`,
        facebook: `🔥 ปิดการขายด้วย ${title}: ${headline} - ${subheadline}`,
        line: `⚡ แจ้งโปรโมชั่นพิเศษ ${title} ซื้อ 2 แถม 1 ด่วนวันนี้!`
      },
      sections: sections
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'เกิดข้อผิดพลาดในการสร้างเซลเพจ' },
      { status: 500 }
    )
  }
}
