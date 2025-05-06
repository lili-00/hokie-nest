import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Bed,
  Bath,
  Square,
  MapPin,
  Train,
  Bus,
  Bike,
  Car,
  Check,
  Star,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Edit2,
  Trash2
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Database } from '../types/supabase';

type Property = Database['public']['Tables']['properties']['Row'];
type Review = Database['public']['Tables']['reviews']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

export default function PropertyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewInput, setReviewInput] = useState({
    rating: 5,
    comment: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!id) throw new Error('Property ID is required');

        // Fetch property details
        const { data: propertyData, error: propertyError } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single();

        if (propertyError) throw propertyError;
        setProperty(propertyData);

        // Fetch reviews
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('*')
          .eq('property_id', id)
          .order('created_at', { ascending: false });

        if (reviewsError) throw reviewsError;
        setReviews(reviewsData || []);

        // Fetch user profile if logged in
        if (user) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profileError) throw profileError;
          setUserProfile(profileData);

          // Check if user has already reviewed this property
          const existingReview = reviewsData?.find(review => review.user_id === user.id);
          if (existingReview) {
            setUserReview(existingReview);
            setReviewInput({
              rating: existingReview.rating || 5,
              comment: existingReview.comment
            });
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, user]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !property || !userProfile) return;

    setIsSubmitting(true);
    try {
      if (userReview) {
        // Update existing review
        const { error } = await supabase
          .from('reviews')
          .update({
            rating: reviewInput.rating,
            comment: reviewInput.comment,
            updated_at: new Date().toISOString()
          })
          .eq('id', userReview.id);

        if (error) throw error;
      } else {
        // Create new review
        const { error } = await supabase
          .from('reviews')
          .insert([
            {
              property_id: property.id,
              user_id: user.id,
              rating: reviewInput.rating,
              comment: reviewInput.comment,
              reviewer_name: userProfile.full_name,
            },
          ]);

        if (error) throw error;
      }

      // Refresh reviews
      const { data: newReviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .eq('property_id', id)
        .order('created_at', { ascending: false });

      if (reviewsError) throw reviewsError;
      setReviews(newReviews || []);

      // Update user review state
      const updatedUserReview = newReviews?.find(review => review.user_id === user.id) || null;
      setUserReview(updatedUserReview);
      setIsEditing(false);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!userReview || !user) return;

    if (!confirm('Are you sure you want to delete your review? This cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', userReview.id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Refresh reviews list and reset user review state
      const { data: newReviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .eq('property_id', id)
        .order('created_at', { ascending: false });

      if (reviewsError) throw reviewsError;
      setReviews(newReviews || []);
      setUserReview(null);
      setReviewInput({ rating: 5, comment: '' });
      setIsEditing(false);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete review');
    }
  };

  const nextImage = () => {
    if (!property?.images) return;
    setCurrentImageIndex((prev) => (prev + 1) % property.images!.length);
  };

  const prevImage = () => {
    if (!property?.images) return;
    setCurrentImageIndex((prev) => (prev - 1 + property.images!.length) % property.images!.length);
  };

  const canReview = user && userProfile?.role === 'tenant';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error || 'Property not found'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link to="/properties" className="text-primary hover:text-primary-hover flex items-center">
          <ChevronLeft className="h-5 w-5" />
          <span>Back to Properties</span>
        </Link>
      </div>

      {/* Image Gallery */}
      <div className="relative h-[500px] mb-8 rounded-lg overflow-hidden">
        {property.images && property.images.length > 0 && (
          <>
            <img
              src={property.images[currentImageIndex]}
              alt={`${property.title} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
            {property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {property.images.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-2 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{property.title}</h1>
            <div className="flex items-center text-gray-600 mb-4">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{property.address}</span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="flex items-center text-gray-600">
                <Bed className="h-5 w-5 mr-2" />
                <span>{property.bedrooms} Beds</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Bath className="h-5 w-5 mr-2" />
                <span>{property.bathrooms} Baths</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Square className="h-5 w-5 mr-2" />
                <span>{property.square_feet} sqft</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-gray-600 whitespace-pre-line">{property.description}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 gap-4">
              {property.amenities?.map((amenity, index) => (
                <div key={index} className="flex items-center text-gray-600">
                  <Check className="h-5 w-5 text-primary mr-2" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Transportation</h2>
            <div className="grid gap-4">
              {property.transportation?.metro && (
                <div className="flex items-center text-gray-600">
                  <Train className="h-5 w-5 mr-2" />
                  <span>{property.transportation.metro}</span>
                </div>
              )}
              {property.transportation?.bus && (
                <div className="flex items-center text-gray-600">
                  <Bus className="h-5 w-5 mr-2" />
                  <span>{property.transportation.bus}</span>
                </div>
              )}
              {property.transportation?.bike && (
                <div className="flex items-center text-gray-600">
                  <Bike className="h-5 w-5 mr-2" />
                  <span>{property.transportation.bike}</span>
                </div>
              )}
              {property.transportation?.parking && (
                <div className="flex items-center text-gray-600">
                  <Car className="h-5 w-5 mr-2" />
                  <span>{property.transportation.parking}</span>
                </div>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Reviews</h2>
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-gray-700">{reviews.length} reviews</span>
              </div>
            </div>

            {/* Review Form or User's Existing Review */}
            {canReview ? (
              userReview && !isEditing ? (
                <div className="bg-gray-100 border border-gray-300 rounded-md p-4 mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800">Your Review</h4>
                    <div className="flex items-center space-x-3">
                       <button
                        onClick={() => setIsEditing(true)}
                        className="text-primary hover:text-primary-hover flex items-center text-sm font-medium"
                        aria-label="Edit review"
                       >
                         <Edit2 className="h-4 w-4 mr-1" /> Edit
                       </button>
                       <button
                         onClick={handleDeleteReview}
                         className="text-red-600 hover:text-red-800 flex items-center text-sm font-medium"
                         aria-label="Delete review"
                       >
                         <Trash2 className="h-4 w-4 mr-1" /> Delete
                       </button>
                    </div>
                  </div>
                  <div className="flex items-center mb-2">
                    {Array.from({ length: userReview.rating || 0 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-secondary" fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-gray-800 whitespace-pre-wrap">{userReview.comment}</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="mb-8">
                  <h4 className="text-lg font-semibold mb-4 text-gray-800">
                    {isEditing ? 'Edit Your Review' : 'Write a Review'}
                  </h4>
                  <div className="mb-4">
                    <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                      Rating
                    </label>
                    <select
                      id="rating"
                      value={reviewInput.rating}
                      onChange={(e) => setReviewInput(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm text-gray-900"
                    >
                      {[5, 4, 3, 2, 1].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'star' : 'stars'}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Review
                    </label>
                    <textarea
                      id="comment"
                      rows={4}
                      value={reviewInput.comment}
                      onChange={(e) => setReviewInput(prev => ({ ...prev, comment: e.target.value }))}
                      placeholder="Share your experience..."
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm placeholder-gray-500 text-gray-900"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-3 mt-4">
                     {isEditing && (
                       <button
                         type="button"
                         onClick={() => {
                           setIsEditing(false);
                           setReviewInput({
                             rating: userReview?.rating || 5,
                             comment: userReview?.comment || ''
                           });
                         }}
                         className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md"
                       >
                         Cancel
                       </button>
                     )}
                     <button
                       type="submit"
                       disabled={isSubmitting}
                       className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                     >
                       {isSubmitting ? 'Submitting...' : (isEditing ? 'Update Review' : 'Submit Review')}
                     </button>
                   </div>
                 </form>
              )
            ) : user ? (
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-8">
                <p className="text-gray-600 text-sm">Only tenants can leave reviews for properties.</p>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-8">
                <p className="text-gray-600 text-sm">
                  Please{' '}
                  <Link to="/login" className="text-primary hover:text-primary-hover">
                    log in
                  </Link>{' '}
                  to leave a review.
                </p>
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
              {reviews
                .filter(review => !userReview || review.id !== userReview.id)
                .map((review) => (
                <div key={review.id} className="border-b border-gray-300 pb-6 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-gray-800">{review.reviewer_name}</div>
                    <div className="flex items-center">
                      {Array.from({ length: review.rating || 0 }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-secondary" fill="currentColor" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{review.comment}</p>
                  <div className="mt-2 text-sm text-gray-600">
                    {new Date(review.created_at || '').toLocaleDateString()}
                    {review.created_at !== review.updated_at && ' (edited)'}
                  </div>
                </div>
              ))}

              {reviews.length === 0 && (
                <div className="text-center py-6 text-gray-600">
                  No reviews yet. Be the first to review this property!
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
            <div className="text-3xl font-bold text-primary mb-6">
              ${property.price.toLocaleString()}/month
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Highlights</h3>
              <div className="space-y-2">
                {property.highlights?.map((highlight, index) => (
                  <div key={index} className="flex items-center text-gray-600">
                    <Star className="h-4 w-4 text-secondary mr-2" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold mb-4">Contact Landlord</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-medium">{property.landlord_name}</p>
                </div>
                <a
                  href={`mailto:${property.landlord_email}`}
                  className="flex items-center text-primary hover:text-primary-hover"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  <span>{property.landlord_email}</span>
                </a>
                {property.landlord_phone && (
                  <a
                    href={`tel:${property.landlord_phone}`}
                    className="flex items-center text-primary hover:text-primary-hover"
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    <span>{property.landlord_phone}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}