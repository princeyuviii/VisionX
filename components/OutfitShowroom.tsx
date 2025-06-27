'use client';
import { useEffect, useRef } from 'react';
import Spline from '@splinetool/react-spline';

export default function OutfitShowroom() {
  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden my-16">
      <Spline scene="https://prod.spline.design/4y-EH84X8nOW3fbo/scene.splinecode" />
    </div>
  );
}
