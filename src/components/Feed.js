import React, { useState } from 'react';
import PropTypes from 'prop-types';

import InfiniteScroll from 'react-infinite-scroll-component';

import BlogPost from 'components/BlogPost';
import { csrfFetch } from 'utils/CSRF';

import { Spinner } from 'reactstrap';
import BlogPostPropType from 'proptypes/BlogPostPropType';

const wait = async (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const Feed = ({ items }) => {
  const [feedItems, setFeedItems] = useState(items);

  const fetchMoreData = async () => {
    // intentionally wait to avoid too many DB queries
    await wait(2000);

    const response = await csrfFetch(`/tool/getfeeditems/${feedItems.length}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const json = await response.json();
      if (json.success === 'true') {
        const ids = new Set(feedItems.map((item) => item._id));
        const newFeedItems = [...feedItems];
        for (const item of json.items) {
          if (!ids.has(item._id)) {
            newFeedItems.push(item);
          }
        }
        setFeedItems(newFeedItems);
      }
    }
  };

  const loader = (
    <div className="centered py-3 my-4">
      <Spinner className="position-absolute" />
    </div>
  );

  return (
    <InfiniteScroll dataLength={feedItems.length} next={fetchMoreData} hasMore loader={loader}>
      {feedItems.map((item) => (
        <BlogPost key={item._id} post={item} />
      ))}
    </InfiniteScroll>
  );
};

Feed.propTypes = {
  items: PropTypes.arrayOf(BlogPostPropType).isRequired,
};

export default Feed;
