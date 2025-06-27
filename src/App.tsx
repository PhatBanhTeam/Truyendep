import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/Layout/Header";
import { Footer } from "./components/Layout/Footer";
import { HomePage } from "./pages/HomePage";
import { MangaDetailPage } from "./pages/MangaDetailPage";
import { ChapterReaderPage } from "./pages/ChapterReaderPage";
import { SearchPage } from "./pages/SearchPage";
import { CategoryPage } from "./pages/CategoryPage";
import { TrendingPage } from "./pages/TrendingPage";
import { RecentPage } from "./pages/RecentPage";
import { TopRatedPage } from "./pages/TopRatedPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import HistoryPage from "./pages/HistoryPage";

function App() {
  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    // Search functionality is handled by the SearchPage component
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <Routes>
          {/* Routes without Header/Footer */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/manga/:mangaId/chapter/:chapterId"
            element={<ChapterReaderPage />}
          />

          {/* Other pages with header/footer */}
          <Route
            path="/*"
            element={
              <>
                <Header onSearch={handleSearch} />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/manga/:id" element={<MangaDetailPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/trending" element={<TrendingPage />} />
                    <Route path="/recent" element={<RecentPage />} />
                    <Route path="/top-rated" element={<TopRatedPage />} />
                    <Route path="/genre/:slug" element={<CategoryPage />} />
                    <Route path="/history" element={<HistoryPage />} />
                    <Route
                      path="/admin/dashboard"
                      element={<AdminDashboardPage />}
                    />
                  </Routes>
                </main>
                <Footer />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
