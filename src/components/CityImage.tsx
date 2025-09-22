import React from 'react';

interface CityImageProps {
  cityName: string;
  imagePath?: string;
}

export const CityImage: React.FC<CityImageProps> = ({ cityName, imagePath }) => {
  if (!imagePath) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black/20">
        <div className="text-6xl opacity-50">🗺️</div>
      </div>
    );
  }

  // Convert original path to optimized paths
  const basename = imagePath.split('/').pop()?.replace('.png', '');
  const webpPath = `images/optimized/${basename}.webp`;
  const jpegPath = `images/optimized/${basename}.jpg`;

  return (
    <picture className="w-full h-full">
      <source srcSet={webpPath} type="image/webp" />
      <source srcSet={jpegPath} type="image/jpeg" />
      <img 
        src={jpegPath}
        alt={`${cityName} map`}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </picture>
  );
};