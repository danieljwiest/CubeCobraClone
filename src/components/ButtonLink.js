import React from 'react';

const ButtonLink = ({ children, outline, color = 'primary', block, ...props }) => {
  let type = outline ? `btn-outline-${color}` : `btn-${color}`;

  const link = (
    <a className={`btn ${type}`} {...props} role="button">
      {children}
    </a>
  );
  if (block) return <div className="d-grid">{link}</div>;
  return link;
};

export default ButtonLink;
