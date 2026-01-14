import React, { useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useCommunityPost, Comment } from "@/features/community/hooks/useCommunity";
import { Loading } from "@/shared/ui/StatusMessage";
import { PageContainer } from "@/shared/layouts/PageContainer"; // Layout 추가
import { Button } from "@/shared/ui/Button"; // Button 추가
import { Input } from "@/shared/ui/Input";   // Input 추가

function CommunityDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { post, loading, error } = useCommunityPost(id);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (post) {
      setIsLiked(post.isLiked);
      setLikeCount(post.likeCount);
      setComments(post.comments);
    }
  }, [post]);

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 300));

    const comment: Comment = {
      id: Date.now(),
      author: '나',
      content: newComment,
      createdAt: new Date().toISOString(),
      likeCount: 0,
      isLiked: false
    };

    setComments([...comments, comment]);
    setNewComment('');
    setIsSubmitting(false);
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);
    // (시간 포맷 로직 생략 - 그대로 유지)
    if (diffInSeconds < 60) return '방금 전';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}일 전`;
    return postDate.toLocaleDateString('ko-KR');
  };

  if (loading) return <Loading />;
  if (error) return <div className="p-4 text-center text-status-error">{error}</div>;
  if (!post) return <div className="p-4 text-center">게시글 정보가 없습니다.</div>;

  return (
    <PageContainer>
      <div className="mb-4">
        <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="pl-0 hover:bg-transparent hover:text-primary"
        >
            ← 뒤로가기
        </Button>
      </div>

      <section className="bg-bg-page rounded-2xl p-6 shadow-sm border border-border-base">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-primary bg-primary/10 px-3 py-1 rounded font-bold">
            {post.category}
          </span>
        </div>

        {post.imageUrl && (
          <div className="mb-5 rounded-xl overflow-hidden">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full max-h-[400px] object-cover"
            />
          </div>
        )}

        <h2 className="text-2xl font-bold mb-3">{post.title}</h2>

        <div className="flex gap-2 mb-6 text-text-secondary text-sm items-center">
          <span>{post.author}</span>
          <span>·</span>
          <span>{post.location}</span>
          <span>·</span>
          <span>{formatTimeAgo(post.createdAt)}</span>
        </div>

        <hr className="my-6 border-border-base" />

        <div className="whitespace-pre-wrap leading-relaxed mb-8 text-text-body">
          {post.content}
        </div>

        <div className="flex gap-4 pt-4 border-t border-border-base">
          <Button
            variant={isLiked ? "primary" : "ghost"}
            size="sm"
            onClick={handleLikeClick}
            className={!isLiked ? "bg-bg-box" : ""}
          >
            <span className="mr-2">{isLiked ? '♥' : '♡'}</span>
            좋아요 {likeCount}
          </Button>
          
          <div className="flex items-center gap-2 text-text-secondary text-sm ml-auto">
            <span>💬 {comments.length}</span>
            <span>👁️ {post.viewCount}</span>
          </div>
        </div>
      </section>

      {/* 댓글 섹션 */}
      <section className="mt-8">
        <h3 className="mb-4 text-lg font-bold">댓글 {comments.length}</h3>

        <form onSubmit={handleCommentSubmit} className="mb-8 flex gap-2">
            <div className="flex-1">
                <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 입력하세요..."
                    className="bg-bg-page" 
                />
            </div>
            <Button 
                type="submit" 
                disabled={isSubmitting || !newComment.trim()}
                className="h-auto" // Input 높이에 맞춤
            >
                등록
            </Button>
        </form>

        <div className="flex flex-col gap-4">
            {comments.map((comment) => (
              <div key={comment.id} className="p-5 bg-bg-page rounded-xl border border-border-base">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-sm">{comment.author}</span>
                  <span className="text-text-secondary text-xs">{formatTimeAgo(comment.createdAt)}</span>
                </div>
                <div className="text-sm text-text-primary mb-3">{comment.content}</div>
                <Button variant="ghost" size="sm" className="h-8 px-2 text-text-secondary">
                    ♡ {comment.likeCount}
                </Button>
              </div>
            ))}
            {comments.length === 0 && (
                <div className="text-center py-10 text-text-secondary">
                    아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
                </div>
            )}
        </div>
      </section>
    </PageContainer>
  );
}

export default CommunityDetail;