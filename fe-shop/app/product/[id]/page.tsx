import ClientProductPage from './ClientProductPage';
import {use} from "react";

export default function ProductPage({params}: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    return <ClientProductPage id={parseInt(id)} />;
}
