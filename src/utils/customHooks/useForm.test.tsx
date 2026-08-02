/**
 * Regression tests for useForm.
 *
 * Bug fixed: `setFormValues` spread the `form` captured in its own render's
 * closure. Two updates landing in the same cycle (two mount effects, or two
 * calls before a repaint) both spread the SAME stale object, so the second one
 * silently reverted the first. It surfaced in ProfileSection: the avatar effect
 * wrote the raw initial state back over the normalised legacy country.
 *
 * Fix: the setter takes the functional form of `setState`, so every update
 * spreads the latest queued state instead of a snapshot.
 */
import React, { useEffect } from 'react';
import {
  act, render, renderHook, screen,
} from '@testing-library/react';

import useForm from './useForm';

// Two `setFormValues` routed through separate mount effects: same mechanics as
// calling the setter twice in a row, but proving it also holds when the calls
// come from effects that know nothing about each other.
function TwoFieldEffectsOnMount() {
  const [form, setFormValues] = useForm({ country: 'Spain', avatar: '' });

  useEffect(() => {
    setFormValues('country', 'ES');
  }, []);

  useEffect(() => {
    setFormValues('avatar', 'avatar.png');
  }, []);

  return <div>{`${form.country}|${form.avatar}`}</div>;
}

// The actual ProfileSection shape, and a distinct failure mode from the one
// above: the first effect REPLACES the form via `loadForm`, the second writes a
// single field. The stale spread used to throw the replacement away entirely.
function LoadThenSetEffectsOnMount() {
  const [form, setFormValues, loadForm] = useForm({ country: 'Spain', avatar: '' });

  useEffect(() => {
    loadForm({ country: 'NO-COUNTRY', avatar: '' });
  }, []);

  useEffect(() => {
    setFormValues('avatar', 'a.png');
  }, []);

  return <div>{`${form.country}|${form.avatar}`}</div>;
}

describe('useForm', () => {
  it('keeps both values when two fields are updated in the same render cycle', () => {
    const { result } = renderHook(() => useForm({ name: '', lastName: '' }));
    const [, setFormValues] = result.current;

    act(() => {
      setFormValues('name', 'Alonso');
      setFormValues('lastName', 'Quijano');
    });

    expect(result.current[0]).toEqual({ name: 'Alonso', lastName: 'Quijano' });
  });

  it('keeps both values when two mount effects update different fields', () => {
    render(<TwoFieldEffectsOnMount />);

    expect(screen.getByText('ES|avatar.png')).toBeInTheDocument();
  });

  it('keeps the loaded form when a mount effect writes a field after loadForm', () => {
    render(<LoadThenSetEffectsOnMount />);

    expect(screen.getByText('NO-COUNTRY|a.png')).toBeInTheDocument();
  });

  it('applies the last write when the same field is updated twice in the same render cycle', () => {
    // `toggleInArray` (SpacesSection) and `toggleFormat` (AddBookSection) lean
    // on last-write-wins for a single field within one cycle.
    const { result } = renderHook(() => useForm({ country: 'ES' }));

    act(() => {
      result.current[1]('country', 'MX');
      result.current[1]('country', 'AR');
    });

    expect(result.current[0]).toEqual({ country: 'AR' });
  });

  it('replaces the whole form when loadForm runs after setFormValues in the same cycle', () => {
    // `loadForm` is a plain `set`, not a merge, and must stay that way: it is
    // how AddBookSection resets the form (`{ ...initForm, ...state }`). Turning
    // it functional "for consistency" would silently start merging, so fields
    // written earlier in the cycle would survive a reset.
    const { result } = renderHook(() => useForm({ title: '', cover: '' }));

    act(() => {
      result.current[1]('cover', 'cover.png');
      result.current[2]({ title: 'Quijote' });
    });

    expect(result.current[0]).toEqual({ title: 'Quijote' });
  });

  it('applies sequential updates made in separate render cycles', () => {
    const { result } = renderHook(() => useForm({ name: '', lastName: '' }));

    act(() => {
      result.current[1]('name', 'Alonso');
    });
    act(() => {
      result.current[1]('lastName', 'Quijano');
    });

    expect(result.current[0]).toEqual({ name: 'Alonso', lastName: 'Quijano' });
  });

  it('overwrites a field that already has a value', () => {
    const { result } = renderHook(() => useForm({ country: 'Spain' }));

    act(() => {
      result.current[1]('country', 'ES');
    });

    expect(result.current[0]).toEqual({ country: 'ES' });
  });

  it('replaces the whole form when loadForm is called', () => {
    const { result } = renderHook(() => useForm({ name: 'Alonso', country: 'ES' }));

    act(() => {
      result.current[1]('name', 'Sancho');
    });

    act(() => {
      result.current[2]({ email: 'sancho@example.com' });
    });

    // A replacement, not a merge: fields missing from the new object are gone.
    expect(result.current[0]).toEqual({ email: 'sancho@example.com' });
  });
});
