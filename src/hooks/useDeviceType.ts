import { useEffect, useState } from "react";

export type DeviceType = "mobile" | "tablet" | "desktop";

export const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState<DeviceType>("desktop");
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType("mobile");
        setIsMobile(true);
        setIsTablet(false);
        setIsDesktop(false);
      } else if (width >= 768 && width < 1024) {
        setDeviceType("tablet");
        setIsMobile(false);
        setIsTablet(true);
        setIsDesktop(false);
      } else {
        setDeviceType("desktop");
        setIsMobile(false);
        setIsTablet(false);
        setIsDesktop(true);
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    deviceType,
    isMobile,
    isTablet,
    isDesktop,
  };
}; 