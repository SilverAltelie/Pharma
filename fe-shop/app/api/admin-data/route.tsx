import { NextResponse } from "next/server";

export async function GET() {
  const data = {
    user : { id: 1, name: "Trần Văn B", email: "admin@gmail.com", number: "0987654321", password: "$2y$12$examplehashedpassword" },
    users: [ 
      { id: 1, name: "Trần Văn B", email: "shopthuoc@gmail.com", number: "0987654321", password: "$2y$12$examplehashedpassword" },
      { id: 2, name: "Trần Văn A", email: "shopthuoc@gmail.com", number: "0987654321", password: "$2y$12$examplehashedpassword" },
      { id: 3, name: "Trần Văn C", email: "shopthuoc@gmail.com", number: "0987654321", password: "$2y$12$examplehashedpassword" },

    ],

    roles : [
      { id: 1, name: "Admin" },
      { id: 2, name: "Khách hàng" },
    ],

    user_roles: [
      { id: 1, user_id: 1, role_id: 1 },
      { id: 2, user_id: 2, role_id: 2 },
      { id: 3, user_id: 3, role_id: 2 },
    ],

    categories: [
      { id: 1, name: "Thuốc giảm đau", description: "Morphine các loại", status: 1, parent_id: null},
      { id: 2, name: "Kháng sinh", description: "Phòng ngừa các loại bệnh",status: 1 , parent_id: null},
      { id: 11, name: "Paracetamol", description: "Thuốc đau đầu" , status: 1, parent_id: 1}, 
      { id: 12, name: "Ibuprofen", description: "Thuốc giảm đau", status: 0, parent_id: 1 },
      { id: 21, name: "Amoxicillin", description: "Kháng sinh loại A", status: 0 , parent_id: 2},
      { id: 22, name: "Azithromycin", description: "kháng sinh loại B", status: 1, parent_id: 2 },
    ],

    promotions: [{ id: 1, name: "Giảm 20% cho đơn hàng trên 1 triệu" }],

    products: [
      {
        id: 1,
        title: "Paracetamol 500mg",
        image: "/images/paracetamol.jpg",
        category_id: 11,
        quantity: 200,
        description: "Thuốc giảm đau hạ sốt, an toàn cho người lớn và trẻ nhỏ.",
        content: "Hỗ trợ điều trị đau đầu, cảm cúm, sốt nhẹ.",
        price: 20000.0,
        active: 1,
        created_at: "2025-02-01 12:00:00",
        updated_at: "2025-02-10 15:30:00",
      },
      {
        id: 2,
        title: "Ibuprofen 400mg",
        image: "/images/ibuprofen.jpg",
        category_id: 12,
        quantity: 150,
        description: "Thuốc giảm đau, kháng viêm, giảm sốt.",
        content: "Điều trị viêm khớp, đau cơ, hạ sốt nhanh chóng.",
        price: 50000.0,
        active: 1,
        created_at: "2025-01-20 08:45:00",
        updated_at: "2025-02-10 16:00:00",
      },
      {
        id: 3,
        title: "Amoxicillin 500mg",
        image: "/images/amoxicillin.jpg",
        category_id: 21,
        quantity: 100,
        description: "Kháng sinh điều trị nhiễm khuẩn đường hô hấp, tiết niệu, da.",
        content: "Thuốc kê đơn, cần có sự hướng dẫn của bác sĩ.",
        price: 75000.0,
        active: 1,
        created_at: "2025-02-05 10:15:00",
        updated_at: "2025-02-10 14:20:00",
      },
    ],

    recentCustomers: [
      { id: 1, name: "Trần Văn B", email: "shopthuoc@gmail.com", number: "0987654321", password: "$2y$12$examplehashedpassword" },
      { id: 3, name: "Trần Văn C", email: "shopthuoc1@gmail.com", number: "09871654321", password: "$2y$12$examplehashedpassword" },
    ],

    variants: [
      { id: 101, product_id: 1, variant: "Hộp 10 viên", price: 20000.0, quantity: 50 },
      { id: 102, product_id: 1, variant: "Hộp 20 viên", price: 38000.0, quantity: 30 },
      { id: 201, product_id: 2, variant: "Hộp 10 viên", price: 50000.0, quantity: 40 },
      { id: 202, product_id: 2, variant: "Hộp 20 viên", price: 95000.0, quantity: 10 },
      { id: 301, product_id: 3, variant: "Hộp 10 viên", price: 75000.0, quantity: 60 },
      { id: 302, product_id: 3, variant: "Hộp 20 viên", price: 140000.0, quantity: 30 },
    ],

    cartItems: [
      { id: 1, cart_id: 1, product_id: 1, variant_id: 102, image: "/images/paracetamol.jpg", quantity: 2 },
      { id: 2, cart_id: 1, product_id: 2, variant_id: 201, image: "/images/ibuprofen.jpg", quantity: 1 },
    ],

    cart: { id: 1, user_id: 1 },

    addresses: [
      { id: 1, first_name: 'Trần', last_name: "Văn B" , user_id: 1, address: "Số 19, Đường ABC, Quận XYZ, Hà Nội", number: "0987654321", is_default: 1, email: "<EMAIL>" },
      { id: 2, first_name: 'Trần', last_name: "Văn A" , user_id: 2, address: "Số 19, Đường ABA, Quận TX, Hà Nội", number: "0987654321", is_default: 0, email: "<EMAIL>" },

    ],

    orders: [
      { id: 1, user_id: 1, status: 3, created_at: "2025-02-10 10:00:00", updated_at: "2025-02-10 10:30:00" },
      { id: 2, user_id: 3, status: 4, created_at: "2025-02-10 11:00:00", updated_at: "2025-02-10 11:30:00" },
      { id: 3, user_id: 1, status: 0, created_at: "2025-02-10 12:00:00", updated_at: "2025-02-10 12:30:00" },
      { id: 4, user_id: 3, status: 1, created_at: "2025-02-10 13:00:00", upddated_at: "2025-02-10 13:30:00" },
      { id: 5, user_id: 1, status: 2, created_at: "2025-02-10 14:00:00", updated_at: "2025-02-10 14:30:00" },
    ],

    order_items: [
      { order_id: 1, product_id: 1, variant_id: 102, quantity: 2 },
      { order_id: 1, product_id: 2, variant_id: 201, quantity: 2 },

      { order_id: 2, product_id: 2, variant_id: 201, quantity: 1 },
    ],
  
  };

  

  const productMap = Object.fromEntries(data.products.map((p) => [p.id, p]) ?? []);
  const variantMap = Object.fromEntries(data.variants.map((v) => [v.id, v]));
  const orderMap = Object.fromEntries(data.orders.map((o) => [o.id, o]));




  const completedOrders = data.orders.filter(order => order.status === 4);

  const totalCompletedOrderValue = completedOrders.reduce((total, order) => {
    const orderItems = data.order_items.filter(item => item.order_id === order.id);
  
    const orderTotal = orderItems.reduce((sum, item) => {
      const product = productMap[item.product_id] || null;
      const variant = variantMap[item.variant_id] || null;
  
      if (!product) {
        console.warn(`⚠️ Không tìm thấy sản phẩm với ID ${item.product_id}`);
        return sum;
      }
  
      const price = variant?.price ?? product.price ?? 0;
      return sum + price * item.quantity;
    }, 0);
  
    return total + orderTotal;
  }, 0);

  data.roles = data.roles.map((role) => {
    const users = data.user_roles.filter((user) => user.role_id === role.id);
    return { ...role, users };
  }
  );

  data.categories = data.categories.map((category) => {
    const products = data.products.filter((product) => product.category_id === category.id);
    const childrens = data.categories.filter((c) => c.parent_id === category.id);

    const totalProducts = products.length + childrens.reduce((sum, child) => {
        return sum + data.products.filter((p) => p.category_id === child.id).length;
    }, 0);

    return { ...category, products, childrens, totalProducts };
});


  data.users = data.users.map((user) => {
    const role = data.user_roles.find((r) => r.user_id === user.id); 
    const roleName = data.roles.find((r) => r.id === role?.role_id)?.name; 
    const address = data.addresses.find((a) => a.user_id === user.id);
    return { ...user, role: roleName || "Chưa có vai trò", address: address || "Chưa có địa chỉ" };
  });
  


  data.order_items = data.order_items.map((item) => {
    const product = productMap[item.product_id];
    const variant = variantMap[item.variant_id];

    return {
      order_id: item.order_id,
      product_id: item.product_id,
      variant_id: item.variant_id,
      product_name: product?.title || "Không xác định",
      variant_name: variant ? variant.variant : "Không có phân loại",
      price: variant ? variant.price : product?.price || 0,
      quantity: item.quantity,
    };
  });

  data.cartItems = data.cartItems.map((item) => {
    const product = productMap[item.product_id];
    const variant = variantMap[item.variant_id];

    return {
      id: item.id,
      cart_id: item.cart_id,
      product_id: item.product_id,
      variant_id: item.variant_id,
      image: item.image,
      product_name: product?.title || "Không xác định",
      variant_name: variant ? variant.variant : "Không có phân loại",
      price: variant ? variant.price : product?.price || 0,
      quantity: item.quantity,
    };
  });
  data.orders = data.orders.map((order) => {
    const order_items = data.order_items.filter((item) => item.order_id === order.id);
    const totalAmount = order_items.reduce((total, item) => {
      const product = productMap[item.product_id];
      const variant = variantMap[item.variant_id];

      const price = variant ? variant.price : product?.price || 0;
      return total + price * item.quantity;
    }, 0);
    return { ...order, totalAmount };
  });

  return NextResponse.json(data);
}
