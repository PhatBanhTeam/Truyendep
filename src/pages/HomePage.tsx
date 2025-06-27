import React, { useState, useEffect } from "react";
import { FeaturedSection } from "../components/FeaturedSection";
import { MangaGrid } from "../components/MangaGrid";
import RecentHistorySection from "../components/RecentHistorySection";
import { api } from "../services/api";
import { Manga } from "../types/manga";

export const HomePage: React.FC = () => {
  const [featuredManga, setFeaturedManga] = useState<Manga[]>([]);
  const [popularManga, setPopularManga] = useState<Manga[]>([]);
  const [recentManga, setRecentManga] = useState<Manga[]>([]);
  const [completedManga, setCompletedManga] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load home data from OTruyen API
        const homeData = await api.getHomeData();

        setFeaturedManga(homeData.featured);
        setPopularManga(homeData.popular);
        setRecentManga(homeData.recent);
        setCompletedManga(homeData.completed);
      } catch (error) {
        console.error("Error loading home data:", error);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");

        // Fallback to mock data
        const mockData = api.getMockData();
        setFeaturedManga(mockData.featured);
        setPopularManga(mockData.popular);
        setRecentManga(mockData.recent);
        setCompletedManga(mockData.completed);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-graynter justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Có lỗi xảy ra
          </h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
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
        {/* Featured Section */}
        <FeaturedSection featuredManga={featuredManga} />

        {/* Recent History Section */}
        <RecentHistorySection />

        {/* Popular Manga */}
        <MangaGrid
          manga={popularManga}
          loading={loading}
          title="Truyện phổ biến"
          showViewAll={true}
          className="mb-12"
        />

        {/* Recent Updates */}
        <MangaGrid
          manga={recentManga}
          loading={loading}
          title="Mới cập nhật"
          showViewAll={true}
          className="mb-12"
        />

        {/* Completed Series */}
        {completedManga.length > 0 && (
          <MangaGrid
            manga={completedManga}
            loading={loading}
            title="Truyện hoàn thành"
            showViewAll={true}
            className="mb-12"
          />
        )}
      </div>
    </div>
  );
};
