import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import HALO from "vanta/dist/vanta.halo.min";

const VantaBackground = () => {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        HALO({
          el: vantaRef.current,
          THREE,
          backgroundColor: 0xffc0cb, // Light pink background
          baseColor: 0x1a59, // Dark teal base color
          haloColor: 0xFFF000, // Yellow halo
          amplitudeFactor: 1.5, // Enhancing halo wave effect
          size: 1.2, // Increased halo size
          speed: 0.6, // Slightly slower movement for smoother effect
        })
      );
    }

    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
        setVantaEffect(null);
      }
    };
  }, []);

  return (
    <div
      ref={vantaRef}
      className="vanta-background"
    />
  );
};

export default VantaBackground;
