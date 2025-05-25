import BlogDetailClient from './BlogDetailClient';

type Props = {
    params: {
        id: string;
    };
};

export default function BlogDetailPage({ params }: Props) {
    return <BlogDetailClient id={params.id} />;
}
