import classes from 'classnames';
import { FunctionComponent } from 'react';

type InputProps = {
  id: string;
  type: string;
  value: string;
  error: string | undefined;
  label?: string;
  placeholder?: string;
  wrapperClass?: string;
  errorLabelClass?: string;
  errorInputClass?: string;
  inputClass?: string;
  labelClass?: string;
  onInputChange: (str: string) => void;
};

const Input: FunctionComponent<InputProps> = ({
  wrapperClass,
  type,
  placeholder,
  value,
  error,
  errorLabelClass,
  errorInputClass,
  inputClass,
  label,
  labelClass,
  onInputChange,
  id,
}) => {
  const isError = !!error;
  return (
    <div className={wrapperClass}>
      {label && (
        <label htmlFor={id} className={labelClass}>
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={classes('transition duration-200 outline-none', inputClass, {
          [`${errorInputClass}`]: isError,
        })}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onInputChange(e.target.value)}
      />
      {isError && <small className={errorLabelClass}>{error}</small>}
    </div>
  );
};

Input.defaultProps = {
  wrapperClass: 'mb-2',
  errorInputClass: 'border-red-600',
  errorLabelClass: 'font-medium text-red-600',
  inputClass:
    'w-full p-3 border border-gray-300 rounded bg-gray-50 focus:bg-white hover:bg-white',
  labelClass: 'text-xs cursor-pointer',
};

export default Input;
