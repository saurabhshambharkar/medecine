import React from 'react';
import { Link } from 'react-router-dom';

interface CategoryCardProps {
  icon: React.ReactNode;
  name: string;
  path: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ icon, name, path }) => {
  return (
    <Link 
      to={path}
      className="group flex flex-col items-center bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 text-center"
    >
      <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
        <div className="text-primary-600">
          {icon}
        </div>
      </div>
      <h3 className="font-medium text-gray-900">{name}</h3>
    </Link>
  );
};

export default CategoryCard;