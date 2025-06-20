import React, { useState, useEffect } from 'react';
import { TrendingUp, Siren as Fire } from 'lucide-react';
import { MangaGrid } from '../components/MangaGrid';
import { api } from '../services/api';
import { Manga } from '../types/manga';

export const TrendingPage: React.FC = () => {
  const [manga, setManga] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTrendingManga(1);
  }, []);

  const loadTrendingManga = async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the manga list API with trending type
      const result = await api.getMangaList('truyen-hot', page);
      
      setManga(result.manga);
      setCurrentPage(result.currentPage);
      setTotalPages(result.totalPages);
      
    } catch (error) {
      console.error('Error loading trending manga:', error);
      setError('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.');
      
      // Fallback to mock data
      const mockData = api.getMockData();
      setManga(mockData.popular.sort(() => Math.random() - 0.5));
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      loadTrendingManga(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (error && manga.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Có lỗi xảy ra</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => loadTrendingManga(1)} 
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-orange-500" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Truyện thịnh hành
              </h1>
            </div>
            <div className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 rounded-full text-sm font-medium">
              <Fire className="h-4 w-4" />
              <span>HOT</span>
            </div>
          </div>
          <p className="text-gray-600 text-lg">
            Những bộ truyện được yêu thích nhất hiện tại
          </p>
          {!loading && manga.length > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Cập nhật: {new Date().toLocaleDateString('vi-VN')}
            </p>
          )}
        </div>

        {error && manga.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <p className="text-yellow-800">
              Đang sử dụng dữ liệu dự phòng. Một số thông tin có thể không được cập nhật.
            </p>
          </div>
        )}

        <MangaGrid
          manga={manga}
          loading={loading}
          className="mb-8"
        />

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Trước
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    page === currentPage
                      ? 'text-white bg-gradient-to-r from-orange-500 to-red-500 border border-orange-500'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
};