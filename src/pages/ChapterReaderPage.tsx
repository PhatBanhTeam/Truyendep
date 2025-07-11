import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  List,
  Settings,
  Maximize,
  Minimize,
} from "lucide-react";
import { api } from "../services/api";

export const ChapterReaderPage: React.FC = () => {
  const { mangaId, chapterId } = useParams<{
    mangaId: string;
    chapterId: string;
  }>();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [mangaTitle, setMangaTitle] = useState("");
  const [chapterTitle, setChapterTitle] = useState("");

  useEffect(() => {
    const loadChapterData = async () => {
      if (!mangaId || !chapterId) return;

      try {
        setLoading(true);

        // Try to load chapter images from OTruyen API
        const chapterImages = await api.getChapterImages(mangaId, chapterId);

        if (chapterImages.length > 0) {
          setPages(chapterImages);
        } else {
          // Fallback to mock pages
          const mockPages = Array.from(
            { length: 20 },
            (_, i) =>
              `https://images.pexels.com/photos/${
                1000000 + i * 1000
              }/pexels-photo-${
                1000000 + i * 1000
              }.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&fit=crop`
          );
          setPages(mockPages);
        }

        // Try to get manga info for title
        const mangaData = await api.getMangaById(mangaId);
        if (mangaData) {
          setMangaTitle(mangaData.title);
          setChapterTitle(`Chapter ${chapterId}`);

          // Save to reading history
          api.readingHistory.addToHistory(
            mangaId,
            mangaData.title,
            chapterId,
            `Chapter ${chapterId}`,
            mangaData.coverUrl
          );
        } else {
          setMangaTitle("Sample Manga Title");
          setChapterTitle("Chapter 1: The Beginning");

        }
      } catch (error) {
        console.error("Error loading chapter:", error);
        // Use fallback data
        const mockPages = Array.from(
          { length: 20 },
          (_, i) =>
            `https://images.pexels.com/photos/${
              1000000 + i * 1000
            }/pexels-photo-${
              1000000 + i * 1000
            }.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&fit=crop`
        );
        setPages(mockPages);
        setMangaTitle("Sample Manga Title");
        setChapterTitle("Chapter 1: The Beginning");

      } finally {
        setLoading(false);
      }
    };

    loadChapterData();
  }, [mangaId, chapterId]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && currentPage > 0) {
        setCurrentPage(currentPage - 1);
      } else if (e.key === "ArrowRight" && currentPage < pages.length - 1) {
        setCurrentPage(currentPage + 1);
      } else if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      } else if (e.key === "h" || e.key === "H") {
        setShowControls(!showControls);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentPage, pages.length, showControls]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Đang tải chương...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-black text-white ${
        isFullscreen ? "fixed inset-0 z-50" : ""
      }`}
    >
      {/* Header Controls */}
      <div
        className={`sticky top-0 z-40 bg-black bg-opacity-90 backdrop-blur-sm transition-transform duration-300 ${
          showControls ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                to={`/manga/${mangaId}`}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
                <span>Quay lại</span>
              </Link>
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold">{mangaTitle}</h1>
                <p className="text-sm text-gray-400">{chapterTitle}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">
                {currentPage + 1} / {pages.length}
              </span>
              <button
                onClick={toggleFullscreen}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Toàn màn hình (F)"
              >
                {isFullscreen ? (
                  <Minimize className="h-5 w-5" />
                ) : (
                  <Maximize className="h-5 w-5" />
                )}
              </button>
              <button
                onClick={() => setShowControls(!showControls)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Ẩn/hiện điều khiển (H)"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Reader */}
      <div className="relative">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="relative max-w-4xl w-full">
            {pages.length > 0 && (
              <img
                src={pages[currentPage]}
                alt={`Page ${currentPage + 1}`}
                className="w-full h-auto max-h-screen object-contain"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&fit=crop";
                }}
              />
            )}

            {/* Navigation Buttons */}
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className={`absolute left-0 top-0 bottom-0 w-1/3 flex items-center justify-start pl-4 bg-transparent hover:bg-black hover:bg-opacity-20 transition-colors ${
                currentPage === 0 ? "cursor-not-allowed opacity-30" : ""
              }`}
              title="Trang trước (←)"
            >
              <ChevronLeft
                className={`h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity ${
                  showControls ? "opacity-60" : ""
                }`}
              />
            </button>

            <button
              onClick={nextPage}
              disabled={currentPage === pages.length - 1}
              className={`absolute right-0 top-0 bottom-0 w-1/3 flex items-center justify-end pr-4 bg-transparent hover:bg-black hover:bg-opacity-20 transition-colors ${
                currentPage === pages.length - 1
                  ? "cursor-not-allowed opacity-30"
                  : ""
              }`}
              title="Trang sau (→)"
            >
              <ChevronRight
                className={`h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity ${
                  showControls ? "opacity-60" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 bg-black bg-opacity-90 backdrop-blur-sm transition-transform duration-300 ${
          showControls ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={prevPage}
                disabled={currentPage === 0}
                className={`flex items-center space-x-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors ${
                  currentPage === 0 ? "cursor-not-allowed opacity-30" : ""
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Trang trước</span>
              </button>

              <button
                onClick={nextPage}
                disabled={currentPage === pages.length - 1}
                className={`flex items-center space-x-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors ${
                  currentPage === pages.length - 1
                    ? "cursor-not-allowed opacity-30"
                    : ""
                }`}
              >
                <span className="hidden sm:inline">Trang sau</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Page Progress */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max={pages.length - 1}
                  value={currentPage}
                  onChange={(e) => setCurrentPage(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  aria-label="Chọn trang truyện"
                  title="Chọn trang truyện"
                />
                <div className="text-center mt-2 text-sm text-gray-400">
                  Trang {currentPage + 1} / {pages.length}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Link
                to="/"
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Trang chủ"
              >
                <Home className="h-5 w-5" />
              </Link>
              <Link
                to={`/manga/${mangaId}`}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Danh sách chương"
              >
                <List className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Help Text */}
      {showControls && (
        <div className="fixed top-20 right-4 bg-black bg-opacity-80 text-xs text-gray-300 p-3 rounded-lg">
          <p>← → : Chuyển trang</p>
          <p>F: Toàn màn hình</p>
          <p>H: Ẩn/hiện điều khiển</p>
        </div>
      )}
