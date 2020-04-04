import { useState } from 'react';

interface Form {
  cover?: string
  formats?: Array<string>
  datePublished: string
}

const useForm = (props: any): [Form, Function] => {
  const [form, setForm] = useState(props);
  const setFormValues = (
    name: string,
    value: string,
  ): void => setForm({ ...form, [name]: value });
  return [form, setFormValues];
};

export default useForm;
