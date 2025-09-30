import React, { useState, useEffect } from 'react';
import { allProductImageUrls } from '../../data/products';
import XMarkIcon from '../icons/XMarkIcon';
import CheckIcon from '../icons/CheckIcon';

interface ImageGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImages: (images: string[]) => void;
  selectedImages: string[];
}

const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({ isOpen, onClose, onSelectImages, selectedImages }) => {
  const [localSelectedImages, setLocalSelectedImages] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setLocalSelectedImages(selectedImages);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, selectedImages]);

  const handleToggleSelection = (imageUrl: string) => {
    setLocalSelectedImages(prev =>
      prev.includes(imageUrl) ? prev.filter(img => img !== imageUrl) : [...prev, imageUrl]
    );
  };

  const handleSave = () => {
    onSelectImages(localSelectedImages);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 opacity-100"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-4xl m-4 rounded-lg shadow-xl transform transition-transform duration-300 scale-100">
        <div className="p-6 flex flex-col h-[80vh]">
          <div className="flex justify-between items-center mb-4">
             <h2 id="modal-title" className="text-xl font-semibold text-gray-900">Image Gallery</h2>
            <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close"
            >
                <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex-grow overflow-y-auto pr-2">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {allProductImageUrls.map(url => {
                const isSelected = localSelectedImages.includes(url);
                return (
                  <div key={url} className="relative aspect-square cursor-pointer group" onClick={() => handleToggleSelection(url)}>
                    <img src={url} alt="Gallery item" className={`w-full h-full object-cover rounded-md transition-all ${isSelected ? 'ring-4 ring-accent' : 'ring-2 ring-transparent'}`} />
                     <div className={`absolute inset-0 bg-black transition-opacity rounded-md ${isSelected ? 'bg-opacity-30' : 'bg-opacity-0 group-hover:bg-opacity-20'}`} />
                     {isSelected && (
                         <div className="absolute top-2 right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center text-white">
                             <CheckIcon className="w-4 h-4" />
                         </div>
                     )}
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="mt-6 flex justify-end border-t pt-4">
            <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
                Cancel
            </button>
            <button
                type="button"
                onClick={handleSave}
                className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-accent py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-accent-hover"
            >
                Save Selections
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGalleryModal;
