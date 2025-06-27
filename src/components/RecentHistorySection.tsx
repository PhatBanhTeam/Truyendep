import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, Calendar } from "lucide-react";
import { api, ReadingHistoryItem } from "../services/api";

const RecentHistorySection: React.FC = () => {
  const [recentHistory, setRecentHistory] = useState<ReadingHistoryItem[]>([]);

  useEffect(() => {
    const history = api.readingHistory.getRecentReads();
    setRecentHistory(history);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Vừa xong";
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    if (diffInHours < 48) return "Hôm qua";

    return date.toLocaleDateString("vi-VN");
  };

  if (recentHistory.length === 0) {
    return null; // Don't show section if no history
  }

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Clock className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Đọc gần đây</h2>
          </div>
          <Link
            to="/history"
            className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
          >
            Xem tất cả →
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recentHistory.slice(0, 8).map((item, index) => (
            <div
              key={`${item.mangaId}-${index}`}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Manga Cover */}
              <div className="relative">
                <img
                  src={item.coverUrl}
                  alt={item.mangaTitle}
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://via.placeholder.com/300x400?text=No+Image";
                  }}
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                  {item.readCount} lần
                </div>
              </div>

              {/* Manga Info */}
              <div className="p-3">
                <Link
                  to={`/manga/${item.mangaId}`}
                  className="block hover:text-blue-600 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 text-sm">
                    {item.mangaTitle}
                  </h3>
                </Link>

                <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                  {item.chapterTitle}
                </p>

                {/* Last Read Time */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(item.lastReadAt)}</span>
                  </div>
                </div>

                {/* Continue Reading Button */}
                <Link
                  to={`/manga/${item.mangaId}/chapter/${item.chapterId}`}
                  className="mt-2 w-full block text-center px-2 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                >
                  Tiếp tục đọc
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentHistorySection;
