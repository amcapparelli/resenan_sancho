import { useState } from 'react';

const useValidateBookForm = (props: any): [any, Function] => {
  const [errors, setErrors] = useState<object>(props);
  const validateBookForm = (
    fields: object,
    requiredFields: Array<string>,
    callback: Function,
  ): void => {
    const emptyValues: Array<string> = [undefined, null];
    const newErrors: object = Object.entries(fields).reduce(
      (result, [key, val]) => (
        requiredFields.includes(key)
          && (emptyValues.includes(val) || val.length === 0) ? { ...result, [key]: `${key} is required` } : result
      ),
      props,
    );
    if (
      Object.values(newErrors).every((error) => error.length === 0)
    ) callback();
    setErrors(newErrors);
  };
  return [errors, validateBookForm];
};

export default useValidateBookForm;
