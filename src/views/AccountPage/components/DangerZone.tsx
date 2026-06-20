/* eslint-disable no-underscore-dangle */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import UserContext from '../../../store/context/userContext/UserContext';
import { deleteUser as URL } from '../../../config/routes';
import AccountField from './AccountField';
import { primaryButton, secondaryButton } from './styles';

const DELETE_DESCRIPTION = 'Se borrarán tu perfil, tus espacios literarios y los '
  + 'libros que hayas publicado. Esta acción no se puede deshacer.';

interface DangerZoneProps {
  userEmail: string;
}

const DangerZone: React.FC<DangerZoneProps> = ({ userEmail }) => {
  const { resetUser } = useContext(UserContext);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = (): void => {
    setOpen(false);
    setConfirmEmail('');
    setError(null);
    triggerRef.current?.focus();
  };

  // Focus the email input when the modal opens.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Esc closes; Tab is trapped within the dialog.
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        close();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not(:disabled), input, [href], [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const handleDelete = async (): Promise<void> => {
    try {
      setDeleting(true);
      setError(null);
      const res = await fetch(URL, {
        method: 'delete',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const resJSON = await res.json();
      if (resJSON.success) {
        resetUser();
        router.push('/register');
      } else {
        setError('No se pudo eliminar la cuenta. Inténtalo de nuevo.');
      }
    } catch {
      setError('No se pudo eliminar la cuenta. Inténtalo de nuevo.');
    } finally {
      setDeleting(false);
    }
  };

  const emailMatches = confirmEmail.trim().toLowerCase() === (userEmail ?? '').trim().toLowerCase()
    && confirmEmail.trim() !== '';

  return (
    <>
      <Zone>
        <ZoneTitle>Eliminar cuenta</ZoneTitle>
        <ZoneText>{DELETE_DESCRIPTION}</ZoneText>
        <TriggerButton ref={triggerRef} type="button" onClick={() => setOpen(true)}>
          Eliminar mi cuenta
        </TriggerButton>
      </Zone>

      {open && (
        <Overlay onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
          <Dialog
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-account-title"
          >
            <DialogTitle id="delete-account-title">¿Eliminar tu cuenta?</DialogTitle>
            <DialogText>{DELETE_DESCRIPTION}</DialogText>
            <AccountField
              label="Escribe tu email para confirmar"
              name="confirm-email"
              type="email"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
            />
            {error && (
              <DialogError role="alert">
                <span aria-hidden="true">⚠</span>
                {error}
              </DialogError>
            )}
            <DialogActions>
              <CancelButton type="button" onClick={close}>Cancelar</CancelButton>
              <ConfirmButton
                type="button"
                onClick={handleDelete}
                disabled={!emailMatches || deleting}
              >
                {deleting ? 'Eliminando…' : 'Eliminar definitivamente'}
              </ConfirmButton>
            </DialogActions>
          </Dialog>
        </Overlay>
      )}
    </>
  );
};

const Zone = styled.div`
  margin-top: 32px;
  border: 1px solid #e7b9a3;
  border-radius: 10px;
  background: #fdf3ee;
  padding: 18px 20px;
`;

const ZoneTitle = styled.h2`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.terracotta};
  margin: 0 0 6px;
`;

const ZoneText = styled.p`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  color: ${({ theme }) => theme.brown};
  margin: 0 0 14px;
  line-height: 1.5;
`;

const TriggerButton = styled.button`
  ${secondaryButton}
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(61, 58, 53, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1000;
`;

const Dialog = styled.div`
  background: ${({ theme }) => theme.white};
  border-radius: 12px;
  padding: 24px;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 12px 40px rgba(61, 58, 53, 0.25);
`;

const DialogTitle = styled.h2`
  font-family: 'Fraunces', serif;
  font-weight: 600;
  font-size: 20px;
  color: ${({ theme }) => theme.ink};
  margin: 0 0 10px;
`;

const DialogText = styled.p`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  color: ${({ theme }) => theme.brown};
  line-height: 1.5;
  margin: 0 0 16px;
`;

const DialogError = styled.p`
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 16px 0 0;
  padding: 10px 14px;
  border-radius: 8px;
  background: #fdf3ee;
  border: 1px solid ${({ theme }) => theme.terracotta};
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  color: ${({ theme }) => theme.ink};
`;

const DialogActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
`;

const CancelButton = styled.button`
  ${secondaryButton}
`;

const ConfirmButton = styled.button`
  ${primaryButton}
`;

export default DangerZone;
