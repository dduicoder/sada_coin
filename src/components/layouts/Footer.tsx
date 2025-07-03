import { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="w-full p-6 text-white bg-[#373737]">
      <div className="mx-auto w-full max-w-2xl grid gap-4 grid-cols-1 md:grid-cols-2">
        <div>
          <span className="font-bold text-white text-base mb-2 block">
            FRONT
          </span>
          <span className="block text-gray-300 text-sm">2503 박시진</span>
          <span className="block text-gray-300 text-sm">
            School: gbs.s240088@ggh.goe.go.kr
          </span>
          <span className="block text-gray-300 text-sm">
            Personal: sijinpark77@gmail.com
          </span>
        </div>
        <div>
          <span className="font-bold text-white text-base mb-2 block">
            BACK
          </span>
          <span className="block text-gray-300 text-sm">2109 박현</span>
          <span className="block text-gray-300 text-sm">
            School: gbs.s240090@ggh.goe.go.kr
          </span>
          <span className="block text-gray-300 text-sm">
            Personal: sijinpark77@gmail.com
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-400 mt-6 text-center">
        Copyright 2025. All rights reserved by Sijin Park and Hyun Park of SADA.
      </p>
    </footer>
  );
};

export default Footer;
