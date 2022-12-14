import React, { useCallback, useState } from 'react';

import CubePropType from 'proptypes/CubePropType';

import { Card } from 'reactstrap';

import AspectRatioBox from 'components/AspectRatioBox';

import { getCubeDescription, getCubeId } from 'utils/Util';

const CubePreview = ({ cube }) => {
  const [hover, setHover] = useState(false);
  const handleMouseOver = useCallback((event) => setHover(!event.target.getAttribute('data-sublink')), []);
  const handleMouseOut = useCallback(() => setHover(false), []);
  return (
    <Card
      className={hover ? 'cube-preview-card hover' : 'cube-preview-card'}
      onMouseOver={handleMouseOver}
      onFocus={handleMouseOver}
      onMouseOut={handleMouseOut}
      onBlur={handleMouseOut}
    >
      <AspectRatioBox ratio={626 / 457} className="text-ellipsis">
        <img className="w-100" alt={cube.image_name} src={cube.image_uri} />
        <em className="cube-preview-artist">Art by {cube.image_artist}</em>
      </AspectRatioBox>
      <div className="w-100 py-1 px-2">
        <a href={`/cube/overview/${encodeURIComponent(getCubeId(cube))}`} className="stretched-link">
          <h5 className="text-muted text-ellipsis my-0" title={cube.name}>
            {cube.name}
          </h5>
        </a>
        <div className="text-muted text-ellipsis">{getCubeDescription(cube)}</div>
        <em className="text-muted text-ellipsis">
          Designed by{' '}
          <a data-sublink href={`/user/view/${cube.owner}`}>
            {cube.owner_name}
          </a>
        </em>
      </div>
    </Card>
  );
};

CubePreview.propTypes = {
  cube: CubePropType.isRequired,
};

export default CubePreview;
