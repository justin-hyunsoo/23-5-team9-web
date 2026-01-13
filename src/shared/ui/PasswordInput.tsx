import { useState } from 'react';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  wrapperClassName?: string;
}

const PasswordInput = ({ label, wrapperClassName = "", className = "w-full border border-gray-300 rounded-md p-3 outline-none focus:border-primary transition-colors pr-[50px]", ...props }: PasswordInputProps) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      {label && <label className="block font-bold mb-2">{label}</label>}
      <div className={`relative ${wrapperClassName}`}>
        <input className={className} type={show ? "text" : "password"} {...props} />
        <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-gray-light text-[13px] font-bold">
          {show ? '숨기기' : '보기'}
        </button>
      </div>
    </div>
  );
};
export default PasswordInput;
