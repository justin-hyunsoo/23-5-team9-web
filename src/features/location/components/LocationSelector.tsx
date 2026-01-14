import { LOCATION_FILTERS } from '@/shared/constants/data';
import CategorySelector from '@/shared/ui/CategorySelector';

interface LocationSelectorProps {
  selected: string;
  onChange: (location: string) => void;
}

function LocationSelector({ selected, onChange }: LocationSelectorProps) {
  return (
    <CategorySelector
      options={LOCATION_FILTERS}
      selected={selected}
      onSelect={onChange}
      title="지역 선택"
      className="mb-6"
    />
  );
}

export default LocationSelector;
