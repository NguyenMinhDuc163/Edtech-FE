import React from 'react'
import { COLORS } from '../../utils/ui/colors'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
}

export function Button({ loading, children, disabled, className = '', ...rest }: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      style={{
        backgroundColor: COLORS.primary,
        width: '232px',
        height: '49px',
        borderRadius: '9999px',
        border: 'none',
      }}
      className={`text-white font-medium flex items-center justify-center 
        disabled:opacity-60 hover:opacity-90 transition ${className}`}
      {...rest}
    >
      {loading ? (
        <svg
          className="animate-spin h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      ) : (
        children
      )}
    </button>
  )
}
