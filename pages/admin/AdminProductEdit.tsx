
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { products, categories, brands } from '../../data/products';
import { Product } from '../../types';
import UploadIcon from '../../components/icons/UploadIcon';
import XMarkIcon from '../../components/icons/XMarkIcon';

const AdminProductEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [product, setProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    originalPrice: undefined,
    description: '',
    category: categories[0].name,
    brand: brands[0],
    stock: 0,
    images: [],
    sku: '',
    material: '',
    gender: 'Female',
    pattern: '',
    status: 'Active',
  });
  
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const existingProduct = products.find(p => p.id === Number(id));
      if (existingProduct) {
        setProduct(existingProduct);
        setImagePreviews(existingProduct.images);
      } else {
        navigate('/admin/products');
      }
    }
  }, [id, isEditing, navigate]);
  
  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
        imagePreviews.forEach(url => {
            if (url.startsWith('blob:')) {
                URL.revokeObjectURL(url);
            }
        });
    };
  }, [imagePreviews]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numFields = ['price', 'originalPrice', 'stock'];
    
    if (name === 'originalPrice' && value === '') {
        setProduct(prev => ({ ...prev, originalPrice: undefined }));
        return;
    }

    setProduct(prev => ({ ...prev, [name]: numFields.includes(name) ? Number(value) : value }));
  };
  
  const handleFileChange = (files: FileList | null) => {
    if (files) {
        const newImageUrls = Array.from(files).map(file => URL.createObjectURL(file));
        const combinedImages = [...imagePreviews, ...newImageUrls];
        setImagePreviews(combinedImages);
        setProduct(prev => ({ ...prev, images: combinedImages }));
    }
  };
  
  const handleRemoveImage = (indexToRemove: number) => {
    const imageUrl = imagePreviews[indexToRemove];
    if (imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imageUrl);
    }
    const newImagePreviews = imagePreviews.filter((_, index) => index !== indexToRemove);
    setImagePreviews(newImagePreviews);
    setProduct(prev => ({ ...prev, images: newImagePreviews }));
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
     if (!product.images || product.images.length === 0) {
        alert('Please upload at least one image.');
        return;
    }
    if (isEditing) {
      alert(`Simulating update for product: ${product.name}`);
    } else {
      alert(`Simulating creation of new product: ${product.name}`);
    }
    navigate('/admin/products');
  };
  
  const inputClasses = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-base p-3 border-2";

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
      
      <form onSubmit={handleSubmit} className="mt-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
            <input type="text" name="name" id="name" value={product.name || ''} onChange={handleChange} className={inputClasses} required />
          </div>
          
           <div className="sm:col-span-2">
            <label htmlFor="sku" className="block text-sm font-medium text-gray-700">SKU</label>
            <input type="text" name="sku" id="sku" value={product.sku || ''} onChange={handleChange} className={inputClasses} required />
          </div>
          
          <div className="sm:col-span-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea id="description" name="description" rows={4} value={product.description || ''} onChange={handleChange} className={inputClasses} required />
          </div>
          
          <div className="sm:col-span-6">
            <label className="block text-sm font-medium text-gray-700">Images</label>
            <div 
                className={`mt-2 flex justify-center rounded-md border-2 border-dashed px-6 pt-5 pb-6 transition-colors ${isDragging ? 'border-accent bg-accent/10' : 'border-gray-300'}`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
              <div className="space-y-1 text-center">
                <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-medium text-accent hover:text-accent-hover focus-within:outline-none">
                    <span>Upload files</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={(e) => handleFileChange(e.target.files)} accept="image/*" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
            {imagePreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
                    {imagePreviews.map((img, index) => (
                        <div key={index} className="relative aspect-square">
                           <img src={img} alt="Selected product" className="w-full h-full object-cover rounded-md shadow-md" />
                           <button 
                             type="button" 
                             onClick={() => handleRemoveImage(index)}
                             className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600"
                             aria-label="Remove image"
                           >
                                <XMarkIcon className="w-4 h-4" />
                           </button>
                        </div>
                    ))}
                </div>
            )}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
            <input type="number" name="price" id="price" value={product.price || ''} onChange={handleChange} className={inputClasses} step="0.01" min="0" required />
          </div>

          <div className="sm:col-span-2">
            <div>
              <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700">Discount Price (Original)</label>
              <span className="text-xs text-gray-500">Optional</span>
            </div>
            <input type="number" name="originalPrice" id="originalPrice" value={product.originalPrice || ''} onChange={handleChange} className={inputClasses} step="0.01" min="0" />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock Quantity</label>
            <input type="number" name="stock" id="stock" value={product.stock ?? 0} onChange={handleChange} className={inputClasses} min="0" required />
          </div>
          
          <div className="sm:col-span-2">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <select id="category" name="category" value={product.category} onChange={handleChange} className={inputClasses} required>
              {categories.map(c => <option key={c.name}>{c.name}</option>)}
            </select>
          </div>
          
          <div className="sm:col-span-2">
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
             <select id="brand" name="brand" value={product.brand} onChange={handleChange} className={inputClasses} required>
              {brands.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          
          <div className="sm:col-span-2">
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
             <select id="gender" name="gender" value={product.gender} onChange={handleChange} className={inputClasses} required>
              <option>Female</option>
              <option>Male</option>
              <option>Unisex</option>
            </select>
          </div>

           <div className="sm:col-span-2">
            <label htmlFor="material" className="block text-sm font-medium text-gray-700">Material</label>
            <input type="text" name="material" id="material" value={product.material || ''} onChange={handleChange} className={inputClasses} />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="pattern" className="block text-sm font-medium text-gray-700">Pattern</label>
            <input type="text" name="pattern" id="pattern" value={product.pattern || ''} onChange={handleChange} className={inputClasses} />
          </div>

           <div className="sm:col-span-2">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
             <select id="status" name="status" value={product.status} onChange={handleChange} className={inputClasses} required>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

        </div>

        <div className="mt-8 flex justify-end">
            <Link to="/admin/products" className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                Cancel
            </Link>
          <button
            type="submit"
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-accent py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-accent-hover"
          >
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductEdit;