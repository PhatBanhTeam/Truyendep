import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MangaGrid } from '../components/MangaGrid';
import { api } from '../services/api';
import { Manga } from '../types/manga';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [manga, setManga] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      loadCategoryManga(slug, 1);
    }
  }, [slug]);

  const loadCategoryManga = async (categorySlug: string, page: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await api.getMangaByCategory(categorySlug, page);
      
      setManga(result.manga);
      setCurrentPage(result.currentPage);
      setTotalPages(result.totalPages);
      setCategoryName(result.categoryName || categorySlug);
      
    } catch (error) {
      console.error('Error loading category manga:', error);
      setError('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage && slug) {
      loadCategoryManga(slug, page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Có lỗi xảy ra</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => slug && loadCategoryManga(slug, 1)} 
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {categoryName || 'Thể loại'}
          </h1>
          {!loading && manga.length > 0 && (
            <p className="text-gray-600">
              {manga.length} truyện trong thể loại này
            </p>
          )}
        </div>

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
              className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
};