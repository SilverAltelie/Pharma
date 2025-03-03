document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.image-magnifier-container');
    const image = document.getElementById('product-image');
    const magnifiedImage = document.getElementById('magnified-image');

    container.addEventListener('mousemove', function(e) {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const zoomX = (x / image.width) * 100;
        const zoomY = (y / image.height) * 100;

        magnifiedImage.style.backgroundImage = `url('${image.src}')`;
        magnifiedImage.style.backgroundPosition = `${zoomX}% ${zoomY}%`;
        magnifiedImage.style.backgroundSize = `${image.width * 2}px ${image.height * 2}px`;
        magnifiedImage.style.display = 'block';
    });

    container.addEventListener('mouseleave', function() {
        magnifiedImage.style.display = 'none';
    });
});