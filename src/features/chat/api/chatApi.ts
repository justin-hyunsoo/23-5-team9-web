import client from '@/shared/api/client';

// API 응답 타입
export interface ChatRoomApiResponse {
  room_id: string;
  opponent_id: string;
  opponent_nickname: string | null;
  opponent_profile_image: string | null;
  last_message: string | null;
  last_message_at: string | null;
  unread_count: number;
}

export interface MessageApiResponse {
  id: number;
  room_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

export interface CreateRoomApiResponse {
  id: string;
  user_one_id: string;
  user_two_id: string;
  created_at: string;
}

// 프론트엔드용 타입
export interface ChatRoom {
  roomId: string;
  opponentId: string;
  opponentNickname: string | null;
  opponentProfileImage: string | null;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
}

export interface Message {
  id: number;
  roomId: string;
  senderId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

// 변환 함수
function transformChatRoom(apiRoom: ChatRoomApiResponse): ChatRoom {
  return {
    roomId: apiRoom.room_id,
    opponentId: apiRoom.opponent_id,
    opponentNickname: apiRoom.opponent_nickname,
    opponentProfileImage: apiRoom.opponent_profile_image,
    lastMessage: apiRoom.last_message,
    lastMessageAt: apiRoom.last_message_at,
    unreadCount: apiRoom.unread_count,
  };
}

function transformMessage(apiMsg: MessageApiResponse): Message {
  return {
    id: apiMsg.id,
    roomId: apiMsg.room_id,
    senderId: apiMsg.sender_id,
    content: apiMsg.content,
    createdAt: apiMsg.created_at,
    isRead: apiMsg.is_read,
  };
}

// 채팅방 생성 또는 기존 채팅방 조회
export async function createOrGetRoom(opponentId: string): Promise<string> {
  const response = await client.post<CreateRoomApiResponse>(
    `/api/chat/rooms?opponent_id=${opponentId}`
  );
  return response.data.id;
}

// 채팅방 목록 조회
export async function fetchChatRooms(): Promise<ChatRoom[]> {
  const response = await client.get<ChatRoomApiResponse[]>('/api/chat/rooms');
  return response.data.map(transformChatRoom);
}

// 메시지 목록 조회
export async function fetchMessages(roomId: string): Promise<Message[]> {
  const response = await client.get<MessageApiResponse[]>(
    `/api/chat/rooms/${roomId}/messages`
  );
  return response.data.map(transformMessage);
}

// 메시지 전송
export async function sendMessage(roomId: string, content: string): Promise<Message> {
  const response = await client.post<MessageApiResponse>(
    `/api/chat/rooms/${roomId}/messages`,
    { content }
  );
  return transformMessage(response.data);
}

// 메시지 읽음 처리
export async function markMessagesAsRead(roomId: string): Promise<void> {
  await client.patch(`/api/chat/rooms/${roomId}/messages/read`);
}
