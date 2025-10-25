
import React from 'react';
import {
  FiHome,
  FiTrendingUp,
  FiSettings
} from 'react-icons/fi';

const Sidebar = () => {
  return (
    <aside className="bg-gray-900 text-white w-64 min-h-screen p-4">
      <nav>
        <ul>
          <li className="mb-2">
            <a href="#" className="flex items-center p-2 rounded hover:bg-gray-700">
              <FiHome className="mr-2" />
              Dashboard
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="flex items-center p-2 rounded hover:bg-gray-700">
              <FiTrendingUp className="mr-2" />
              Expenses
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="flex items-center p-2 rounded hover:bg-gray-700">
              <FiSettings className="mr-2" />
              Settings
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
