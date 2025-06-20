import React, { useState, useEffect } from 'react';
import { Search, Menu, BookOpen, Home, TrendingUp, Clock, Star, Filter } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load categories from OTruyen API
    const loadCategories = async () => {
      try {
        const categoriesData = await api.getCategories();
        setCategories(categoriesData.slice(0, 20)); // Show more categories
      } catch (error) {
        console.error('Error loading categories:', error);
        // Fallback to default genres
        const defaultGenres = [
          { name: 'Action', slug: 'action' },
          { name: 'Adventure', slug: 'adventure' },
          { name: 'Comedy', slug: 'comedy' },
          { name: 'Drama', slug: 'drama' },
          { name: 'Fantasy', slug: 'fantasy' },
          { name: 'Horror', slug: 'horror' },
          { name: 'Romance', slug: 'romance' },
          { name: 'Sci-Fi', slug: 'sci-fi' },
          { name: 'Slice of Life', slug: 'slice-of-life' },
          { name: 'Sports', slug: 'sports' },
          { name: 'Supernatural', slug: 'supernatural' },
          { name: 'Thriller', slug: 'thriller' },
          { name: 'Mystery', slug: 'mystery' },
          { name: 'Historical', slug: 'historical' },
          { name: 'School Life', slug: 'school-life' },
          { name: 'Martial Arts', slug: 'martial-arts' },
          { name: 'Mecha', slug: 'mecha' },
          { name: 'Psychological', slug: 'psychological' },
          { name: 'Seinen', slug: 'seinen' },
          { name: 'Shounen', slug: 'shounen' }
        ];
        setCategories(defaultGenres);
      }
    };

    loadCategories();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch?.(searchQuery);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-primary-800 hover:text-primary-600 transition-colors">
            <div className="relative">
              <BookOpen className="h-8 w-8" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-xl bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                TruyenDep
              </span>
              <div className="text-xs text-gray-500 -mt-1">Đọc truyện miễn phí</div>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm truyện hay..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-600 text-white px-3 py-1.5 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                >
                  Tìm
                </button>
              </div>
            </form>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors font-medium">
              <Home className="h-4 w-4" />
              <span>Trang chủ</span>
            </Link>
            <Link to="/trending" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors font-medium">
              <TrendingUp className="h-4 w-4" />
              <span>Thịnh hành</span>
            </Link>
            <Link to="/recent" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors font-medium">
              <Clock className="h-4 w-4" />
              <span>Mới cập nhật</span>
            </Link>
            <Link to="/top-rated" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors font-medium">
              <Star className="h-4 w-4" />
              <span>Đánh giá cao</span>
            </Link>
            
            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowCategoriesDropdown(!showCategoriesDropdown)}
                className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors font-medium"
              >
                <Filter className="h-4 w-4" />
                <span>Thể loại</span>
              </button>
              
              {showCategoriesDropdown && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-50">
                  <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                    {categories.map((category) => (
                      <Link
                        key={category.slug}
                        to={`/genre/${category.slug}`}
                        onClick={() => setShowCategoriesDropdown(false)}
                        className="px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-primary-100 hover:text-primary-700 transition-colors text-center"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Quick Categories Bar */}
        <div className="hidden lg:block py-3 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {categories.slice(0, 12).map((category) => (
              <Link
                key={category.slug}
                to={`/genre/${category.slug}`}
                className="px-3 py-1.5 text-sm bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 rounded-full hover:from-primary-100 hover:to-primary-50 hover:text-primary-700 transition-all duration-200 border border-gray-200 hover:border-primary-200"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 animate-slide-up">
          <div className="px-4 py-4 space-y-3">
            <Link to="/" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors font-medium">
              <Home className="h-4 w-4" />
              <span>Trang chủ</span>
            </Link>
            <Link to="/trending" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors font-medium">
              <TrendingUp className="h-4 w-4" />
              <span>Thịnh hành</span>
            </Link>
            <Link to="/recent" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors font-medium">
              <Clock className="h-4 w-4" />
              <span>Mới cập nhật</span>
            </Link>
            <Link to="/top-rated" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors font-medium">
              <Star className="h-4 w-4" />
              <span>Đánh giá cao</span>
            </Link>
            
            <div className="pt-3 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-900 mb-3">Thể loại phổ biến</p>
              <div className="grid grid-cols-2 gap-2">
                {categories.slice(0, 12).map((category) => (
                  <Link
                    key={category.slug}
                    to={`/genre/${category.slug}`}
                    className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-primary-100 hover:text-primary-700 transition-colors text-center"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};