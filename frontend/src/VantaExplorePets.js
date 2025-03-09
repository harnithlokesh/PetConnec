import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import FOG from "vanta/dist/vanta.fog.min";

const VantaExplorePets = () => {
  const vantaRef = useRef(null);

  useEffect(() => {
    let vantaEffect = FOG({
      el: vantaRef.current,
      THREE: THREE,
      highlightColor: 0xf8e8f5, // Soft pastel pink fog glow
      midtoneColor: 0xf3d8c7, // Light brown-pink mist
      lowlightColor: 0xe8c39e, // Warm beige-brown shadow
      baseColor: 0xfcefe3, // Soft peach-pink background
      blurFactor: 0.7, // Smooth transition for a dreamy look
      speed: 7.5, // Increased speed for more movement
      zoom: 1.2, // Slight zoom-in effect for a more dynamic feel
    });

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []);

  return <div ref={vantaRef} className="vanta-background"></div>;
};

export default VantaExplorePets;
