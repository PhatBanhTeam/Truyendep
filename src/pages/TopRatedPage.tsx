import React, { useState, useEffect } from 'react';
import { Star, Crown, Award } from 'lucide-react';
import { MangaGrid } from '../components/MangaGrid';
import { api } from '../services/api';
import { Manga } from '../types/manga';

export const TopRatedPage: React.FC = () => {
  const [manga, setManga] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTopRatedManga(1);
  }, []);

  const loadTopRatedManga = async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the manga list API - since OTruyen doesn't have a specific top-rated endpoint,
      // we'll use the general list and sort by rating
      const result = await api.getMangaList('truyen-full', page);
      
      // Sort by rating (mock ratings for now)
      const sortedManga = result.manga.sort((a: Manga, b: Manga) => (b.rating || 0) - (a.rating || 0));
      
      setManga(sortedManga);
      setCurrentPage(result.currentPage);
      setTotalPages(result.totalPages);
      
    } catch (error) {
      console.error('Error loading top rated manga:', error);
      setError('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.');
      
      // Fallback to mock data sorted by rating
      const mockData = api.getMockData();
      const sortedMockData = mockData.popular.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      setManga(sortedMockData);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      loadTopRatedManga(page);
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
            onClick={() => loadTopRatedManga(1)} 
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
              <Star className="h-8 w-8 text-yellow-500" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Đánh giá cao
              </h1>
            </div>
            <div className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 rounded-full text-sm font-medium">
              <Crown className="h-4 w-4" />
              <span>TOP</span>
            </div>
          </div>
          <p className="text-gray-600 text-lg">
            Những bộ truyện được đánh giá cao nhất bởi cộng đồng
          </p>
          {!loading && manga.length > 0 && (
            <div className="flex items-center space-x-4 mt-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Award className="h-4 w-4" />
                <span>Xếp hạng theo điểm đánh giá</span>
              </div>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                ))}
                <span className="text-sm text-gray-500 ml-1">Chất lượng cao</span>
              </div>
            </div>
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
                      ? 'text-white bg-gradient-to-r from-yellow-500 to-orange-500 border border-yellow-500'
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