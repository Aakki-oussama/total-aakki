import { type LucideIcon, Eye, EyeOff } from 'lucide-react';

interface InputProps {
  id: string;
  type?: 'text' | 'email' | 'password';
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  icon?: LucideIcon;
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  error?: string;
  ariaLabel?: string;
  autoComplete?: string;
  name?: string;
}

const Input = ({
  id,
  type = 'text',
  label,
  value,
  onChange,
  placeholder,
  required = false,
  icon: Icon,
  showPasswordToggle = false,
  showPassword = false,
  onTogglePassword,
  error,
  ariaLabel,
  autoComplete,
  name,
}: InputProps) => {
  const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type;

  return (
    <div>
      <label className="block text-sm font-semibold text-main mb-2" htmlFor={id}>
        {label}
        {required && <span className="text-danger ml-1">*</span>}
      </label>
      <div className="relative group">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted group-focus-within:text-primary transition-colors">
            <Icon size={18} strokeWidth={2.5} />
          </div>
        )}
        <input
          id={id}
          name={name || id}
          type={inputType}
          required={required}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className={`block w-full ${Icon ? 'pl-11' : 'pl-4'} ${showPasswordToggle ? 'pr-12' : 'pr-4'} py-3 bg-surface border-2 ${error ? 'border-danger focus:ring-danger' : 'border-border focus:ring-primary'} rounded-xl text-main placeholder-muted/50 focus:ring-2 focus:ring-offset-0 transition-all outline-none`}
          placeholder={placeholder}
          aria-label={ariaLabel || label}
        />
        {showPasswordToggle && onTogglePassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted hover:text-main transition-colors"
            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            {showPassword ? (
              <EyeOff size={18} strokeWidth={2.5} />
            ) : (
              <Eye size={18} strokeWidth={2.5} />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-danger font-bold uppercase tracking-wider animate-in fade-in slide-in-from-top-1 duration-200">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;

