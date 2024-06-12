import React from 'react';
import Sidenav from '../components/Sidenav';

const DashboardLayout = ({ 
    children, 
}: Readonly<{
    children: React.ReactNode;
}>) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-200 sticky top-0 h-14 flex justify-left items-left text-center font-semibold">
        EventPass
      </header>
      <div className="flex flex-col md:flex-row flex-1">
        <aside className=" w-full md:w-40 bg-gray-400">
          <Sidenav />
        </aside>
        <main className='flex-1'>{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;