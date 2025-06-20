import React from 'react';
import { BookOpen, Heart, Github, Mail, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative">
                <BookOpen className="h-8 w-8 text-primary-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
              </div>
              <div>
                <span className="font-bold text-xl bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
                  TruyenDep
                </span>
                <div className="text-xs text-gray-400 -mt-1">Đọc truyện miễn phí</div>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Nền tảng đọc truyện tranh online hàng đầu Việt Nam. Cập nhật liên tục những bộ truyện hay nhất từ khắp nơi trên thế giới với chất lượng hình ảnh cao và tốc độ tải nhanh.
            </p>
            <div className="flex items-center space-x-1 text-sm text-gray-400 mb-4">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 animate-pulse" />
              <span>in Vietnam</span>
            </div>
            
            {/* Social Media */}
            <div className="flex items-center space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-400 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-primary-300">Liên kết nhanh</h3>
            <ul className="space-y-3">
              {[
                { name: 'Trang chủ', href: '/' },
                { name: 'Thể loại', href: '/categories' },
                { name: 'Thịnh hành', href: '/trending' },
                { name: 'Mới cập nhật', href: '/recent' },
                { name: 'Đánh giá cao', href: '/top-rated' },
                { name: 'Truyện hoàn thành', href: '/completed' }
              ].map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-300 hover:text-primary-300 transition-colors hover:underline">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-primary-300">Hỗ trợ</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300">support@truyendep.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Github className="h-4 w-4 text-gray-400" />
                <a href="#" className="text-gray-300 hover:text-primary-300 transition-colors">GitHub</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary-300 transition-colors">Báo lỗi</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary-300 transition-colors">Góp ý</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary-300 transition-colors">FAQ</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
              <p className="text-gray-400 text-sm">
                © 2024 TruyenDep. All rights reserved.
              </p>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>🚀 Tốc độ cao</span>
                <span>•</span>
                <span>📱 Responsive</span>
                <span>•</span>
                <span>🔒 An toàn</span>
              </div>
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-primary-300 text-sm transition-colors">Điều khoản</a>
              <a href="#" className="text-gray-400 hover:text-primary-300 text-sm transition-colors">Bảo mật</a>
              <a href="#" className="text-gray-400 hover:text-primary-300 text-sm transition-colors">DMCA</a>
              <a href="#" className="text-gray-400 hover:text-primary-300 text-sm transition-colors">Liên hệ</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};