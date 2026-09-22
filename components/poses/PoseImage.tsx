import Image from 'next/image';
import { AI_NOTICE_SHORT, imgSrc, Pose } from '@/lib/poses';

export function PoseImage({ pose, priority = false, sizes = '(max-width: 720px) 90vw, 420px', badge = 'short' }: { pose: Pose; priority?: boolean; sizes?: string; badge?: 'short' | 'full' }) {
  return (
    <figure className="pz-fig">
      <Image src={imgSrc(pose)} alt={pose.altText} width={800} height={1200} sizes={sizes} priority={priority} className="pz-img" />
      <span className="pz-badge">{badge === 'full' ? AI_NOTICE_SHORT : 'Creada con IA'}</span>
    </figure>
  );
}
