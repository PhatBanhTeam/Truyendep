import React from 'react';
import { MangaCard } from './MangaCard';
import { Manga } from '../types/manga';

interface MangaGridProps {
  manga: Manga[];
  loading?: boolean;
  title?: string;
  showViewAll?: boolean;
  className?: string;
}

export const MangaGrid: React.FC<MangaGridProps> = ({ 
  manga, 
  loading = false, 
  title, 
  showViewAll = false,
  className = ''
}) => {
  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        {title && (
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-[3/4] bg-gray-300 rounded-lg mb-3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (manga.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-gray-500 text-lg">Không tìm thấy truyện nào</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {title && (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {showViewAll && (
            <button className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
              Xem tất cả →
            </button>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {manga.map((item) => (
          <MangaCard key={item.id} manga={item} />
        ))}
      </div>
    </div>
  );
};