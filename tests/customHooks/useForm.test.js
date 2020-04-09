import { renderHook, act } from '@testing-library/react-hooks';
import { useForm } from '../../src/utils/customHooks';

describe('useForm Hook', () => {
  it('should return the same key/value passed', () => {
    const { result } = renderHook(() => useForm({
      testName: '',
    }));
    const input = result.current[1];
    act(() => input('testName', 'testValue'));
    const output = result.current[0];
    expect(output).toEqual(
      { testName: 'testValue' },
    );
  });

  it('should add the new key/value if not exists', () => {
    const { result } = renderHook(() => useForm({
      testName: 'something',
    }));
    const input = result.current[1];
    act(() => input('testName2', 'testValue2'));
    const output = result.current[0];
    expect(output).toEqual(
      {
        testName: 'something',
        testName2: 'testValue2',
      },
    );
  });
});
