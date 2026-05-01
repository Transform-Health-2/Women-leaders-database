import { useEffect, useRef, useCallback } from "react";

/**
 * useFocusTrap — traps keyboard focus within a modal/overlay.
 *
 * Prevents tab key from moving focus outside the modal.
 * Call this hook in any modal component.
 *
 * Usage:
 *   const modalRef = useFocusTrap(shouldTrap);
 */
export function useFocusTrap(active = true) {
  const ref = useRef(null);

  const handleKeyDown = useCallback((e) => {
    if (e.key !== "Tab") return;
    if (!ref.current) return;

    const focusable = ref.current.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, []);

  useEffect(() => {
    if (!active) return;

    const el = ref.current;
    if (!el) return;

    // Focus the first focusable element when trap activates
    const focusable = el.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length > 0) {
      focusable[0].focus();
    }

    el.addEventListener("keydown", handleKeyDown);
    return () => el.removeEventListener("keydown", handleKeyDown);
  }, [active, handleKeyDown]);

  return ref;
}
