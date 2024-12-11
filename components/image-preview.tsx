import Image from 'next/image'

interface ImagePreviewProps {
  file: File
}

export default function ImagePreview({ file }: ImagePreviewProps) {
  return (
    <div className="mt-2">
      <Image
        src={URL.createObjectURL(file)}
        alt={`Preview of ${file.name}`}
        width={200}
        height={200}
        className="rounded-lg object-cover"
      />
    </div>
  )
}

