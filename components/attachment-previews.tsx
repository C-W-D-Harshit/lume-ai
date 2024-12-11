import Image from "next/image";
import { FileIcon, FileTextIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface AttachmentPreviewsProps {
  files: File[];
}

const IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/bmp",
  "image/tiff",
  "image/avif",
  "image/heic",
  "image/heif",
];

export default function AttachmentPreviews({ files }: AttachmentPreviewsProps) {
  if (files.length === 0) return null;

  const isImage = (file: File) => IMAGE_TYPES.includes(file.type);

  return (
    <div className="flex flex-wrap gap-3">
      {files.map((file, index) => (
        <Card key={index} className="relative aspect-square h-20">
          {isImage(file) ? (
            <div className="relative w-full h-full">
              <Image
                src={URL.createObjectURL(file)}
                alt={`Preview of ${file.name}`}
                fill
                className="rounded-lg object-cover p-1"
              />
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-2">
              {file.type === "application/pdf" ? (
                <FileTextIcon className="h-8 w-8 text-muted-foreground" />
              ) : (
                <FileIcon className="h-8 w-8 text-muted-foreground" />
              )}
              <p className="text-xs text-center text-muted-foreground break-all line-clamp-2">
                {file.name}
              </p>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
