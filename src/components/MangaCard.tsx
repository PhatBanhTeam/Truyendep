import React from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  Star,
  Calendar,
  User,
  TrendingUp,
  Clock,
  BookOpen,
} from "lucide-react";
import { Manga } from "../types/manga";
import React from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  Star,
  Calendar,
  User,
  TrendingUp,
  Clock,
  BookOpen,
} from "lucide-react";
import { Manga } from "../types/manga";

interface MangaCardProps {
  manga: Manga;
  showDetails?: boolean;
  variant?: "default" | "compact" | "featured";
  variant?: "default" | "compact" | "featured";
}

export const MangaCard: React.FC<MangaCardProps> = ({
  manga,
  showDetails = true,
  variant = "default",
export const MangaCard: React.FC<MangaCardProps> = ({
  manga,
  showDetails = true,
  variant = "default",
}) => {
  const statusColors = {
    ongoing: "bg-emerald-100 text-emerald-800 border-emerald-200",
    completed: "bg-blue-100 text-blue-800 border-blue-200",
    hiatus: "bg-yellow-100 text-yellow-800 border-yellow-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
  };

  const statusText = {
    ongoing: "Đang tiến hành",
    completed: "Hoàn thành",
    hiatus: "Tạm ngưng",
    cancelled: "Đã hủy",
    ongoing: "Đang tiến hành",
    completed: "Hoàn thành",
    hiatus: "Tạm ngưng",
    cancelled: "Đã hủy",
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const isNew =
    manga.lastUpdated &&
    new Date(manga.lastUpdated) >
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const isNew =
    manga.lastUpdated &&
    new Date(manga.lastUpdated) >
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const isHot = manga.views && manga.views > 50000;

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 animate-fade-in hover:border-primary-200 hover:-translate-y-1">
      <Link to={`/manga/${manga.id}`} className="block relative">
        <div className="aspect-[3/4] overflow-hidden bg-gray-200 relative">
          <img
            src={manga.coverUrl}
            alt={manga.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop";
              (e.target as HTMLImageElement).src =
                "https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop";
            }}
          />


          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>


          {/* Status Badge */}
          {manga.status && (
            <div className="absolute top-2 left-2">
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full border ${
                  statusColors[manga.status as keyof typeof statusColors]
                }`}
              >
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full border ${
                  statusColors[manga.status as keyof typeof statusColors]
                }`}
              >
                {statusText[manga.status as keyof typeof statusText]}
              </span>
            </div>
          )}


          {/* Rating Badge */}
          {manga.rating && (
            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full flex items-center space-x-1">
              <Star className="h-3 w-3 fill-current text-yellow-400" />
              <span className="text-xs font-medium">{manga.rating}</span>
            </div>
          )}


          {/* New/Hot Badges */}
          <div className="absolute bottom-2 left-2 flex space-x-1">
            {isNew && (
              <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>Mới</span>
              </span>
            )}
            {isHot && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full flex items-center space-x-1">
                <TrendingUp className="h-3 w-3" />
                <span>Hot</span>
              </span>
            )}
          </div>


          {/* Quick Action Button */}
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-colors">
              <BookOpen className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors mb-2 leading-tight">
            {manga.title}
          </h3>


          {showDetails && (
            <>
              {manga.description && variant !== "compact" && (
              {manga.description && variant !== "compact" && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">
                  {manga.description}
                </p>
              )}

              <div className="space-y-2">
                {manga.author && (
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <User className="h-3 w-3" />
                    <span className="truncate">{manga.author}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500">
                  {manga.views && (
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span className="font-medium">
                        {formatViews(manga.views)}
                      </span>
                      <span className="font-medium">
                        {formatViews(manga.views)}
                      </span>
                    </div>
                  )}


                  {manga.lastUpdated && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(manga.lastUpdated).toLocaleDateString(
                          "vi-VN"
                        )}
                      </span>
                      <span>
                        {new Date(manga.lastUpdated).toLocaleDateString(
                          "vi-VN"
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {manga.genres && manga.genres.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {manga.genres
                      .slice(0, variant === "compact" ? 2 : 3)
                      .map((genre) => (
                        <span
                          key={genre}
                          className="px-2 py-1 text-xs bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 rounded-full border border-gray-200 hover:from-primary-100 hover:to-primary-50 hover:text-primary-700 hover:border-primary-200 transition-all duration-200"
                        >
                          {genre}
                        </span>
                      ))}
                    {manga.genres.length > (variant === "compact" ? 2 : 3) && (
                    {manga.genres
                      .slice(0, variant === "compact" ? 2 : 3)
                      .map((genre) => (
                        <span
                          key={genre}
                          className="px-2 py-1 text-xs bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 rounded-full border border-gray-200 hover:from-primary-100 hover:to-primary-50 hover:text-primary-700 hover:border-primary-200 transition-all duration-200"
                        >
                          {genre}
                        </span>
                      ))}
                    {manga.genres.length > (variant === "compact" ? 2 : 3) && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full border border-gray-200">
                        +{manga.genres.length - (variant === "compact" ? 2 : 3)}
                        +{manga.genres.length - (variant === "compact" ? 2 : 3)}
                      </span>
                    )}
                  </div>
                )}

                {/* Latest Chapter Info */}
                {manga.latestChapter && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Chương mới nhất:</span>
                      <span className="font-medium text-primary-600">
                        {manga.latestChapter}
                      </span>
                      <span className="font-medium text-primary-600">
                        {manga.latestChapter}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </Link>
    </div>
  );
};

