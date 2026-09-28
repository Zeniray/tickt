interface ToastProps {
  toast: { id: number; text: string } | null;
}

export default function Toast({ toast }: ToastProps) {
  return (
    <div className="toast-region" aria-live="polite">
      {toast && (
        <div key={toast.id} className="toast">
          {toast.text}
        </div>
      )}
    </div>
  );
}
