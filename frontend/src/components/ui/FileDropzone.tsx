"use client";

import { useCallback, useState } from "react";

interface FileDropzoneProps {
  accept?: string;
  maxSizeMB?: number;
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
  uploadProgress?: number;
  uploadedFileName?: string;
  error?: string;
  className?: string;
}

export function FileDropzone({
  accept = ".pdf",
  maxSizeMB = 10,
  onFileSelect,
  isUploading = false,
  uploadProgress = 0,
  uploadedFileName,
  error,
  className = "",
}: FileDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const displayError = error || localError;

  const validateAndSelect = useCallback(
    (file: File) => {
      setLocalError(null);

      // Validate file type
      const allowedTypes = accept.split(",").map((t) => t.trim());
      const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
      if (!allowedTypes.includes(fileExtension)) {
        setLocalError(`Please upload a ${accept} file.`);
        return;
      }

      // Validate file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        setLocalError(`File size exceeds ${maxSizeMB}MB limit.`);
        return;
      }

      onFileSelect(file);
    },
    [accept, maxSizeMB, onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) validateAndSelect(file);
    },
    [validateAndSelect]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) validateAndSelect(file);
    },
    [validateAndSelect]
  );

  // Upload complete state
  if (uploadedFileName && !isUploading) {
    return (
      <div
        className={`
          rounded-[var(--radius-lg)] border-2 border-solid border-[var(--color-success)]
          bg-[var(--color-success-light)] p-8 text-center
          transition-all duration-[var(--duration-normal)]
          ${className}
        `}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[var(--color-success)] flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <p className="text-body font-semibold text-[var(--text-primary)]">
              Upload complete
            </p>
            <p className="text-body-sm text-[var(--text-secondary)]">
              {uploadedFileName}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      className={`
        relative rounded-[var(--radius-lg)] border-2 border-dashed
        p-8 text-center cursor-pointer
        transition-all duration-[var(--duration-normal)]
        ${
          isDragOver
            ? "border-[var(--brand-primary)] bg-[var(--brand-primary-light)] scale-[1.01]"
            : displayError
            ? "border-[var(--color-error)] bg-[var(--color-error-light)]"
            : "border-[var(--border-default)] bg-[var(--bg-secondary)] hover:border-[var(--brand-primary)] hover:bg-[var(--brand-primary-ghost)]"
        }
        ${className}
      `}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={isUploading}
      />

      <div className="flex flex-col items-center gap-3">
        {isUploading ? (
          <>
            <svg
              className="w-10 h-10 text-[var(--brand-primary)] animate-pulse-glow"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-body font-medium text-[var(--brand-primary)]">
              Uploading... {uploadProgress}%
            </p>
            <div className="w-full max-w-[200px] h-2 bg-[var(--bg-tertiary)] rounded-[var(--radius-full)] overflow-hidden">
              <div
                className="h-full bg-[var(--brand-primary)] rounded-[var(--radius-full)] transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </>
        ) : (
          <>
            <svg
              className={`w-10 h-10 ${
                isDragOver
                  ? "text-[var(--brand-primary)] scale-110"
                  : "text-[var(--text-tertiary)]"
              } transition-all duration-[var(--duration-fast)]`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <div>
              <p className="text-body font-medium text-[var(--text-primary)]">
                {isDragOver
                  ? "Drop your file here"
                  : "Drag your CV here or click to browse"}
              </p>
              <p className="text-body-sm text-[var(--text-tertiary)] mt-1">
                PDF files up to {maxSizeMB}MB
              </p>
            </div>
          </>
        )}

        {displayError && (
          <p className="text-body-sm text-[var(--color-error)] font-medium mt-1">
            {displayError}
          </p>
        )}
      </div>
    </div>
  );
}
