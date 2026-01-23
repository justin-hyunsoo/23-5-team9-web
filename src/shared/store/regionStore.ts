import { create } from 'zustand';

export const DEFAULT_REGION_ID = '5c8ea230-126b-486b-857d-7bb0acdb88b1';
export const DEFAULT_REGION_NAME = '관악구 대학동';

interface RegionState {
  regionId: string;
  regionName: string;
  setRegion: (id: string, name: string) => void;
  clearRegion: () => void;
}

const getInitialRegion = (): { id: string; name: string } => {
  if (typeof window === 'undefined') {
    return { id: DEFAULT_REGION_ID, name: DEFAULT_REGION_NAME };
  }
  const savedId = localStorage.getItem('selectedRegionId');
  const savedName = localStorage.getItem('selectedRegionName');
  // ID와 Name 둘 다 있어야 저장된 값 사용
  if (savedId && savedName) {
    return { id: savedId, name: savedName };
  }
  // 하나라도 없으면 기본값으로 초기화
  localStorage.setItem('selectedRegionId', DEFAULT_REGION_ID);
  localStorage.setItem('selectedRegionName', DEFAULT_REGION_NAME);
  return { id: DEFAULT_REGION_ID, name: DEFAULT_REGION_NAME };
};

const saveRegion = (id: string, name: string) => {
  localStorage.setItem('selectedRegionId', id);
  localStorage.setItem('selectedRegionName', name);
};

const clearSavedRegion = () => {
  localStorage.removeItem('selectedRegionId');
  localStorage.removeItem('selectedRegionName');
};

export const useRegionStore = create<RegionState>((set) => {
  const initial = getInitialRegion();

  return {
    regionId: initial.id,
    regionName: initial.name,
    setRegion: (id: string, name: string) => {
      saveRegion(id, name);
      set({ regionId: id, regionName: name });
    },
    clearRegion: () => {
      clearSavedRegion();
      set({ regionId: DEFAULT_REGION_ID, regionName: DEFAULT_REGION_NAME });
    },
  };
});
