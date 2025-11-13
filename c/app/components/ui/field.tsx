"use client";

import {
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";

import { cn } from "@/lib/cn";

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  description?: string;
  children: ReactElement;
  hint?: ReactNode;
};

export const Field = ({
  id,
  label,
  error,
  description,
  children,
  hint,
}: FieldProps) => {
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = cn(descriptionId, errorId);

  let control = children;

  if (isValidElement(children)) {
    const existingDescribedBy =
      typeof children.props["aria-describedby"] === "string"
        ? children.props["aria-describedby"]
        : undefined;

    const mergedDescribedBy = cn(existingDescribedBy, describedBy);

    control = cloneElement(children, {
      id: children.props.id ?? id,
      hasError: Boolean(error),
      "aria-invalid": error ? "true" : children.props["aria-invalid"],
      "aria-describedby": mergedDescribedBy || undefined,
    });
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          className="block text-sm font-medium text-white/90"
          htmlFor={id}
        >
          {label}
        </label>
        {hint && <div className="text-xs text-white/60">{hint}</div>}
      </div>
      {control}
      {description && (
        <p id={descriptionId} className="text-xs text-white/70">
          {description}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-sm text-rose-300">
          {error}
        </p>
      )}
    </div>
  );
};

