import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, Trash2, Eye, Calendar } from "lucide-react";
import { api, ReadingHistoryItem } from "../services/api";

const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<ReadingHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const historyData = api.readingHistory.getHistory();
    setHistory(historyData);
    setLoading(false);
  };

  const removeFromHistory = (mangaId: string) => {
    api.readingHistory.removeFromHistory(mangaId);
    loadHistory(); // Reload history
  };

  const clearAllHistory = () => {
    if (window.confirm("Bạn có chắc muốn xóa tsử đọc truyện?")) {
      api.readingHistory.clearHistory();
      setHistory([]);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Clock className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Lịch sử đọc truyện
            </h1>
          </div>

          {history.length > 0 && (
            <button
              onClick={clearAllHistory}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span>Xóa tất cả</span>
            </button>
          )}
        </div>

        {/* History List */}
        {history.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Chưa có lịch sử đọc truyện
            </h3>
            <p className="text-gray-500 mb-6">
              Bắt đầu đọc truyện để xem lịch sử ở đây
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Khám phá truyện
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {history.map((item, index) => (
              <div
                key={`${item.mangaId}-${index}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Manga Cover */}
                <div className="relative">
                  <img
                    src={item.coverUrl}
                    alt={item.mangaTitle}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "https://via.placeholder.com/300x400?text=No+Image";
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => removeFromHistory(item.mangaId)}
                      className="p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                      title="Xóa khỏi lịch sử"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Manga Info */}
                <div className="p-4">
                  <Link
                    to={`/manga/${item.mangaId}`}
                    className="block hover:text-blue-600 transition-colors"
                  >
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                      {item.mangaTitle}
                    </h3>
                  </Link>

                  <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                    {item.chapterTitle}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>{item.readCount} lần</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(item.lastReadAt)}</span>
                    </div>
                  </div>

                  {/* Continue Reading Button */}
                  <Link
                    to={`/manga/${item.mangaId}/chapter/${item.chapterId}`}
                    className="mt-3 w-full block text-center px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Tiếp tục đọc
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
