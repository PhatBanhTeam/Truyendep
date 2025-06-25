const OTRUYEN_API = "https://otruyenapi.com/v1/api";

export interface OTruyenManga {
  _id: string;
  name: string;
  slug: string;
  origin_name: string[];
  content: string;
  thumb_url: string;
  author: string[];
  category: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  status: string;
  chaptersLatest: Array<{
    filename: string;
    chapter_name: string;
    chapter_title: string;
    chapter_api_data: string;
  }>;
  chapters?: OTruyenChapterData[];
  updatedAt: string;
  view: number;
}

export interface OTruyenChapter {
  _id: string;
  comic_name: string;
  chapter_name: string;
  chapter_title: string;
  chapter_path: string;
  chapter_image: Array<{
    image_page: number;
    image_file: string;
  }>;
  updatedAt: string;
}

export interface OTruyenCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
}

export interface OTruyenChapterData {
  filename: string;
  chapter_name: string;
  chapter_title: string;
  updatedAt: string;
}

export interface OTruyenImageData {
  image_page: number;
  image_file: string;
}

export interface TransformedManga {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  status: "ongoing" | "completed" | "hiatus" | "cancelled";
  genres: string[];
  author: string;
  lastUpdated: string;
  views: number;
  rating: number;
  latestChapter: string | null;
  chapters?: TransformedChapter[];
}

export interface TransformedChapter {
  id: string;
  title: string;
  number: number;
  publishedAt: string;
  views: number;
  pages: string[];
}

export interface ReadingHistoryItem {
  mangaId: string;
  mangaTitle: string;
  chapterId: string;
  chapterTitle: string;
  coverUrl: string;
  lastReadAt: string;
  readCount: number;
}

// Helper to ensure status is correct type
function asMangaStatus(
  status: string
): "ongoing" | "completed" | "hiatus" | "cancelled" {
  if (
    status === "ongoing" ||
    status === "completed" ||
    status === "hiatus" ||
    status === "cancelled"
  )
    return status;
  return "ongoing";
}

export const api = {
  // Get home page data
  async getHomeData() {
    try {
      const response = await fetch(`${OTRUYEN_API}/home`);
      const data = await response.json();

      if (data.status === "success") {
        return {
          featured: data.data.items.map(this.transformManga),
          popular: data.data.items.slice(0, 12).map(this.transformManga),
          recent: data.data.items.slice(12, 24).map(this.transformManga),
          completed: data.data.items
            .filter((item: OTruyenManga) => item.status === "completed")
            .map(this.transformManga),
        };
      }

      // Fallback to mock data if API fails
      return this.getMockData();
    } catch (error) {
      console.error("Error fetching home data:", error);
      return this.getMockData();
    }
  },

  // Get manga list by type
  async getMangaList(type: string = "truyen-moi", page: number = 1) {
    try {
      const response = await fetch(
        `${OTRUYEN_API}/danh-sach/${type}?page=${page}`
      );
      const data = await response.json();

      if (data.status === "success") {
        return {
          manga: data.data.items.map(this.transformManga),
          total: data.data.params.pagination.totalItems,
          currentPage: data.data.params.pagination.currentPage,
          totalPages: data.data.params.pagination.totalPages,
        };
      }

      return { manga: [], total: 0, currentPage: 1, totalPages: 1 };
    } catch (error) {
      console.error("Error fetching manga list:", error);
      return { manga: [], total: 0, currentPage: 1, totalPages: 1 };
    }
  },

  // Get categories
  async getCategories() {
    try {
      const response = await fetch(`${OTRUYEN_API}/the-loai`);
      const data = await response.json();

      if (data.status === "success") {
        return data.data.items;
      }

      return [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  },

  // Get manga by category
  async getMangaByCategory(slug: string, page: number = 1) {
    try {
      const response = await fetch(
        `${OTRUYEN_API}/the-loai/${slug}?page=${page}`
      );
      const data = await response.json();

      if (data.status === "success") {
        return {
          manga: data.data.items.map(this.transformManga),
          total: data.data.params.pagination.totalItems,
          currentPage: data.data.params.pagination.currentPage,
          totalPages: data.data.params.pagination.totalPages,
          categoryName: data.data.titlePage,
        };
      }

      return {
        manga: [],
        total: 0,
        currentPage: 1,
        totalPages: 1,
        categoryName: "",
      };
    } catch (error) {
      console.error("Error fetching manga by category:", error);
      return {
        manga: [],
        total: 0,
        currentPage: 1,
        totalPages: 1,
        categoryName: "",
      };
    }
  },

  // Get manga details
  async getMangaById(slug: string) {
    try {
      const response = await fetch(`${OTRUYEN_API}/truyen-tranh/${slug}`);
      const data = await response.json();

      if (data.status === "success") {
        return this.transformMangaDetail(data.data.item);
      }

      return null;
    } catch (error) {
      console.error("Error fetching manga details:", error);
      return null;
    }
  },

  // Search manga
  async searchManga(query: string, page: number = 1) {
    try {
      const response = await fetch(
        `${OTRUYEN_API}/tim-kiem?keyword=${encodeURIComponent(
          query
        )}&page=${page}`
      );
      const data = await response.json();

      if (data.status === "success") {
        return {
          manga: data.data.items.map(this.transformManga),
          total: data.data.params.pagination.totalItems,
          currentPage: data.data.params.pagination.currentPage,
          totalPages: data.data.params.pagination.totalPages,
        };
      }

      return { manga: [], total: 0, currentPage: 1, totalPages: 1 };
    } catch (error) {
      console.error("Error searching manga:", error);
      return { manga: [], total: 0, currentPage: 1, totalPages: 1 };
    }
  },

  // Transform OTruyen manga data to our format
  transformManga: (mangaData: OTruyenManga): TransformedManga => {
    return {
      id: mangaData.slug,
      title: mangaData.name,
      description: mangaData.content?.replace(/<[^>]*>/g, "") || "", // Remove HTML tags
      coverUrl: `https://img.otruyenapi.com/uploads/comics/${mangaData.thumb_url}`,
      status: api.mapStatus(mangaData.status),
      genres: mangaData.category?.map((cat) => cat.name) || [],
      author: mangaData.author?.join(", ") || "Unknown Author",
      lastUpdated: mangaData.updatedAt,
      views: mangaData.view || 0,
      rating: Math.round((Math.random() * 2 + 8) * 10) / 10, // Mock rating since API doesn't provide it
      latestChapter: mangaData.chaptersLatest?.[0]?.chapter_name || null,
    };
  },

  // Transform detailed manga data
  transformMangaDetail: (mangaData: OTruyenManga): TransformedManga => {
    const transformed = api.transformManga(mangaData);

    // Add chapters if available
    if (mangaData.chapters && mangaData.chapters.length > 0) {
      transformed.chapters = mangaData.chapters
        .map((chapter: OTruyenChapterData) => ({
          id: chapter.filename,
          title: chapter.chapter_title || `Chapter ${chapter.chapter_name}`,
          number: parseFloat(chapter.chapter_name) || 0,
          publishedAt: chapter.updatedAt || new Date().toISOString(),
          views: Math.floor(Math.random() * 10000) + 100, // Mock views
          pages: [],
        }))
        .reverse(); // Reverse to show latest first
    }

    return transformed;
  },

  // Map OTruyen status to our format
  mapStatus: (
    status: string
  ): "ongoing" | "completed" | "hiatus" | "cancelled" => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "hoàn thành":
        return "completed";
      case "ongoing":
      case "đang tiến hành":
        return "ongoing";
      case "hiatus":
      case "tạm ngưng":
        return "hiatus";
      default:
        return "ongoing";
    }
  },

  // Get chapter images
  async getChapterImages(slug: string, chapterFilename: string) {
    try {
      const response = await fetch(
        `${OTRUYEN_API}/truyen-tranh/${slug}/${chapterFilename}`
      );
      const data = await response.json();

      if (data.status === "success" && data.data.item.chapter_image) {
        return data.data.item.chapter_image
          .sort(
            (a: OTruyenImageData, b: OTruyenImageData) =>
              a.image_page - b.image_page
          )
          .map(
            (img: OTruyenImageData) =>
              `https://img.otruyenapi.com/uploads/comics/${data.data.item.chapter_path}/${img.image_file}`
          );
      }

      return [];
    } catch (error) {
      console.error("Error fetching chapter images:", error);
      return [];
    }
  },

  // Fallback mock data
  getMockData() {
    const mockManga = Array.from({ length: 24 }, (_, i) => {
      const statusArr = ["ongoing", "completed", "hiatus"] as const;
      const status = asMangaStatus(statusArr[Math.floor(Math.random() * 3)]);
      return {
        id: `manga-${i + 1}`,
        title: [
          "Attack on Titan",
          "One Piece",
          "Naruto",
          "Dragon Ball",
          "Bleach",
          "Death Note",
          "My Hero Academia",
          "Demon Slayer",
          "Tokyo Ghoul",
          "Hunter x Hunter",
          "Fullmetal Alchemist",
          "Jujutsu Kaisen",
          "Chainsaw Man",
          "Spy x Family",
          "Mob Psycho 100",
          "One Punch Man",
          "Black Clover",
          "Fire Force",
          "Dr. Stone",
          "Promised Neverland",
          "Kaguya-sama",
          "Violet Evergarden",
          "Your Name",
          "Weathering With You",
        ][i],
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        coverUrl: `https://images.pexels.com/photos/${
          1000000 + i * 100
        }/pexels-photo-${
          1000000 + i * 100
        }.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop`,
        status,
        genres: [
          "Action",
          "Adventure",
          "Romance",
          "Comedy",
          "Drama",
          "Fantasy",
        ].slice(0, Math.floor(Math.random() * 4) + 2),
        author: "Author Name",
        year: 2020 + Math.floor(Math.random() * 4),
        rating: Math.round((Math.random() * 2 + 8) * 10) / 10,
        lastUpdated: new Date().toISOString(),
        views: Math.floor(Math.random() * 100000) + 1000,
      };
    });

    return {
      featured: mockManga.slice(0, 4),
      popular: mockManga.slice(0, 12),
      recent: mockManga.slice(12, 24),
      completed: mockManga.filter((m) => m.status === "completed").slice(0, 12),
    };
  },

  // Legacy method for backward compatibility
  getMockManga() {
    return this.getMockData().popular;
  },

  // Reading History Management (Frontend only)
  readingHistory: {
    // Get reading history from localStorage
    getHistory(): ReadingHistoryItem[] {
      try {
        const history = localStorage.getItem("reading_history");
        return history ? JSON.parse(history) : [];
      } catch (error) {
        console.error("Error reading history from localStorage:", error);
        return [];
      }
    },

    // Add or update reading history
    addToHistory(
      mangaId: string,
      mangaTitle: string,
      chapterId: string,
      chapterTitle: string,
      coverUrl: string
    ): void {
      try {
        const history = this.getHistory();
        const existingIndex = history.findIndex(
          (item) => item.mangaId === mangaId
        );

        const newItem: ReadingHistoryItem = {
          mangaId,
          mangaTitle,
          chapterId,
          chapterTitle,
          coverUrl,
          lastReadAt: new Date().toISOString(),
          readCount: 1,
        };

        if (existingIndex !== -1) {
          // Update existing item
          newItem.readCount = history[existingIndex].readCount + 1;
          history.splice(existingIndex, 1);
        }

        // Add to beginning of array (most recent first)
        history.unshift(newItem);

        // Keep only last 50 items
        if (history.length > 50) {
          history.splice(50);
        }

        localStorage.setItem("reading_history", JSON.stringify(history));
      } catch (error) {
        console.error("Error saving reading history:", error);
      }
    },

    // Remove item from history
    removeFromHistory(mangaId: string): void {
      try {
        const history = this.getHistory();
        const filteredHistory = history.filter(
          (item) => item.mangaId !== mangaId
        );
        localStorage.setItem(
          "reading_history",
          JSON.stringify(filteredHistory)
        );
      } catch (error) {
        console.error("Error removing from reading history:", error);
      }
    },

    // Clear all history
    clearHistory(): void {
      try {
        localStorage.removeItem("reading_history");
      } catch (error) {
        console.error("Error clearing reading history:", error);
      }
    },

    // Get reading progress for a specific manga
    getReadingProgress(mangaId: string): ReadingHistoryItem | null {
      const history = this.getHistory();
      return history.find((item) => item.mangaId === mangaId) || null;
    },

    // Get recent reads (last 10 items)
    getRecentReads(): ReadingHistoryItem[] {
      const history = this.getHistory();
      return history.slice(0, 10);
    },
  },
};
