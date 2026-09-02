"use client";

export default function DeleteSubmitButton({
  label = "Fshi",
  confirmText = "A jeni i sigurt që doni ta fshini këtë rresht? Ky veprim nuk kthehet mbrapsht.",
}: {
  label?: string;
  confirmText?: string;
}) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
      className="text-red-600 hover:text-red-800 hover:underline text-sm"
    >
      {label}
    </button>
  );
}
