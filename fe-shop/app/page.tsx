'use client'

import MainLayout from "./_userlayout";
import dynamic from "next/dynamic";
import $ from "jquery";
import "bootstrap/dist/css/bootstrap.css";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { XMarkIcon } from '@heroicons/react/20/solid'

const BootstrapScript = dynamic(
  () => import("bootstrap/dist/js/bootstrap.bundle.min.js"),
  { ssr: false }
);

const stats = [
  { id: 1, name: 'Chi nhánh trên toàn bộ các tỉnh thành', value: '63' },
  { id: 2, name: 'Đơn hàng mỗi tháng', value: '100,000+' },
  { id: 3, name: 'Sản phẩm', value: '1000+'},
  { id: 4, name: 'Khách hàng tin dùng sản phẩm', value: '46,000' },
]

const features = [
  { name: 'Thuốc các loại', description: 'Nhận buốc thuốc theo đơn của bác sĩ' },
  { name: 'Thực phẩm chức năng', description: 'Bồi bổ cho cơ thể' },
  { name: 'Kem/thuốc mỹ phẩm', description: 'Chức năng làm đẹp, tẩy mụn, xóa sẹo' },
  { name: 'Vitamin các loại', description: 'Bổ sung dưỡng chất còn thiếu cho cơ thể phát triển' },

]

const images = [
  {src: '/img/bg-img/voucher.png', link: `/promotion/${1}`},
  {src: '/img/bg-img/zalo.png', link: `/promotion/${1}`},
  {src: '/img/bg-img/calci.png', link: `/product/${1}`},
]

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("jQuery version:", $.fn.jquery); // Kiểm tra phiên bản jQuery
    }

    import("bootstrap/dist/js/bootstrap.bundle.min.js").then((bootstrap) => {
      const popupId = "#salePopup";
      const storageKey = "popupClosedTime";
      const displayAfterMillis = 3600000;

      function checkAndShowPopup() {
        const lastClosedTime = localStorage.getItem(storageKey);
        if (!lastClosedTime || Date.now() - parseInt(lastClosedTime, 10) >= displayAfterMillis) {
          const popup = document.getElementById("salePopup");
          if (popup) {
            new bootstrap.Modal(popup).show();
          }
        }
      }

      document.getElementById("salePopup")?.addEventListener("hidden.bs.modal", () => {
        localStorage.setItem(storageKey, Date.now().toString());
      });

      checkAndShowPopup();
    });

    async function fetchData() {
      try {
        const res = await fetch("/api/data");
    
        // Kiểm tra xem API có trả về mã lỗi không
        if (!res.ok) {
          throw new Error(`API trả về lỗi: ${res.statusText}`);
        }
    
        // Kiểm tra xem nội dung có phải là JSON hợp lệ không
        const text = await res.text();
        try {
          const json = JSON.parse(text);  // Parse lại nội dung thành JSON
          setData(json);
        } catch (error) {
          throw new Error("Dữ liệu trả về không phải là JSON hợp lệ.");
        }
      } catch (error) {
        console.error("Lỗi khi gọi API hoặc phân tích JSON: ", error);
      }
    }
    

    fetchData();
  }, []);

  if (!data) {
    return <MainLayout>Loading...</MainLayout>;
  }

  return (
    <MainLayout>
      
      {isVisible && (
        <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-[max(-7rem,calc(50%-52rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl"
          >
            <div
              style={{
                clipPath:
                  'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
              }}
              className="aspect-577/310 w-[36.0625rem] bg-linear-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
            />
          </div>
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-[max(45rem,calc(50%+8rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl"
          >
            <div
              style={{
                clipPath:
                  'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
              }}
              className="aspect-577/310 w-[36.0625rem] bg-linear-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
            />
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="text-sm/6 text-gray-900">
              <strong className="font-semibold">Xin chào</strong>
              <svg viewBox="0 0 2 2" aria-hidden="true" className="mx-2 inline size-0.5 fill-current">
                <circle r={1} cx={1} cy={1} />
              </svg>
              Bạn chưa có tài khoản? Hãy đăng ký ngay để nhận ưu đãi hấp dẫn.
            </p>
            <a
              href="/auth/register"
              className="flex-none rounded-full bg-gray-900 px-3.5 py-1 text-sm font-semibold text-white shadow-xs hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
            >
              Đăng ký ngay hôm nay <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
          <div className="flex flex-1 justify-end">
            <button
              type="button"
              className="-m-3 p-3 focus-visible:outline-offset-[-4px]"
              onClick={handleDismiss} // Gọi hàm handleDismiss khi nhấn vào nút
            >
              <span className="sr-only">Dismiss</span>
              <XMarkIcon aria-hidden="true" className="size-5 text-gray-900" />
            </button>
          </div>
        </div>
      )}
      <div className="modal fade" id="salePopup" tabIndex={-1} role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">shop thông báo !</h5>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal" // Sử dụng `data-bs-dismiss="modal"` thay vì `data-dismiss="modal"`
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p>Cám ơn quý khách đã tin tưởng sử dụng sàn thương mại điện tử của chúng tôi !</p>
              <p>Chúc quý khách mua sắm vui vẻ</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal" // Thêm `data-bs-dismiss="modal"` vào đây
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <section className="bg-blue-100 py-10">
        <div className="container mx-auto grid grid-cols-3 gap-4">
          {/* Swiper bên trái */}
          <div className="col-span-2">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              className="w-full rounded-lg overflow-hidden shadow-lg"
            >
              {images.map((image, index) => (
                <SwiperSlide key={index}>
                  <a href={image.link} target="_blank" rel="noopener noreferrer">
                    <img
                      src={image.src}
                      alt={`Slide ${index + 1}`}
                      className="w-full h-72 object-cover rounded-lg"
                    />
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Hai ảnh tĩnh bên phải */}
          <div className="flex flex-col gap-4">
            <a href="/promotion/1" target="_blank" rel="noopener noreferrer">
              <img
                src="/img/bg-img/voucher.png"
                alt="Image 1"
                className="w-full h-36 object-cover rounded-lg shadow-lg"
              />
            </a>
            <a href="/product/1" target="_blank" rel="noopener noreferrer">
              <img
                src="/img/bg-img/calci.png"
                alt="Image 2"
                className="w-full h-36 object-cover rounded-lg shadow-lg"
              />
            </a>
          </div>
        </div>
      </section>

      <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.id} className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base/7 text-gray-600">{stat.name}</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>

    <div className="bg-white">
      <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-8 gap-y-16 px-4 py-24 sm:px-6 sm:py-32 lg:max-w-7xl lg:grid-cols-2 lg:px-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Chuyên bán các sản phẩm</h2>
          <p className="mt-4 text-gray-500">
            Chuyên bán các sản phẩm về dược phẩm, thực phẩm chức năng, kem/thuốc mỹ phẩm, vitamin các loại.
          </p>

          <dl className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8">
            {features.map((feature) => (
              <div key={feature.name} className="border-t border-gray-200 pt-4">
                <dt className="font-medium text-gray-900">{feature.name}</dt>
                <dd className="mt-2 text-sm text-gray-500">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="grid grid-cols-2 grid-rows-2 gap-4 sm:gap-6 lg:gap-8">
          <img
            alt="Walnut card tray with white powder coated steel divider and 3 punchout holes."
            src="/img/product-img/pills.png"
            className="rounded-lg bg-gray-100"
          />
          <img
            alt="Top down view of walnut card tray with embedded magnets and card groove."
            src="/img/product-img/products.jpg"
            className="rounded-lg bg-gray-100"
          />
          <img
            alt="Side of walnut card tray with card groove and recessed card area."
            src="/img/product-img/beauty.jpg"
            className="rounded-lg bg-gray-100"
          />
          <img
            alt="Walnut card tray filled with cards and card angled in dedicated groove."
            src="/img/product-img/vitamins.png"
            className="rounded-lg bg-gray-100"
          />
        </div>
      </div>
    </div>

      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {data?.products.map((product: any) => (
            <div key={product.id} className="group relative">
              <img
                alt={product.imageAlt}
                src={product.imageSrc}
                className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
              />
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <a href={`/product/${product.id}`}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.title}
                    </a>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      
      
    </MainLayout>
  );
}
