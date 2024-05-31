import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h2 className="text-lg font-bold mb-4">Upgrade your lifestyle</h2>
            <p className="text-gray-400 mb-4">
              The Fintech Guide helps readers keep tabs on the fast-paced world of
              tech with all the latest news, fun product reviews, insightful
              editorials, and one-of-a-kind sneak peeks.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-bold mb-4">Categories</h2>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Mobile
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Computing
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Gaming
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Audio / Video
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Smart Home
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Entertainment
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-bold mb-4">Helpful Links</h2>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Editorial Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Logo & Accolade Licensing
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-bold mb-4">More Categories</h2>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Automotive
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Space
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Streaming Guides
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Original Shows
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Downloads
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  How-To
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8">
          <p className="text-gray-400 text-sm">
            The Fintech Media Group may earn a commission when you buy
            through links on our sites.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            ©2024 The Fintech Media Group, a Designtechnica Company. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
