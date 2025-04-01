'use client';

import React from 'react';
import algoliasearch from 'algoliasearch';
import { InstantSearch, SearchBox, Hits, Pagination, Configure } from 'react-instantsearch-hooks-web';

const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '',
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || ''
);

export default function AlgoliaSearch() {
    return (
        <InstantSearch searchClient={searchClient} indexName="products">
            <Configure hitsPerPage={8} />
            <SearchBox placeholder="Tìm kiếm sản phẩm..." />
            <Hits hitComponent={Hit} />
            <Pagination />
        </InstantSearch>
    );
}

function Hit({ hit }: { hit: any }) {
    return (
        <article>
            <img src={hit.image} alt={hit.title} />
            <div>
                <h1 dangerouslySetInnerHTML={{ __html: hit._highlightResult.title.value }} />
                <p>
                    Danh mục: <span dangerouslySetInnerHTML={{ __html: hit._highlightResult.category.value }} />
                </p>
                <p>Giá: {hit.price} VNĐ</p>
            </div>
        </article>
    );
}