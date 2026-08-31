import React from 'react';
import BackgroundStudio from '../../components/BackgroundStudio';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dual Background Studio | LinkTreeThai v146 Pro',
  description: 'ระบบจัดการพื้นหลังและพรีวิวหน้าเว็บคู่ขนานแบบเรียลไทม์',
};

export default function StudioPage() {
  return <BackgroundStudio />;
}
