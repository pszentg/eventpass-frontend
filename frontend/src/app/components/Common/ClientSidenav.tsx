import Link from 'next/link';

const ClientSidenav = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Link href="/client-dashboard">
        <a className="p-2 text-gray-600 hover:text-gray-900">Client Dashboard</a>
      </Link>
    </div>
  );
};

export default ClientSidenav;
