import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import BaseLayout from 'components/BaseLayout';
import paginateOffers from 'services/offers/paginate';
import { jsonFetcher } from 'utils';

export const getStaticProps = async () => {
  const offers = await paginateOffers();

  return {
    props: { offers: offers.records.map((offer) => offer.fields), offset: offers.offset }
  };
};

export default function AllOffers({ offers, offset }) {
  const { query } = useRouter();
  // const { data } = useSWR('/api/offers/paginate', jsonFetcher, { initialData: offers });
  const [currentOffers, setCurrentOffers] = useState(offers);
  const [currentOffset, setCurrentOffset] = useState(offset);

  const loadMore = async () => {
    const response = await jsonFetcher(`/api/offers/paginate?offset=${currentOffset}`);
    setCurrentOffset(response.offset);
    setCurrentOffers([...currentOffers, ...response.offers]);
  };

  const handleFilters = async () => {
    let filters = '';
    if (query.category) {
      filters += `?category=${query.category}`;
    }
    const response = await jsonFetcher(`/api/offers/paginate${filters}`);
    setCurrentOffset(response.offset);
    setCurrentOffers([...response.offers]);
  };

  useEffect(() => {
    handleFilters();
  }, [query]);

  return (
    <BaseLayout>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="mb-4">
            <Link href="/offers">
              <button className={`mr-4 ${query.category ? 'btn-secondary' : 'btn-primary'}`}>
                All
              </button>
            </Link>
            <Link href="?category=sale">
              <button
                className={`mr-4 ${query.category === 'sale' ? 'btn-primary' : 'btn-secondary'}`}>
                For sale
              </button>
            </Link>
            <Link href="?category=rent">
              <button className={query.category === 'rent' ? 'btn-primary' : 'btn-secondary'}>
                For rent
              </button>
            </Link>
          </div>
          <div className="flex flex-wrap -m-4 mb-10">
            {currentOffers.map((offer) => (
              <div key={offer.id} className="xl:w-1/4 md:w-1/2 p-4 cursor-pointer">
                <Link href={`/offers/${offer.id}`}>
                  <div className="bg-gray-100 p-6 rounded-lg h-full hover:shadow-lg transition-all">
                    <Image
                      className="h-40 rounded w-full object-cover object-center mb-6"
                      src="/boat.jpg"
                      width={720}
                      height={400}
                      alt="content"
                    />
                    <h3 className="tracking-widest text-indigo-500 text-xs font-medium title-font">
                      {offer.category}
                    </h3>
                    <h2 className="text-lg text-gray-900 font-medium title-font mb-4">
                      {offer.title}
                    </h2>
                    <p className="leading-relaxed text-base">
                      {offer.description.length > 100
                        ? offer.description.substring(0, 100) + '...'
                        : offer.description}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          {currentOffset && (
            <button className="flex mx-auto btn-primary" onClick={loadMore}>
              Load more
            </button>
          )}
        </div>
      </section>
    </BaseLayout>
  );
}
