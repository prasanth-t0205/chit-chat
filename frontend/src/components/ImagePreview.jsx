import { useState } from "react";
import { Download, X, ZoomIn, ZoomOut, RotateCcw, Share2 } from "lucide-react";

const ImagePreview = ({ image, onClose }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleDownload = async () => {
    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => {
    setScale((prev) => {
      const newScale = Math.max(prev - 0.5, 1);
      if (newScale === 1) setPosition({ x: 0, y: 0 });
      return newScale;
    });
  };

  const handleMouseDown = (e) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="fixed inset-0 bg-base-100 z-50 flex flex-col">
      {/* Modern Header with responsive design */}
      <div className="flex items-center justify-between px-2 sm:px-4 md:px-6 py-2 sm:py-3 bg-base-200 border-b border-base-300">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle hover:bg-base-300"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-base-content" />
          </button>
          <span className="hidden sm:inline text-base-content/70 text-sm">
            Image Preview
          </span>
        </div>

        {/* Responsive controls */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
          <div className="bg-base-300/50 rounded-full p-1 flex items-center gap-1">
            <button
              onClick={handleZoomIn}
              className="btn btn-ghost btn-sm btn-circle hover:bg-base-300"
            >
              <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5 text-base-content" />
            </button>
            <button
              onClick={handleZoomOut}
              className="btn btn-ghost btn-sm btn-circle hover:bg-base-300"
            >
              <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5 text-base-content" />
            </button>
          </div>

          <div className="bg-base-300/50 rounded-full p-1 flex items-center gap-1">
            <button className="btn btn-ghost btn-sm btn-circle hover:bg-base-300">
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 text-base-content" />
            </button>
            <button className="btn btn-ghost btn-sm btn-circle hover:bg-base-300">
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-base-content" />
            </button>
            <button
              onClick={handleDownload}
              className="btn btn-ghost btn-sm btn-circle hover:bg-base-300"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5 text-base-content" />
            </button>
          </div>
        </div>
      </div>

      {/* Responsive image container */}
      <div
        className="flex-1 overflow-hidden bg-base-200/50"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="w-full h-full flex items-center justify-center p-2 sm:p-4"
          style={{
            cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "default",
          }}
        >
          <img
            src={image}
            alt="Preview"
            className="max-w-full max-h-[calc(100vh-64px)] sm:max-h-[calc(100vh-80px)] object-contain select-none transition-transform duration-200"
            style={{
              transform: `scale(${scale}) translate(${position.x / scale}px, ${
                position.y / scale
              }px)`,
              pointerEvents: scale > 1 ? "none" : "auto",
            }}
            draggable="false"
          />
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;
