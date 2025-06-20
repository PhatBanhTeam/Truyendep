import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Eye, Calendar, User, BookOpen, Play, Heart, Share2 } from 'lucide-react';
import { api } from '../services/api';
import { Manga, Chapter } from '../types/manga';

export const MangaDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [manga, setManga] = useState<Manga | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMangaData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        
        // Load manga details from OTruyen API
        const mangaData = await api.getMangaById(id);
        
        if (mangaData) {
          setManga(mangaData);
          
          // If chapters are included in the response, use them
          if (mangaData.chapters) {
            setChapters(mangaData.chapters);
          } else {
            // Generate mock chapters for now
            const mockChapters: Chapter[] = Array.from({ length: 50 }, (_, i) => ({
              id: `chapter-${i + 1}`,
              title: `Chapter ${i + 1}: ${['The Beginning', 'New Powers', 'First Battle', 'Revelation', 'Training Arc', 'Tournament', 'Final Boss', 'Epilogue'][i % 8]}`,
              number: i + 1,
              pages: [],
              publishedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
              views: Math.floor(Math.random() * 10000) + 1000,
            })).reverse();
            setChapters(mockChapters);
          }
        } else {
          setError('Không tìm thấy truyện');
        }
      } catch (error) {
        console.error('Error loading manga:', error);
        setError('Có lỗi xảy ra khi tải thông tin truyện');
      } finally {
        setLoading(false);
      }
    };

    loadMangaData();
  }, [id]);

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const statusColors = {
    ongoing: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    hiatus: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const statusText = {
    ongoing: 'Đang tiến hành',
    completed: 'Hoàn thành',
    hiatus: 'Tạm ngưng',
    cancelled: 'Đã hủy',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-80 h-96 bg-gray-300 rounded-xl"></div>
              <div className="flex-1 space-y-4">
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !manga) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{error || 'Không tìm thấy truyện'}</h1>
          <Link to="/" className="text-primary-600 hover:underline">← Về trang chủ</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-primary-600">Trang chủ</Link>
          <span>/</span>
          <span className="text-gray-900">{manga.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Cover & Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Cover Image */}
              <div className="relative group">
                <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-lg bg-gray-200">
                  <img
                    src={manga.coverUrl}
                    alt={manga.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop';
                    }}
                  />
                </div>
                {manga.rating && (
                  <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-current text-yellow-400" />
                    <span className="font-medium">{manga.rating}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                {chapters.length > 0 && (
                  <Link
                    to={`/manga/${manga.id}/chapter/${chapters[0].id}`}
                    className="flex items-center justify-center space-x-2 bg-primary-600 text-white px-4 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    <Play className="h-4 w-4" />
                    <span>Đọc ngay</span>
                  </Link>
                )}
                <button className="flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  <Heart className="h-4 w-4" />
                  <span>Yêu thích</span>
                </button>
              </div>

              <button className="w-full flex items-center justify-center space-x-2 bg-secondary-600 text-white px-4 py-3 rounded-lg hover:bg-secondary-700 transition-colors font-medium">
                <Share2 className="h-4 w-4" />
                <span>Chia sẻ</span>
              </button>

              {/* Stats */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Thống kê</h3>
                <div className="space-y-3">
                  {manga.views && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Eye className="h-4 w-4" />
                        <span>Lượt xem</span>
                      </div>
                      <span className="font-medium">{formatViews(manga.views)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <BookOpen className="h-4 w-4" />
                      <span>Số chương</span>
                    </div>
                    <span className="font-medium">{chapters.length}</span>
                  </div>
                  {manga.lastUpdated && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Cập nhật</span>
                      </div>
                      <span className="font-medium">{new Date(manga.lastUpdated).toLocaleDateString('vi-VN')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details & Chapters */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Basic Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{manga.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                {manga.status && (
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusColors[manga.status as keyof typeof statusColors]}`}>
                    {statusText[manga.status as keyof typeof statusText]}
                  </span>
                )}
                {manga.author && (
                  <div className="flex items-center space-x-1 text-gray-600">
                    <User className="h-4 w-4" />
                    <span>{manga.author}</span>
                  </div>
                )}
                {manga.year && (
                  <span className="text-gray-600">{manga.year}</span>
                )}
              </div>

              {manga.genres && manga.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {manga.genres.map((genre) => (
                    <Link
                      key={genre}
                      to={`/genre/${genre.toLowerCase()}`}
                      className="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-full hover:bg-primary-200 transition-colors"
                    >
                      {genre}
                    </Link>
                  ))}
                </div>
              )}

              {manga.description && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Tóm tắt</h3>
                  <div className="text-gray-700 leading-relaxed">
                    <p className={showFullDescription ? '' : 'line-clamp-4'}>
                      {manga.description}
                    </p>
                    {manga.description.length > 200 && (
                      <button
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="text-primary-600 hover:text-primary-700 font-medium mt-2"
                      >
                        {showFullDescription ? 'Thu gọn' : 'Xem thêm'}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Chapters List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">Danh sách chương</h2>
              </div>
              
              <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                {chapters.map((chapter) => (
                  <Link
                    key={chapter.id}
                    to={`/manga/${manga.id}/chapter/${chapter.id}`}
                    className="block p-4 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                          {chapter.title}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                          <span>{new Date(chapter.publishedAt).toLocaleDateString('vi-VN')}</span>
                          {chapter.views && (
                            <div className="flex items-center space-x-1">
                              <Eye className="h-3 w-3" />
                              <span>{formatViews(chapter.views)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-gray-400 group-hover:text-primary-600 transition-colors">
                        <Play className="h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};