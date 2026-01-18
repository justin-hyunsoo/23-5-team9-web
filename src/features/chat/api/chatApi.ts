import client from '@/shared/api/client';

export interface ChatRoom {
  room_id: string;
  opponent_id: string;
  // opponent_nickname: string | null;      // 서버 데이터 문제로 미사용
  // opponent_profile_image: string | null; // 서버 데이터 문제로 미사용
  last_message: string | null;
  last_message_at: string | null;
  unread_count: number;
}

export interface Message {
  id: number;
  room_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

export interface CreateRoomResponse {
  id: string;
  user_one_id: string;
  user_two_id: string;
  created_at: string;
}

// 채팅방 생성 또는 기존 채팅방 조회
export async function createOrGetRoom(opponent_id: string): Promise<string> {
  const response = await client.post<CreateRoomResponse>(
    `/api/chat/rooms?opponent_id=${opponent_id}`
  );
  return response.data.id;
}

// 채팅방 목록 조회
export async function fetchChatRooms(): Promise<ChatRoom[]> {
  const response = await client.get<ChatRoom[]>('/api/chat/rooms');
  return response.data;
}

// 메시지 목록 조회
export async function fetchMessages(room_id: string): Promise<Message[]> {
  const response = await client.get<Message[]>(
    `/api/chat/rooms/${room_id}/messages`
  );
  return response.data;
}

// 메시지 전송
export async function sendMessage(room_id: string, content: string): Promise<Message> {
  const response = await client.post<Message>(
    `/api/chat/rooms/${room_id}/messages`,
    { content }
  );
  return response.data;
}

// 메시지 읽음 처리
export async function markMessagesAsRead(room_id: string): Promise<void> {
  await client.patch(`/api/chat/rooms/${room_id}/messages/read`);
}
