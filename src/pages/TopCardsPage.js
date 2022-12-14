import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CardDetailsPropType from 'proptypes/CardDetailsPropType';

import DynamicFlash from 'components/DynamicFlash';
import FilterCollapse from 'components/FilterCollapse';
import TopCardsTable from 'components/TopCardsTable';
import { Row, Col } from 'reactstrap';
import ButtonLink from 'components/ButtonLink';
import MainLayout from 'layouts/MainLayout';
import RenderToRoot from 'utils/RenderToRoot';
import useQueryParam from 'hooks/useQueryParam';

const TopCardsPage = ({ data, numResults, loginCallback }) => {
  const [filter, setFilter] = useQueryParam('f', '');
  const [count, setCount] = useState(numResults);

  const updateFilter = (_, filterInput) => {
    setFilter(filterInput);
  };

  return (
    <MainLayout loginCallback={loginCallback}>
      <div className="usercontrols pt-3 mb-3">
        <Row className="pb-3 me-1">
          <Col xs="6">
            <h3 className="mx-3">Top Cards</h3>
          </Col>
          <Col xs="6">
            <div className="text-end">
              <ButtonLink outline color="accent" href="/tool/searchcards">
                Search All Cards
              </ButtonLink>{' '}
              <ButtonLink outline color="accent" href="/packages/browse">
                View Card Packages
              </ButtonLink>
            </div>
          </Col>
        </Row>
        <FilterCollapse
          isOpen
          defaultFilterText=""
          filter={filter}
          setFilter={updateFilter}
          numCards={count}
          numShown={Math.min(count, 100)}
        />
      </div>
      <DynamicFlash />
      <TopCardsTable filter={filter} setCount={setCount} count={count} cards={data} />
    </MainLayout>
  );
};

TopCardsPage.propTypes = {
  data: PropTypes.arrayOf(CardDetailsPropType).isRequired,
  numResults: PropTypes.number.isRequired,
  loginCallback: PropTypes.string,
};

TopCardsPage.defaultProps = {
  loginCallback: '/',
};

export default RenderToRoot(TopCardsPage);
