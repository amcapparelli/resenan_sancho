import { renderHook, act } from '@testing-library/react-hooks';
import { useRequiredFieldsValidation } from '../../src/utils/customHooks';

describe('useRequiredFieldsValidation Hook', () => {
  it('should return errors on empty fields if field is included in validations', () => {
    const { result } = renderHook(() => useRequiredFieldsValidation({
      fieldA: '',
      fieldB: '',
    }));
    const input = result.current[1];
    const fieldsToValidate = {
      fieldA: 'not empty',
      fieldB: '',
    };
    const fieldsRequested = ['fieldA', 'fieldB'];
    act(() => input(fieldsToValidate, fieldsRequested));
    const output = result.current[0];
    expect(output).toEqual(
      {
        fieldA: '',
        fieldB: 'fieldB is required',
      },
    );
  });

  it('should not call callback if some error', () => {
    const { result } = renderHook(() => useRequiredFieldsValidation({
      fieldA: '',
      fieldB: '',
    }));
    const input = result.current[1];
    const fieldsToValidate = {
      fieldA: 'not empty',
      fieldB: '',
    };
    const fieldsRequested = ['fieldA', 'fieldB'];
    const mockCallback = jest.fn();
    act(() => input(fieldsToValidate, fieldsRequested, mockCallback));
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should not return errors on empty fields if field is not included in validations and should call callback', () => {
    const { result } = renderHook(() => useRequiredFieldsValidation({
      fieldA: '',
      fieldB: '',
    }));
    const input = result.current[1];
    const fieldsToValidate = {
      fieldA: 'not empty',
      fieldB: '',
    };
    const fieldsRequested = ['fieldA'];
    const mockCallback = jest.fn();
    act(() => input(fieldsToValidate, fieldsRequested, mockCallback));
    const output = result.current[0];
    expect(output).toEqual(
      {
        fieldA: '',
        fieldB: '',
      },
    );
    expect(mockCallback).toHaveBeenCalled();
  });

  it('should not return errors when required fields have value', () => {
    const { result } = renderHook(() => useRequiredFieldsValidation({
      fieldA: '',
      fieldB: '',
    }));
    const input = result.current[1];
    const fieldsToValidate = {
      fieldA: 'not empty',
      fieldB: 'not empty',
    };
    const fieldsRequested = ['fieldA', 'fieldB'];
    const mockCallback = jest.fn();
    act(() => input(fieldsToValidate, fieldsRequested, mockCallback));
    const output = result.current[0];
    expect(output).toEqual(
      {
        fieldA: '',
        fieldB: '',
      },
    );
    expect(mockCallback).toHaveBeenCalled();
  });

  it('should return errors on null fields if field is included in validations', () => {
    const { result } = renderHook(() => useRequiredFieldsValidation({
      fieldA: '',
      fieldB: '',
    }));
    const input = result.current[1];
    const fieldsToValidate = {
      fieldA: 'not empty',
      fieldB: null,
    };
    const fieldsRequested = ['fieldA', 'fieldB'];
    act(() => input(fieldsToValidate, fieldsRequested));
    const output = result.current[0];
    expect(output).toEqual(
      {
        fieldA: '',
        fieldB: 'fieldB is required',
      },
    );
  });

  it('should return errors on undefined fields if field is included in validations', () => {
    const { result } = renderHook(() => useRequiredFieldsValidation({
      fieldA: '',
      fieldB: '',
    }));
    const input = result.current[1];
    const fieldsToValidate = {
      fieldA: 'not empty',
      fieldB: undefined,
    };
    const fieldsRequested = ['fieldA', 'fieldB'];
    act(() => input(fieldsToValidate, fieldsRequested));
    const output = result.current[0];
    expect(output).toEqual(
      {
        fieldA: '',
        fieldB: 'fieldB is required',
      },
    );
  });

  it('should return errors on empty arrays if field is included in validations', () => {
    const { result } = renderHook(() => useRequiredFieldsValidation({
      fieldA: '',
      fieldB: '',
    }));
    const input = result.current[1];
    const fieldsToValidate = {
      fieldA: 'not empty',
      fieldB: [],
    };
    const fieldsRequested = ['fieldA', 'fieldB'];
    act(() => input(fieldsToValidate, fieldsRequested));
    const output = result.current[0];
    expect(output).toEqual(
      {
        fieldA: '',
        fieldB: 'fieldB is required',
      },
    );
  });
});
