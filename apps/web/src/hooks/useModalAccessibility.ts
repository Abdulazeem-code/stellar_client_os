"use client";

import { useEffect, useRef, useCallback, RefObject } from "react";

const FOCUSABLE_SELECTORS = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(", ");

/**
 * Provides focus trap, scroll lock, and Escape key handling for modals.
 * Returns a ref to attach to the modal container element.
 */
export function useModalAccessibility({
  isOpen,
  onClose,
  closeOnEscape = true,
}: {
  isOpen: boolean;
  onClose?: () => void;
  closeOnEscape?: boolean;
}): RefObject<HTMLElement | null> {
  const containerRef = useRef<HTMLElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!containerRef.current) return;

      if (e.key === "Escape" && closeOnEscape && onClose) {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key !== "Tab") return;

      const nodes = containerRef.current.querySelectorAll(FOCUSABLE_SELECTORS);
      const focusable = (Array.from(nodes) as HTMLElement[]).filter(
        (el) => !el.closest("[aria-hidden='true']")
      );

      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }

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
    },
    [onClose, closeOnEscape]
  );

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement;

    // Lock body scroll
    const scrollY = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    // Move focus into modal on next tick
    const focusTimer = setTimeout(() => {
      if (!containerRef.current) return;
      const first = containerRef.current.querySelector(FOCUSABLE_SELECTORS) as HTMLElement | null;
      first?.focus();
    }, 0);

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);

      // Restore scroll
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);

      // Restore focus
      previouslyFocusedRef.current?.focus();
    };
  }, [isOpen, handleKeyDown]);

  return containerRef;
}
