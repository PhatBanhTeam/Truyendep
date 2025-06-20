import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Eye, Calendar, TrendingUp, Siren as Fire } from 'lucide-react';
import { Manga } from '../types/manga';

interface FeaturedSectionProps {
  featuredManga: Manga[];
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({ featuredManga }) => {
  if (featuredManga.length === 0) return null;

  const mainFeatured = featuredManga[0];
  const sideFeatured = featuredManga.slice(1, 4);

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Fire className="h-6 w-6 text-orange-500" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Nổi bật hôm nay
            </h2>
          </div>
          <div className="px-3 py-1 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 rounded-full text-sm font-medium">
            HOT
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Featured */}
        <div className="lg:col-span-2">
          <Link to={`/manga/${mainFeatured.id}`} className="group block">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-1">
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
                <img
                  src={mainFeatured.coverUrl}
                  alt={mainFeatured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                
                {/* Trending Badge */}
                <div className="absolute top-4 left-4">
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1.5 rounded-full text-white font-medium shadow-lg">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm">Trending #1</span>
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center space-x-4 mb-3">
                    {mainFeatured.rating && (
                      <div className="flex items-center space-x-1 bg-yellow-500 px-3 py-1.5 rounded-full shadow-lg">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm font-medium">{mainFeatured.rating}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <Fire className="h-4 w-4 text-orange-300" />
                      <span className="text-sm font-medium">Siêu hot</span>
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-bold mb-3 group-hover:text-orange-300 transition-colors leading-tight">
                    {mainFeatured.title}
                  </h3>
                  
                  {mainFeatured.description && (
                    <p className="text-gray-200 mb-4 line-clamp-2 max-w-2xl leading-relaxed">
                      {mainFeatured.description}
                    </p>
                  )}
                  
                  <div className="flex items-center space-x-6 text-sm">
                    {mainFeatured.views && (
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{formatViews(mainFeatured.views)} lượt xem</span>
                      </div>
                    )}
                    {mainFeatured.lastUpdated && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(mainFeatured.lastUpdated).toLocaleDateString('vi-VN')}</span>
                      </div>
                    )}
                    {mainFeatured.genres && mainFeatured.genres.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs">
                          {mainFeatured.genres[0]}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Side Featured */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">Top trending</h3>
          </div>
          
          {sideFeatured.map((manga, index) => (
            <Link key={manga.id} to={`/manga/${manga.id}`} className="group block">
              <div className="flex space-x-4 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 p-4 hover:border-primary-200">
                <div className="relative">
                  <div className="w-16 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                    <img
                      src={manga.coverUrl}
                      alt={manga.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=100&h=120&fit=crop';
                      }}
                    />
                  </div>
                  <div className="absolute -top-2 -left-2 w-7 h-7 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
                    {index + 2}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors mb-2 leading-tight">
                    {manga.title}
                  </h4>
                  
                  <div className="flex items-center space-x-3 text-xs text-gray-500 mb-2">
                    {manga.rating && (
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-current text-yellow-400" />
                        <span className="font-medium">{manga.rating}</span>
                      </div>
                    )}
                    {manga.views && (
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>{formatViews(manga.views)}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1 text-green-600">
                      <TrendingUp className="h-3 w-3" />
                      <span className="font-medium">+{Math.floor(Math.random() * 50) + 10}%</span>
                    </div>
                  </div>
                  
                  {manga.genres && manga.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {manga.genres.slice(0, 2).map((genre) => (
                        <span key={genre} className="px-2 py-1 text-xs bg-gradient-to-r from-gray-100 to-gray-50 text-gray-600 rounded-full border border-gray-200">
                          {genre}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};