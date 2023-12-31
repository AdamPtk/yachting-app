import BaseLayout from 'components/BaseLayout';
import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import getForUser from 'services/offers/getForUser';

export const getServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: '/user/signin',
        permanent: false
      }
    };
  }
  const offers = await getForUser(session.user.email);
  return {
    props: { offers }
  };
};

export default function MyOffers({ offers }) {
  return (
    <BaseLayout>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="lg:w-1/2 w-full mb-20">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">
              Your offers
            </h1>
            <div className="h-1 w-20 bg-indigo-500 rounded"></div>
          </div>
          <div className="flex flex-wrap -m-4">
            {offers.length === 0 && (
              <div className="w-full text-center py-4">You do not have any offers.</div>
            )}
            {offers.map((offer) => (
              <div key={offer.id} className="xl:w-1/4 md:w-1/2 p-4 cursor-pointer">
                <Link href={`/offers/${offer.id}`}>
                  <div className="bg-gray-100 p-6 rounded-lg h-full hover:shadow-lg transition-all">
                    {offer.status === 'inactive' ? (
                      <span className="bg-indigo-500 text-white rounded-lg text-sm py-1 px-3">
                        Waiting for approval
                      </span>
                    ) : (
                      <span className="bg-blue-400 text-white rounded-lg text-sm py-1 px-3">
                        Active
                      </span>
                    )}
                    <div className="my-6">
                      <Image
                        className="h-40 rounded w-full object-cover object-center"
                        src="/boat.jpg"
                        width={720}
                        height={400}
                        alt="content"
                      />
                    </div>
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
        </div>
      </section>
    </BaseLayout>
  );
}
