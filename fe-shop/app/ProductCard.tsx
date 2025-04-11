import { FaCartPlus } from "react-icons/fa";

type Image = {
    id: string;
    image: string;
}

type Product = {
    id: string;
    title: string;
    href: string;
    image: Image;
    price: string;
    color: string;
    variants: Array<{ id: string; name: string; price: string; quantity: string }>;
    images: Image[];
}
export default function ProductCard({ product, handleAddToCart, handleViewProduct }: { product: Product; handleAddToCart: (productId: string) => void; handleViewProduct: (productId: string) => void }) {
    return (
        <div key={product.id} className="group relative">
            {product.variants.length <= 0 && (
                <button
                    onClick={() => handleAddToCart(product.id)}
                    className="absolute top-1 z-50 right-1 p-2 bg-green-700 rounded-md text-white text-lg"
                >
                    <FaCartPlus />
                </button>
            )}
            <img
                alt={product.title}
                src={`data:image/jpeg;base64,${product.images[0]?.image}`}
                className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
            />
            <div className="mt-4 flex justify-between">
                <div>
                    <h3 className="text-sm text-gray-700">
                        <button onClick={() => handleViewProduct(product.id)} className="font-semibold text-gray-900">
                            {product.title}
                        </button>
                    </h3>
                </div>
                <p className="text-sm font-medium text-gray-900">{product.price}</p>
            </div>
        </div>
    );
}
