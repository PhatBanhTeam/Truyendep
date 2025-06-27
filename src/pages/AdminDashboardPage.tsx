import React from "react";

const AdminDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-indigo-700 text-white p-4 text-2xl font-bold">
        Dashboard Quản trị
      </header>
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r p-4 hidden md:block">
          <nav>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-indigo-700 font-semibold">
                  Quản lý truyện
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700">
                  Quản lý user
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700">
                  Thống kê
                </a>
              </li>
            </ul>
          </nav>
        </aside>
        {/* Main content */}
        <main className="flex-1 p-8">
          <h2 className="text-xl font-bold mb-4">Chào mừng Admin!</h2>
          <p>
            Đây là trang dashboard quản trị. Bạn có thể quản lý truyện, người
            dùng và xem thống kê tại đây.
          </p>
          {/* Thêm các widget thống kê hoặc hướng dẫn sử dụng ở đây */}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
