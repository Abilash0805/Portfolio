import Image from "next/image";

/**
 * The plain preview. Deliberately in its own module with no three.js imports,
 * so reduced-motion and low-tier visitors never download the WebGL stack just
 * to look at a picture.
 */
export function ProjectImage({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <div className="relative aspect-[3/2] w-full overflow-hidden bg-graphite">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 55vw"
        className="object-cover"
        priority={priority}
      />
    </div>
  );
}
