import { PasswordInput, Button } from '@/shared/ui';

const PasswordTab = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('비밀번호가 변경되었습니다.');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-2">
      <PasswordInput label="현재 비밀번호" />
      <PasswordInput label="새 비밀번호" />
      <PasswordInput label="새 비밀번호 확인" />
      <Button type="submit" size="lg" fullWidth className="mt-4">
        비밀번호 변경
      </Button>
    </form>
  );
};
export default PasswordTab;