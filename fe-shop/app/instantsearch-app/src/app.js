const { algoliasearch, instantsearch } = window;

const searchClient = algoliasearch(
  `${process.env.ALGOLIA_APP_ID}`,
  `${process.env.ALGOLIA_SEARCH_KEY}`
);

const search = instantsearch({
  indexName: 'products',
  searchClient,
  future: { preserveSharedStateOnUnmount: true },
});

search.addWidgets([
  instantsearch.widgets.searchBox({
    container: '#searchbox',
    placeholder: 'Tìm kiếm sản phẩm...',
  }),
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item: (hit, { html, components }) => html`
        <article>
          <img src="${hit.image}" alt="${hit.title}" />
          <div>
            <h1>${components.Highlight({ hit, attribute: 'title' })}</h1>
            <p>Danh mục: ${components.Highlight({ hit, attribute: 'category' })}</p>
            <p>Giá: ${hit.price} VNĐ</p>
          </div>
        </article>
      `,
    },
  }),
  instantsearch.widgets.configure({
    hitsPerPage: 8,
  }),
  instantsearch.widgets.pagination({
    container: '#pagination',
  }),
]);

search.start();
