import Image from 'next/image';

type BrandLogoVariant = 'transparent' | 'white' | 'black' | 'icon';

type BrandLogoProps = {
  variant?: BrandLogoVariant;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
};

const logoSources: Record<BrandLogoVariant, { src: string; width: number; height: number }> = {
  transparent: {
    src: '/brand/velozza_logo_sin_fondo_1080.png',
    width: 1080,
    height: 1080,
  },
  white: {
    src: '/brand/velozza_logo_con_fondo_blanco_500.png',
    width: 500,
    height: 500,
  },
  black: {
    src: '/brand/velozza_logo_con_fondo_negro_1080.png',
    width: 1080,
    height: 1080,
  },
  icon: {
    src: '/brand/velozza_icono_solo_1200x900.png',
    width: 1200,
    height: 900,
  },
};

export default function BrandLogo({ variant = 'transparent', className, style, priority }: BrandLogoProps) {
  const logo = logoSources[variant];

  return (
    <Image
      src={logo.src}
      alt="Velozza Creative Works"
      width={logo.width}
      height={logo.height}
      priority={priority}
      className={className}
      style={{ width: '100%', height: 'auto', display: 'block', ...style }}
    />
  );
}