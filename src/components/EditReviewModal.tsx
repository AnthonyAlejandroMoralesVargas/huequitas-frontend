import { Star, Upload, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { updateReview } from '../services/api';
import { Review } from '../types';

interface EditReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  review: Review | null;
}

export default function EditReviewModal({ isOpen, onClose, onSuccess, review }: EditReviewModalProps) {
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
    image: '' as string,
  });
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && review) {
      setFormData({
        rating: review.rating,
        comment: review.comment || '',
        image: review.image || '',
      });
      setPreviewImage(review.image || null);
    }
  }, [isOpen, review]);

  if (!isOpen || !review) return null;

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setFormData({ ...formData, image: base64 });
        setPreviewImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: '' });
    setPreviewImage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateReview(
        review._id,
        formData.rating,
        formData.comment,
        formData.image
      );

      onSuccess();
      onClose();
      setFormData({
        rating: 5,
        comment: '',
        image: '',
      });
      setPreviewImage(null);
    } catch (error) {
      console.error('Error updating review:', error);
      alert('Error updating review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-6 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-2xl font-bold text-white">Edit Review</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-all"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Rating Stars */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="transition-all transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= formData.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Comment</label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              placeholder="Share your experience..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
              rows={4}
              disabled={loading}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Photo (Optional)
            </label>

            {previewImage && (
              <div className="relative mb-4">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-48 object-contain rounded-lg bg-gray-50"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all"
                  disabled={loading}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-orange-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all cursor-pointer">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-orange-500" />
                <span className="text-orange-600 font-medium">
                  {previewImage ? 'Change Photo' : 'Upload Photo'}
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                disabled={loading}
              />
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
