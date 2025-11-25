"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Plus, Trash2, Image as ImageIcon, MapPin, FileText, Download, Upload, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useStore } from "@/store/store";

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GalleryModal({ isOpen, onClose }: GalleryModalProps) {
  const { gallery, addGalleryItem, deleteGalleryItem, isAdmin } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageName, setNewImageName] = useState("");
  const [newLocationLink, setNewLocationLink] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setShowAddForm(false);
      setNewImageUrl("");
      setNewImageName("");
      setNewLocationLink("");
      setSelectedFile(null);
      setImagePreview("");
    }
  }, [isOpen]);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type - support semua format gambar termasuk JPEG/JPG
    const validImageTypes = [
      "image/jpeg",
      "image/jpg", // Beberapa browser menggunakan ini
      "image/png",
      "image/gif",
      "image/webp",
      "image/heic",
      "image/heif",
      "image/bmp",
      "image/tiff",
    ];
    
    // Check by MIME type
    const isValidMimeType = file.type && validImageTypes.includes(file.type.toLowerCase());
    
    // Check by file extension (fallback jika MIME type tidak terdeteksi)
    const fileName = file.name.toLowerCase();
    const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".heic", ".heif", ".bmp", ".tiff"];
    const isValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
    
    if (!isValidMimeType && !isValidExtension) {
      alert(`File harus berupa gambar!\n\nFormat yang didukung: JPG, JPEG, PNG, GIF, WebP, HEIC, BMP, TIFF\n\nFile Anda: ${file.name} (${file.type || "tipe tidak terdeteksi"})`);
      return;
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      alert(`Ukuran file terlalu besar! File: ${fileSizeMB}MB, Maksimal: 50MB`);
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.onerror = () => {
      alert("Gagal membaca file. Pastikan file tidak rusak.");
    };
    reader.readAsDataURL(file);
  };

  // Upload image ke ImgBB (gratis, support file besar hingga 32MB)
  // ImgBB API key bisa didapat gratis di https://api.imgbb.com/
  const uploadImageToImgBB = async (file: File): Promise<string> => {
    // ImgBB API (gratis, tidak perlu API key untuk basic usage)
    // Tapi lebih baik pakai API key untuk reliability
    const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "";
    
    // Jika tidak ada API key, gunakan base64 sebagai fallback (untuk file kecil < 5MB)
    if (!IMGBB_API_KEY && file.size > 5 * 1024 * 1024) {
      throw new Error("File terlalu besar untuk base64. Silakan set NEXT_PUBLIC_IMGBB_API_KEY di environment variables untuk upload file besar.");
    }

    // Jika ada API key, gunakan ImgBB
    if (IMGBB_API_KEY) {
      try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error?.message || `Upload gagal: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success && data.data) {
          // Gunakan URL langsung ke file gambar (bukan halaman ImgBB)
          return (
            data.data.image?.url || // Direct file URL
            data.data.display_url || // Display URL
            data.data.url // Fallback ke halaman (kurang ideal)
          );
        } else {
          throw new Error("Upload gagal: URL tidak ditemukan");
        }
      } catch (error) {
        console.error("ImgBB upload error:", error);
        // Fallback ke base64 jika ImgBB gagal dan file kecil
        if (file.size <= 5 * 1024 * 1024) {
          console.log("Falling back to base64...");
          return uploadToBase64(file);
        }
        throw error;
      }
    }

    // Fallback: base64 untuk file kecil (< 5MB)
    if (file.size <= 5 * 1024 * 1024) {
      return uploadToBase64(file);
    }

    throw new Error("File terlalu besar. Silakan set NEXT_PUBLIC_IMGBB_API_KEY untuk upload file besar.");
  };

  // Upload ke base64 (untuk file kecil)
  const uploadToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };
      reader.onerror = () => {
        reject(new Error("Gagal membaca file"));
      };
      reader.readAsDataURL(file);
    });
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isOpen, currentIndex, gallery.length]);

  const handleNext = () => {
    if (gallery.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % gallery.length);
  };

  const handlePrevious = () => {
    if (gallery.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newImageName.trim()) {
      alert("Nama gambar harus diisi!");
      return;
    }

    // Jika ada file yang dipilih, upload dulu
    if (selectedFile) {
      setIsUploading(true);
      try {
        const imageUrl = await uploadImageToImgBB(selectedFile);
        
        addGalleryItem({
          imageUrl: imageUrl,
          name: newImageName.trim(),
          locationLink: newLocationLink.trim() || undefined,
        });

        // Reset form
        setNewImageUrl("");
        setNewImageName("");
        setNewLocationLink("");
        setSelectedFile(null);
        setImagePreview("");
        setShowAddForm(false);
        setIsUploading(false);
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        
        // Set current index ke gambar baru
        setCurrentIndex(gallery.length);
      } catch (error) {
        console.error("Upload error:", error);
        const errorMessage = error instanceof Error ? error.message : "Gagal mengupload gambar";
        alert(`Upload gagal: ${errorMessage}\n\nTips:\n- Pastikan file tidak lebih dari 50MB\n- Coba gunakan format JPG/PNG\n- Atau gunakan URL gambar sebagai alternatif`);
        setIsUploading(false);
      }
    } else if (newImageUrl.trim()) {
      // Jika menggunakan URL
      addGalleryItem({
        imageUrl: newImageUrl.trim(),
        name: newImageName.trim(),
        locationLink: newLocationLink.trim() || undefined,
      });

      // Reset form
      setNewImageUrl("");
      setNewImageName("");
      setNewLocationLink("");
      setShowAddForm(false);
      
      // Set current index ke gambar baru
      setCurrentIndex(gallery.length);
    } else {
      alert("Pilih file gambar atau masukkan URL gambar!");
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Yakin ingin menghapus gambar ini?")) {
      deleteGalleryItem(id);
      if (currentIndex >= gallery.length - 1 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }
  };

  const handleDownload = async () => {
    if (!currentImage) return;

    try {
      // Fetch image as blob
      const response = await fetch(currentImage.imageUrl);
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      
      // Get file extension from URL or default to jpg
      const urlParts = currentImage.imageUrl.split(".");
      const extension = urlParts.length > 1 ? urlParts[urlParts.length - 1].split("?")[0] : "jpg";
      
      // Create filename from image name (sanitize for filename)
      const sanitizedName = currentImage.name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      link.download = `${sanitizedName}.${extension}`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
      alert("Gagal mendownload gambar. Coba lagi atau gunakan klik kanan > Save Image.");
    }
  };

  const currentImage = gallery[currentIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 dark:bg-black/90 z-50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full h-[90vh] md:h-auto md:max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header - Sticky */}
              <div className="flex items-center justify-between p-3 md:p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 sticky top-0 bg-white dark:bg-gray-800 z-10">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    Gallery
                  </h2>
                  {gallery.length > 0 && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({currentIndex + 1} / {gallery.length})
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <button
                      onClick={() => setShowAddForm(!showAddForm)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                      title="Tambah Gambar"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Add Form (Admin Only) */}
              {isAdmin && showAddForm && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-b border-gray-200 dark:border-gray-700 overflow-y-auto max-h-[55vh] md:max-h-[60vh] flex-shrink-0"
                >
                  <form onSubmit={handleAddImage} className="p-3 md:p-4 space-y-2 md:space-y-3 bg-gray-50 dark:bg-gray-900/50 pb-20">
                    {/* Upload File */}
                    <div>
                      <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Upload Gambar dari Device
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/heic,image/heif,image/bmp,image/tiff,.jpg,.jpeg,.png,.gif,.webp,.heic,.heif,.bmp,.tiff"
                          onChange={handleFileSelect}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="flex-1 px-3 md:px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-red-500 dark:hover:border-red-400 transition-all bg-white dark:bg-gray-700 flex items-center justify-center gap-2"
                        >
                          <Upload className="w-4 h-4 md:w-5 md:h-5 text-gray-500 dark:text-gray-400" />
                          <span className="text-xs md:text-sm text-gray-600 dark:text-gray-300 truncate">
                            {selectedFile ? selectedFile.name : "Pilih Gambar"}
                          </span>
                        </label>
                        {selectedFile && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFile(null);
                              setImagePreview("");
                              if (fileInputRef.current) {
                                fileInputRef.current.value = "";
                              }
                            }}
                            className="px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      {imagePreview && (
                        <div className="mt-2">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="max-w-full max-h-24 md:max-h-32 object-contain rounded-lg border border-gray-200 dark:border-gray-600"
                          />
                        </div>
                      )}
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Maksimal 50MB. Format: JPG, JPEG, PNG, GIF, WebP, HEIC, BMP, TIFF. Foto langsung dari kamera didukung.
                      </p>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-2 my-1">
                      <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">ATAU</span>
                      <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                    </div>

                    {/* URL Input (Alternative) */}
                    <div>
                      <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        URL Gambar (Alternatif)
                      </label>
                      <input
                        type="url"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        disabled={!!selectedFile}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      {selectedFile && (
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Hapus file untuk menggunakan URL
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Nama/Deskripsi <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newImageName}
                        onChange={(e) => setNewImageName(e.target.value)}
                        placeholder="Contoh: Karakter Kopi 24-2-2025"
                        required
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Link Lokasi (Opsional)
                      </label>
                      <input
                        type="url"
                        value={newLocationLink}
                        onChange={(e) => setNewLocationLink(e.target.value)}
                        placeholder="https://maps.google.com/..."
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent"
                      />
                    </div>
                    <div className="flex gap-2 pt-3 sticky bottom-0 bg-gradient-to-t from-gray-50 to-transparent dark:from-gray-900/50 dark:to-transparent pb-2 -mx-3 md:-mx-4 px-3 md:px-4 z-10">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddForm(false);
                          setNewImageUrl("");
                          setNewImageName("");
                          setNewLocationLink("");
                          setSelectedFile(null);
                          setImagePreview("");
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                        disabled={isUploading}
                        className="flex-1 px-3 md:px-4 py-2.5 md:py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base shadow-sm"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={isUploading || (!selectedFile && !newImageUrl.trim())}
                        className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed py-2.5 md:py-3 text-sm md:text-base shadow-sm"
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="hidden md:inline">Mengupload...</span>
                            <span className="md:hidden">Upload...</span>
                          </>
                        ) : (
                          <>
                            <span className="hidden md:inline">Tambah Gambar</span>
                            <span className="md:hidden">Tambah</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Gallery Content */}
              <div className="flex-1 flex flex-col overflow-hidden relative min-h-0">
                {gallery.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <ImageIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-lg font-semibold mb-2">
                      Belum ada gambar
                    </p>
                    {isAdmin ? (
                      <p className="text-sm text-gray-400 dark:text-gray-500">
                        Klik tombol + untuk menambah gambar
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400 dark:text-gray-500">
                        Admin akan menambahkan gambar segera
                      </p>
                    )}
                  </div>
                ) : (
                  <>
                    {/* Image Display */}
                    <div className="relative flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-900 min-h-0 overflow-hidden">
                      <motion.img
                        key={currentImage.id}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        src={currentImage.imageUrl}
                        alt={currentImage.name}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        className="max-w-full max-h-full object-contain p-2"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23ddd' width='400' height='300'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='20' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EGambar tidak dapat dimuat%3C/text%3E%3C/svg%3E";
                        }}
                      />

                      {/* Navigation Arrows */}
                      {gallery.length > 1 && (
                        <>
                          <button
                            onClick={handlePrevious}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all text-gray-700 dark:text-gray-200"
                            title="Gambar Sebelumnya (←)"
                          >
                            <ChevronLeft className="w-6 h-6" />
                          </button>
                          <button
                            onClick={handleNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all text-gray-700 dark:text-gray-200"
                            title="Gambar Selanjutnya (→)"
                          >
                            <ChevronRight className="w-6 h-6" />
                          </button>
                        </>
                      )}

                      {/* Action Buttons */}
                      <div className="absolute top-4 right-4 flex gap-2">
                        {/* Download Button (All Users) */}
                        <button
                          onClick={handleDownload}
                          className="p-3 bg-blue-500/90 dark:bg-blue-600/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-all text-white"
                          title="Download Gambar"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                        
                        {/* Delete Button (Admin Only) */}
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(currentImage.id)}
                            className="p-3 bg-red-500/90 dark:bg-red-600/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-red-600 dark:hover:bg-red-700 transition-all text-white"
                            title="Hapus Gambar"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Image Info - Always Visible */}
                    <div className="p-3 md:p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm md:text-base text-gray-800 dark:text-gray-100 mb-2 break-words">
                            {currentImage.name}
                          </h3>
                          {currentImage.locationLink && (
                            <a
                              href={currentImage.locationLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:underline transition-colors font-medium"
                            >
                              <MapPin className="w-4 h-4 flex-shrink-0" />
                              <span>Lihat Lokasi di Maps</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Thumbnail Navigation */}
                    {gallery.length > 1 && (
                      <div className="p-2 md:p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 overflow-x-auto flex-shrink-0">
                        <div className="flex gap-2 justify-center">
                          {gallery.map((item, index) => (
                            <button
                              key={item.id}
                              onClick={() => setCurrentIndex(index)}
                              className={`flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 transition-all object-cover ${
                                index === currentIndex
                                  ? "border-red-500 dark:border-red-400 ring-2 ring-red-500/50 dark:ring-red-500/50"
                                  : "border-gray-300 dark:border-gray-600 opacity-60 hover:opacity-100"
                              }`}
                            >
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                loading="lazy"
                                decoding="async"
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect fill='%23ddd' width='64' height='64'/%3E%3C/svg%3E";
                                }}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

