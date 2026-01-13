import { useState } from 'react';
import CommunityCard from "@/features/community/components/CommunityCard";
import LocationSelector from "@/features/location/components/LocationSelector";
import CategorySelector from "@/shared/ui/CategorySelector";
import { Loading, ErrorMessage, EmptyState } from "@/shared/ui/StatusMessage";
import { useCommunity, COMMUNITY_CATEGORIES, LOCATIONS } from "@/features/community/hooks/useCommunity";

function CommunityList() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const { posts, loading, error } = useCommunity(selectedCategory, selectedLocation);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  const locationLabel = LOCATIONS.find(loc => loc.value === selectedLocation)?.label;

  return (
    <div className="max-w-[1024px] mx-auto py-10 px-5">
      <h1 className="text-2xl font-bold mb-5">동네생활</h1>
      
      <LocationSelector 
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
      />
      
      <CategorySelector 
        categories={COMMUNITY_CATEGORIES}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />
      
      {selectedLocation !== 'all' && (
        <div className="mb-4 p-3 bg-[#fff4e6] rounded-lg text-sm text-primary font-bold">
          {locationLabel} 게시글 {posts.length}개
        </div>
      )}
      
      <div className="grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-y-8 gap-x-6 mt-6">
        {posts.map((post) => (
          <CommunityCard key={post.id} post={post} />
        ))}
      </div>
      
      {posts.length === 0 && (
        <EmptyState 
          message={selectedLocation !== 'all' 
            ? `${locationLabel}에 등록된 게시글이 없습니다.`
            : '등록된 게시글이 없습니다.'
          }
        />
      )}
    </div>
  );
}

export default CommunityList;
