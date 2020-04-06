import { useState } from 'react';
import { BookForm } from '../../interfaces/books';

const useForm = (props: any): [BookForm, Function] => {
  const [form, setForm] = useState(props);
  const setFormValues = (
    name: string,
    value: string,
  ): void => setForm({ ...form, [name]: value });
  return [form, setFormValues];
};

export default useForm;
