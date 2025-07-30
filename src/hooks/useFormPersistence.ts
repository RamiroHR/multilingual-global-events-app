import { useEffect, useRef } from "react";

export function useFormPersistence<T>(
  formKey: string,
  values: T,
  setFieldValue: (field: string, value: string | number | boolean) => void
) {
  const savedRef = useRef(false);

  // restore data on mount from localStorage
  useEffect(() => {
    if (savedRef.current) return; // skip if already restored

    const saved = localStorage.getItem(`form_${formKey}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        Object.entries(parsed).forEach(([key, value]) => {
          setFieldValue(key, value as string | number | boolean);
        });
      } catch (error) {
        console.error("Failed to restore form data:", error);
      }
    }
    savedRef.current = true;
  }, [formKey, setFieldValue]);

  // save data on localStorage when values change after a timeout
  useEffect(() => {
    const timeout = 1000 * 1; // Save after 1 second of no changes
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(`form_${formKey}`, JSON.stringify(values));
      } catch (error) {
        console.error("Failed to save form data", error);
      }
    }, timeout);

    return () => clearTimeout(timeoutId);
  }, [formKey, values]);
}
