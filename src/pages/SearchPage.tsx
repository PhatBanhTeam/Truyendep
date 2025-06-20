import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MangaGrid } from '../components/MangaGrid';
import { api } from '../services/api';
import { Manga } from '../types/manga';

export const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [manga, setManga] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query) {
      searchManga(query, 1);
    }
  }, [query]);

  const searchManga = async (searchQuery: string, page: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await api.searchManga(searchQuery, page);
      
      setManga(result.manga);
      setCurrentPage(result.currentPage);
      setTotalPages(result.totalPages);
      
    } catch (error) {
      console.error('Error searching manga:', error);
      setError('Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      searchManga(query, page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!query) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Tìm kiếm truyện</h1>
            <p className="text-gray-600">Nhập từ khóa vào ô tìm kiếm để bắt đầu</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Kết quả tìm kiếm cho "{query}"
          </h1>
          {!loading && manga.length > 0 && (
            <p className="text-gray-600">
              Tìm thấy {manga.length} kết quả
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800">{error}</p>
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
              className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg ${
                    page === currentPage
                      ? 'text-white bg-primary-600 border border-primary-600'
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
              className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
};