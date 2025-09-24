import React, {FC} from 'react';
import Input from '../atoms/Input';

type FormGroupProps = {
  id?: string;
  label?: string;
  type: string;
  name: string;
  value?: string;
  maxLength?: number;
  minLength?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  labelClassName?: string;
  autoComplete?: string;
  required?: boolean;
};

const FormGroup: FC<FormGroupProps> = ({
                                         label,
                                         type,
                                         name,
                                         value,
                                         onChange,
                                         placeholder,
                                         className,
                                         autoComplete,
                                         labelClassName,
                                         id,
                                         maxLength,
                                         minLength,
                                         required,
                                       }) => {
  return (
    <>
      {
        label ? (
          <label
            htmlFor={name}
            className={labelClassName}
          >
            {label}
          </label>
        ) : null
      }
      <Input
        id={id}
        type={type}
        name={name}
        minLength={minLength}
        maxLength={maxLength}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={className}
        autoComplete={autoComplete}
        required={required}
      />
    </>
  );
};

export default FormGroup;
