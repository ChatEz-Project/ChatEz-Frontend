import React from 'react';

interface LogoProps {
  svgPath: string;
}

const Logo: React.FC<LogoProps> = ({ svgPath }) => {
  return (
    <div
      className="logo-container"
      style={{ textAlign: 'center', marginBottom: '20px' }}
    >
      <img
        src={svgPath}
        alt="ChatEz Logo"
        style={{ width: '150px', height: 'auto' }}
      />
    </div>
  );
};

export default Logo;
