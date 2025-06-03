
export type Variant = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    discounted_price: number;
}

export type Address = {
    id: number;
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    is_default: number;
    phone: string;
    address: string;
}

export type PromotionItem = {
    id: number;
    promotion_id: number;
    product_id: number;
}

export type Blog = {
    id: number;
    title: string;
    content: string;
    thumbnail: string;
    category_id: number;
    created_at: string;
    updated_at: string;
}

export type BlogCategory = {
    id: number;
    name: string;
    blogs?: Blog[];
    parent_id?: number;
}

export type Promotion = {
    id: number;
    name: string;
    code: string;
    discount: number;
    type: string;
    start_date: string;
    end_date: string;
    promotion_items?: PromotionItem[];
}

export type Category = {
    id: number;
    name: string;
    status: number;
    totalProducts?: number;
    parent_id: number | null;
    children?: Category[];
    products?: Product[];
}

export type Image = {
    id: string;
    image: string;
}

export type ReviewType = {
    id?: number;
    user_id?: number;
    product_id?: number;
    rate: number;
    comment: string;
    user?: User;
    created_at?: string;
    updated_at?: string;
}

export type Permission = {
    id: number;
    name: string;
    display_name: string;
    description: string;
    roles?: Role[];
}

export type Role = {
    name: string;
    id: number;
    display_name: string;
    description: string;
    permissions?: Permission[];
}

export type Product = {
    id: string;
    title: string;
    status: number;
    active: number;
    image?: Image;
    images?: Image[];
    description: string;
    content: string;
    category_id: number;
    price: number;
    quantity: number;
    variants?: Variant[];
    reviews?: ReviewType[];
    discounted_price: number;
}

export type CartItem = {
    id: number;
    product_id: number;
    quantity: number;
    product: Product;
    variant?: Variant;
    image?: string;
}

export type Cart = {
    id: number;
    user_id: number;
    cart_items?: CartItem[];
}

export type OrderItem = {
    id: number;
    order_id: number;
    product_id: number;
    variant_id: number;
    quantity: number;
    product: Product;
    variant?: Variant;
    name?: string;
}

export type Order = {
    address_id: number;
    address?: Address;
    payment_id: number;
    payment?: Payment;
    note: string;
    user_id: string;
    id: number;
    status: string;
    order_items: OrderItem[];
    created_at: string;
    updated_at: string;
    amount: string;
};

export type Customer = {
    id: number;
    name: string;
    email: string;
    addresses: {
        phone: string;
    }[];
}

export type User = {
    id: string,
    name: string,
    email: string,
    password: string,
    addresses: Address[],
    phone?: string,
    user?: User | undefined
}

export type Payment = {
    id: number;
    order_id?: number;
    method: string;
}

