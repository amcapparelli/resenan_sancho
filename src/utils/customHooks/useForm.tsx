import { useState } from 'react';

const useForm = (props: any): [Object, Function] => {
  const [form, setForm] = useState(props);
  const setFormValues = (
    name: string,
    value: string,
  ): void => setForm({ ...form, [name]: value });
  return [form, setFormValues];
};

export default useForm;
