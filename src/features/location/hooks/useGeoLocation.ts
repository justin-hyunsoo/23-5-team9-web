import { useState } from 'react';
import { regionApi } from '@/features/location/api/region';

interface Region {
  id: string;
  name: string;
}

export function useGeoLocation() {
  const [detecting, setDetecting] = useState(false);

  const detectRegion = async (): Promise<Region> => {
    if (!navigator.geolocation) {
      throw new Error("브라우저가 위치 정보를 지원하지 않습니다.");
    }

    setDetecting(true);
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await regionApi.detectRegion(latitude, longitude);
            resolve(res.data);
          } catch (error: any) {
            const msg = error.response?.data?.detail || "위치 감지 중 오류가 발생했습니다.";
            reject(new Error(msg));
          } finally {
            setDetecting(false);
          }
        },
        (error) => {
          setDetecting(false);
          reject(new Error("위치 정보를 가져올 수 없습니다. 설정에서 위치 권한을 허용해주세요."));
        }
      );
    });
  };

  return { detectRegion, detecting };
}
