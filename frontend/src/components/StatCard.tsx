import React from 'react';

interface IProps {
  title: string;
  value: string | number;
  icon: React.ReactElement; 
  color: string;
}

const StatCard = ({ title, value, icon, color }: IProps) => {  
  const styledIcon = React.cloneElement(icon, {
    className: `w-10 h-10 ${color}`
  });

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex items-center gap-6">
      <div className={`p-3 rounded-full bg-gray-900`}>
        {styledIcon}
      </div>
      <div>
        <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">
          {title}
        </h3>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;