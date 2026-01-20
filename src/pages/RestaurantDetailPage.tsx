import { ArrowLeft, Heart, MessageCircle, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ReviewModal from '../components/ReviewModal';
import { getLikeStatus, getRestaurantById, getReviewsByRestaurant, toggleLike } from '../services/api';
import { Restaurant, Review } from '../types';

export default function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  useEffect(() => {
    loadRestaurantData();
  }, [id]);

  const loadRestaurantData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const restaurantData = await getRestaurantById(id);
      setRestaurant(restaurantData);
      
      const reviewsData = await getReviewsByRestaurant(id);
      setReviews(reviewsData);

      // Load like status
      try {
        const likeStatus = await getLikeStatus(id);
        setLiked(likeStatus.liked);
      } catch (error) {
        console.error('Error loading like status:', error);
      }
    } catch (error) {
      console.error('Error loading restaurant:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLike = async () => {
    if (!id) return;
    setLikeLoading(true);
    try {
      const result = await toggleLike(id);
      setLiked(result.liked);
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleReviewSuccess = () => {
    loadRestaurantData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-600 text-lg">Restaurante no encontrado</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver atrás
        </button>

        {/* Restaurant Header */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8">
          {/* Image */}
          <div className="relative h-96 overflow-hidden">
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            
            {/* Restaurant Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-orange-200 text-sm font-semibold mb-2">{restaurant.cuisine}</p>
                  <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
                </div>
                <button
                  onClick={handleToggleLike}
                  disabled={likeLoading}
                  className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/30 transition disabled:opacity-50"
                >
                  <Heart
                    className={`w-6 h-6 transition ${
                      liked ? 'fill-red-500 text-red-500' : 'text-white'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Restaurant Details */}
          <div className="p-8">
            <div className="grid grid-cols-3 gap-6 mb-8 pb-8 border-b border-gray-200">
              {/* Rating */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  <span className="text-3xl font-bold text-gray-800">
                    {restaurant.rating?.toFixed(1) || '0.0'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">
                  {restaurant.totalRatings || 0} reseñas
                </p>
              </div>

              {/* Address */}
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-2">Dirección</p>
                <p className="text-gray-800 font-semibold">{restaurant.address || 'N/A'}</p>
              </div>

              {/* Reviews Button */}
              <div className="text-center">
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-600 transition shadow-lg"
                >
                  <MessageCircle className="w-5 h-5" />
                  Escribir reseña
                </button>
              </div>
            </div>

            {/* Description */}
            {restaurant.description && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-3">Descripción</h2>
                <p className="text-gray-600 leading-relaxed">{restaurant.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Reseñas ({reviews.length})
          </h2>

          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-6">
                Aún no hay reseñas. ¡Sé el primero en compartir tu experiencia!
              </p>
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-600 transition shadow-lg"
              >
                Escribir la primera reseña
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="border border-gray-200 rounded-xl p-6 hover:border-orange-300 transition"
                >
                  {/* Review Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-800">{review.userName}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1.5 rounded-full">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-yellow-700">{review.rating}</span>
                    </div>
                  </div>

                  {/* Review Comment */}
                  <p className="text-gray-700 leading-relaxed">{review.comment || 'Sin comentarios'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSuccess={handleReviewSuccess}
        restaurantId={id}
      />
    </div>
  );
}
