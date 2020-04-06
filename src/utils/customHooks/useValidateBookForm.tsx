import { useState } from 'react';
import { BookForm, BookFormErrors } from '../../interfaces/books';

const initErrors: BookFormErrors = {
  title: '',
  cover: '',
  formats: '',
  datePublished: '',
  author: '',
  synopsis: '',
  editorial: '',
};

const useValidateBookForm = (): [BookFormErrors, Function] => {
  const [errors, setErrors] = useState<BookFormErrors>(initErrors);
  const validateBookForm = (fields: BookForm, callback: Function): void => {
    const requiredFields = ['title', 'synopsis'];
    const emptyValues = [undefined, null, ''];
    const newErrors = Object.entries(fields).reduce(
      (result, [key, val]) => (
        requiredFields.includes(key)
          && emptyValues.includes(val) ? { ...result, [key]: 'field is required' } : result
      ),
      initErrors,
    );
    if (
      Object.values(newErrors).every((error) => error.length === 0)
    ) callback();
    setErrors(newErrors);
  };
  return [errors, validateBookForm];
};

export default useValidateBookForm;
