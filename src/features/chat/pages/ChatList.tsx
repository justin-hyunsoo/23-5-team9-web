import ChatRoomItem from '@/features/chat/components/ChatRoomItem';
import { PageContainer } from '@/shared/layouts/PageContainer';
import { Loading, ErrorMessage, EmptyState, LoginRequired, OnboardingRequired } from '@/shared/ui';
import { useChatRooms, ChatRoom } from '@/features/chat/hooks/useChat';
import { useUser } from '@/features/user/hooks/useUser';

function ChatList() {
  const { isLoggedIn, isLoading: userLoading, needsOnboarding } = useUser();

  const canFetch = isLoggedIn && !needsOnboarding;
  const { rooms, isLoading: loading, error } = useChatRooms({
    refetchInterval: canFetch ? 30000 : false,
    enabled: canFetch,
  });

  if (userLoading) return <Loading />;

  if (!isLoggedIn) {
    return (
      <PageContainer title="채팅">
        <LoginRequired message="로그인하고 채팅을 시작하세요" />
      </PageContainer>
    );
  }

  if (needsOnboarding) {
    return (
      <PageContainer title="채팅">
        <OnboardingRequired />
      </PageContainer>
    );
  }

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message="채팅방 목록을 불러올 수 없습니다." />;
  if (rooms.length === 0) return (
    <PageContainer title="채팅">
      <EmptyState message="채팅 내역이 없습니다." />
    </PageContainer>
  );

  return (
    <PageContainer title="채팅">
      <div className="flex flex-col">
        {rooms.map((room : ChatRoom) => (
          <ChatRoomItem
            key={room.room_id}
            room={room}
          />
        ))}
      </div>
    </PageContainer>
  );
}

export default ChatList;
