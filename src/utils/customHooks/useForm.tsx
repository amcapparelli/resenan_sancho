import { useState } from 'react';

const useForm = (props: any): [any, Function, Function] => {
  const [form, setForm] = useState(props);
  // Functional update on purpose: spreading the `form` of the current render
  // would make two updates in the same cycle (e.g. two mount effects) both
  // spread the same stale snapshot, so the second one would revert the first.
  const setFormValues = (
    name: string,
    value: string,
  ): void => setForm((prev: any) => ({ ...prev, [name]: value }));
  // Plain `set`, not functional, and deliberately asymmetric with the setter
  // above: this is a full replacement used to load or reset a form, so when it
  // runs last in a cycle it must win outright. Merging into the previous state
  // would stop resets from clearing fields.
  const loadForm = (formFields: object) => {
    setForm(formFields);
  };
  return [form, setFormValues, loadForm];
};

export default useForm;
