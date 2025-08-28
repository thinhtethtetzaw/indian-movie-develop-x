import { cn } from "@/lib/utils";
import React, { useCallback, useEffect, useState } from "react";

// File type constants
const IMAGE_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "svg",
  "bmp",
  "ico",
  "tiff",
  "tif",
] as const;

const TEXT_EXTENSIONS = [
  "txt",
  "md",
  "json",
  "xml",
  "html",
  "css",
  "js",
  "ts",
  "jsx",
  "tsx",
  "csv",
] as const;

type FileType = "image" | "text" | "unknown";

interface SmartImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "onError"> {
  fallback?: string;
  showTextContent?: boolean;
  maxTextLength?: number;
  onError?: (error: Error) => void;
}

const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt = "",
  className,
  fallback,
  onError,
  onLoad,
  showTextContent = true,
  maxTextLength = 500,
  ...imgProps
}) => {
  const [state, setState] = useState({
    error: false,
    textContent: "",
    isLoading: true,
    fileType: "unknown" as FileType,
  });

  // Get file extension from URL
  const getFileExtension = useCallback((url: string): string => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.split(".").pop()?.toLowerCase() || "";
    } catch {
      return url.split(".").pop()?.toLowerCase() || "";
    }
  }, []);

  // Determine file type based on extension
  const determineFileType = useCallback((extension: string): FileType => {
    if (IMAGE_EXTENSIONS.includes(extension as any)) return "image";
    if (TEXT_EXTENSIONS.includes(extension as any)) return "text";
    return "unknown";
  }, []);

  // Load text content
  const loadTextContent = useCallback(
    async (url: string) => {
      try {
        const response = await fetch(url);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const text = await response.text();
        setState((prev) => ({ ...prev, textContent: text, isLoading: false }));
      } catch (err) {
        console.error("Error loading text content:", err);
        setState((prev) => ({ ...prev, error: true, isLoading: false }));
        onError?.(err as Error);
      }
    },
    [onError],
  );

  // Handle image load
  const handleImageLoad = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      setState((prev) => ({ ...prev, isLoading: false }));
      onLoad?.(event);
    },
    [onLoad],
  );

  // Handle image error
  const handleImageError = useCallback(
    (_event: React.SyntheticEvent<HTMLImageElement>) => {
      setState((prev) => ({ ...prev, error: true, isLoading: false }));
      onError?.(new Error("Failed to load image"));
    },
    [onError],
  );

  // Initialize component
  useEffect(() => {
    if (!src) {
      setState((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    const extension = getFileExtension(src);
    const fileType = determineFileType(extension);

    setState((prev) => ({ ...prev, fileType }));

    if (fileType === "text") {
      loadTextContent(src);
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [src, getFileExtension, determineFileType, loadTextContent]);

  // Render text content
  const renderTextContent = () => {
    if (!showTextContent || !state.textContent) return null;

    const displayText =
      state.textContent.length > maxTextLength
        ? `${state.textContent.substring(0, maxTextLength)}...`
        : state.textContent;

    return (
      <div className="rounded-lg border bg-gray-50 p-4">
        <div className="mb-2 text-sm text-gray-600">Text Content:</div>
        <pre className="text-xs break-words whitespace-pre-wrap text-gray-800">
          {displayText}
        </pre>
        {state.textContent.length > maxTextLength && (
          <div className="mt-2 text-xs text-gray-500">
            Content truncated. Full length: {state.textContent.length}{" "}
            characters
          </div>
        )}
      </div>
    );
  };

  // Render fallback
  const renderFallback = () => {
    if (fallback) {
      return (
        <img
          src={fallback}
          alt={alt}
          className={cn("object-cover", className)}
          onLoad={handleImageLoad}
          onError={handleImageError}
          {...imgProps}
        />
      );
    }

    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gray-100 text-gray-500",
          className,
        )}
        style={imgProps.style}
      >
        <div className="text-center">
          <div className="mb-2 text-2xl">📄</div>
          <div className="text-sm">Unable to display content</div>
          <div className="mt-1 text-xs text-gray-400">
            {state.fileType === "text" ? "Text file" : "Unsupported format"}
          </div>
        </div>
      </div>
    );
  };

  // Render image
  const renderImage = () => (
    <img
      src={src}
      alt={alt}
      className={cn("object-cover", className)}
      onLoad={handleImageLoad}
      onError={handleImageError}
      {...imgProps}
    />
  );

  // Loading state
  if (state.isLoading) {
    return (
      <div
        className={cn(
          "flex animate-pulse items-center justify-center bg-gray-100",
          className,
        )}
        style={imgProps.style}
      >
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  // Render based on file type
  if (state.fileType === "text") {
    return (
      <div className={cn("w-full", className)} style={imgProps.style}>
        {renderTextContent()}
      </div>
    );
  }

  if (state.fileType === "image" && state.error) {
    return renderFallback();
  }

  // For images and unknown types, try to render as image
  if (!state.error) {
    return renderImage();
  }

  return renderFallback();
};

export default SmartImage;
