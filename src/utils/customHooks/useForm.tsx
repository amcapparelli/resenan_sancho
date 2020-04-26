import { useState } from 'react';

const useForm = (props: any): [any, Function, Function] => {
  const [form, setForm] = useState(props);
  const setFormValues = (
    name: string,
    value: string,
  ): void => setForm({ ...form, [name]: value });
  const loadForm = (formFields: object) => {
    setForm(formFields);
  };
  return [form, setFormValues, loadForm];
};

export default useForm;
