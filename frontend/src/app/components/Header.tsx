import Link from 'next/link';
import React from 'react';
import HomeIcon from '@mui/icons-material/Home';

const Header = () => {
  return (
    <footer className="flex items-left justify-left bg-gray-100">
      <p className="top-0 text-sm text-gray-600">
        <Link href="/" className="flex items-center text-sm text-blue-600 hover:underline">
          <HomeIcon className="mr-1" />
          Home
        </Link>
      </p>
    </footer>
  );
};

export default Header;
