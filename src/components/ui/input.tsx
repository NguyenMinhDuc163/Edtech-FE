import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

type InputGroupProps = {
  label: string;
  name: string;
  type?: "text" | "password" | "email";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  wrapperClassName?: string; 
};

export default function InputGroup({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
  wrapperClassName = "",
}: InputGroupProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className={`relative w-full h-[90px] ${wrapperClassName}`}>
      {/* Label */}
      <label className="absolute top-0 font-['Poppins'] text-[16px] leading-[24px] text-black">
        {label}
      </label>

      {/* Input */}
      <div className="absolute top-[36px] w-[435px] h-[54px] relative">
        <input
          type={isPassword && showPassword ? "text" : type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full h-full bg-white border border-[#49BBBD] rounded-[40px]
                      placeholder:font-['Poppins'] placeholder:font-light placeholder:text-[15px]
                      placeholder:leading-[22px] placeholder:text-[#ACACAC] pl-[31px]} ${className}`}
        />

        {/* Eye icon nếu là password */}
        {isPassword && (
          <div
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </div>
        )}
      </div>
    </div>
  );
}
