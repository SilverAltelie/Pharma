import {useState} from "react";
import {StarIcon} from "@heroicons/react/20/solid";
import {FaTrash} from "react-icons/fa";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export interface ReviewType {
    id?: string;
    user_name?: string;
    rate: number;
    comment?: string;
    created_at?: string;
}

interface ProductReviewsProps {
    reviews: ReviewType[];
    isAdmin?: boolean;
    onEdit?: (review: ReviewType) => void;
    onDelete?: (id: string) => void;
}

export default function ProductReviews({
                            reviews,
                            isAdmin = false,
                            onEdit,
                            onDelete
                        }: ProductReviewsProps) {
    const [expanded, setExpanded] = useState<boolean>(false);
    const averageRating = reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rate, 0) / reviews.length
        : 0;

    // Hiển thị tối đa 3 đánh giá hoặc tất cả nếu đã nhấn "Xem thêm"
    const displayedReviews = expanded ? reviews : reviews.slice(0, 3);

    return (
        <div className="mt-8 border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Đánh giá từ khách hàng</h2>

            {/* Hiển thị số sao trung bình */}
            <div className="flex items-center mt-4">
                <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                        <StarIcon
                            key={rating}
                            className={classNames(
                                averageRating > rating ? 'text-yellow-400' : 'text-gray-300',
                                'h-5 w-5 flex-shrink-0'
                            )}
                            aria-hidden="true"
                        />
                    ))}
                </div>
                <p className="ml-3 text-sm font-medium text-gray-900">
                    {averageRating.toFixed(1)} ({reviews.length} {reviews.length === 1 ? 'đánh giá' : 'đánh giá'})
                </p>
            </div>

            {reviews.length > 0 ? (
                <div className="mt-6 space-y-6 divide-y divide-gray-200">
                    {displayedReviews.map((review, index) => (
                        <div key={review.id || index} className="pt-6">
                            <div className="flex items-left">
                                <div className="flex items-top">
                                    <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center text-gray-500">
                                        {review.user.name ? review.user.name.charAt(0).toUpperCase() : 'K'}
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-lg font-medium text-green-900">
                                        {review.user.name || 'Khách hàng ẩn danh'}
                                    </h3>
                                    <div className="text-sm ml-2 text-gray-500">
                                        <div className="flex items-center mt-1">
                                            {[0, 1, 2, 3, 4].map((rating) => (
                                                <StarIcon
                                                    key={rating}
                                                    className={classNames(
                                                        review.rate > rating ? 'text-yellow-400' : 'text-gray-300',
                                                        'h-4 w-4 flex-shrink-0'
                                                    )}
                                                    aria-hidden="true"
                                                />
                                            ))}
                                        </div>

                                        {review.comment && (
                                            <div className="text-sm text-gray-700">
                                                <p className="whitespace-pre-wrap">{review.comment}</p>
                                            </div>
                                        )}
                                        {review.created_at && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(review.created_at).toLocaleDateString('vi-VN')}
                                            </p>
                                        )}
                                    </div>

                                </div>

                                {isAdmin && review.id && (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => onDelete && onDelete(review.id!)}
                                            className="text-red-600 hover:text-red-800"
                                            title="Xóa"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                )}

                            </div>


                        </div>
                    ))}
                </div>
            ) : (
                <p className="mt-4 text-sm text-gray-500">Sản phẩm này chưa có đánh giá nào.</p>
            )}

            {reviews.length > 3 && !expanded && (
                <button
                    className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    onClick={() => setExpanded(true)}
                >
                    Xem thêm đánh giá
                </button>
            )}

            {expanded && (
                <button
                    type="button"
                    className="mt-6 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    onClick={() => setExpanded(false)}
                >
                    Thu gọn
                </button>
            )}
        </div>
    );
}