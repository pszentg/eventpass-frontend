import Link from 'next/link';
import React from 'react';

const Footer = () => {
  return (
    <div className="flex items-center justify-center">
      <p className="sticky bottom-0 text-sm bg-gray-300 text-gray-600 p-2 w-full z-50 text-center">
        &copy; {new Date().getFullYear()} EventPass Hungary. All rights reserved. &nbsp;
        <Link href="/privacy_policy" className="text-sm text-blue-600 hover:underline">
          Privacy policy
        </Link>
      </p>
    </div>
  );
};

export default Footer;
