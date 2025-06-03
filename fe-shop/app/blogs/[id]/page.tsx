import BlogDetailClient from './BlogDetailClient';

export default function BlogDetailPage({
    params,
}: {
    params: { id: string }
}) {
    return <BlogDetailClient id={params.id} />;
}
