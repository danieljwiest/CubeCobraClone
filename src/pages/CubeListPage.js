import React, { useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import LocalStorage from 'utils/LocalStorage';
import Query from 'utils/Query';

import CardModalForm from 'components/CardModalForm';
import { ChangelistContextProvider } from 'contexts/ChangelistContext';
import ClientOnly from 'components/ClientOnly';
import CubeContext from 'contexts/CubeContext';
import CubeListNavbar from 'components/CubeListNavbar';
import CurveView from 'components/CurveView';
import DisplayContext, { DisplayContextProvider } from 'contexts/DisplayContext';
import DynamicFlash from 'components/DynamicFlash';
import ErrorBoundary from 'components/ErrorBoundary';
import GroupModal from 'components/GroupModal';
import ListView from 'components/ListView';
import Maybeboard from 'components/Maybeboard';
import { MaybeboardContextProvider } from 'contexts/MaybeboardContext';
import { SortContextProvider } from 'contexts/SortContext';
import TableView from 'components/TableView';
import { TAG_COLORS, TagContextProvider } from 'contexts/TagContext';
import VisualSpoiler from 'components/VisualSpoiler';
import CubeLayout from 'layouts/CubeLayout';
import MainLayout from 'layouts/MainLayout';
import RenderToRoot from 'utils/RenderToRoot';
import useQueryParam from 'hooks/useQueryParam';
import CardPropType from 'proptypes/CardPropType';

const CubeListPageRaw = ({
  defaultFilterText,
  defaultView,
  defaultShowTagColors,
  defaultPrimarySort,
  defaultSecondarySort,
  defaultTertiarySort,
  defaultQuaternarySort,
  defaultShowUnsorted,
}) => {
  const { cube, canEdit } = useContext(CubeContext);

  const [cubeView, setCubeView] = useQueryParam('view', defaultView);
  const [openCollapse, setOpenCollapse] = useState(null);
  const [filter, setFilter] = useState(null);
  const [sorts, setSorts] = useState(null);

  useEffect(() => {
    const savedChanges = cube._id && LocalStorage.get(`changelist-${cube._id}`);
    if (savedChanges && savedChanges.length > 2 && Query.get('updated', false) !== 'true') {
      setOpenCollapse('edit');
    } else if (defaultFilterText && defaultFilterText.length > 0) {
      setOpenCollapse('filter');
    } else if (
      (defaultPrimarySort && defaultPrimarySort.length > 0) ||
      (defaultSecondarySort && defaultSecondarySort.length > 0)
    ) {
      setOpenCollapse('sort');
    }
  }, [cube._id, defaultFilterText, defaultPrimarySort, defaultSecondarySort]);

  const defaultTagSet = new Set([].concat(...cube.cards.map((card) => card.tags)));
  const defaultTags = [...defaultTagSet].map((tag) => ({
    id: tag,
    text: tag,
  }));

  const filteredCards = useMemo(() => {
    return filter ? cube.cards.filter(filter) : cube.cards;
  }, [filter, cube]);

  return (
    <SortContextProvider defaultSorts={cube.default_sorts} showOther={!!cube.default_show_unsorted}>
      <DisplayContextProvider cubeID={cube._id}>
        <TagContextProvider
          cubeID={cube._id}
          defaultTagColors={cube.tag_colors}
          defaultShowTagColors={defaultShowTagColors}
          defaultTags={defaultTags}
        >
          <ChangelistContextProvider cubeID={cube._id} setOpenCollapse={setOpenCollapse}>
            <CardModalForm>
              <GroupModal cubeID={cube._id} canEdit={canEdit}>
                <CubeListNavbar
                  cubeView={cubeView}
                  setCubeView={setCubeView}
                  openCollapse={openCollapse}
                  setOpenCollapse={setOpenCollapse}
                  defaultPrimarySort={defaultPrimarySort}
                  defaultSecondarySort={defaultSecondarySort}
                  defaultTertiarySort={defaultTertiarySort}
                  defaultQuaternarySort={defaultQuaternarySort}
                  defaultShowUnsorted={defaultShowUnsorted}
                  sorts={sorts}
                  setSorts={setSorts}
                  defaultSorts={cube.default_sorts}
                  cubeDefaultShowUnsorted={cube.default_show_unsorted}
                  defaultFilterText={defaultFilterText}
                  filter={filter}
                  setFilter={setFilter}
                  cards={filteredCards}
                  className="mb-3"
                />
                <DynamicFlash />
                <ErrorBoundary>
                  <ClientOnly>
                    <DisplayContext.Consumer>
                      {({ showMaybeboard }) => (
                        <MaybeboardContextProvider initialCards={cube.maybe}>
                          {showMaybeboard && <Maybeboard filter={filter} />}
                        </MaybeboardContextProvider>
                      )}
                    </DisplayContext.Consumer>
                  </ClientOnly>
                </ErrorBoundary>
                <ErrorBoundary>
                  {filteredCards.length === 0 ? <h5 className="mt-1 mb-3">No cards match filter.</h5> : ''}
                  {
                    {
                      table: <TableView cards={filteredCards} />,
                      spoiler: <VisualSpoiler cards={filteredCards} />,
                      curve: <CurveView cards={filteredCards} />,
                      list: <ListView cards={filteredCards} />,
                    }[cubeView]
                  }
                </ErrorBoundary>
              </GroupModal>
            </CardModalForm>
          </ChangelistContextProvider>
        </TagContextProvider>
      </DisplayContextProvider>
    </SortContextProvider>
  );
};

CubeListPageRaw.propTypes = {
  defaultShowTagColors: PropTypes.bool.isRequired,
  defaultFilterText: PropTypes.string.isRequired,
  defaultView: PropTypes.string.isRequired,
  defaultPrimarySort: PropTypes.string.isRequired,
  defaultSecondarySort: PropTypes.string.isRequired,
  defaultTertiarySort: PropTypes.string.isRequired,
  defaultQuaternarySort: PropTypes.string.isRequired,
  defaultShowUnsorted: PropTypes.string.isRequired,
};

const CubeListPage = ({
  cube,
  defaultShowTagColors,
  defaultFilterText,
  defaultView,
  defaultPrimarySort,
  defaultSecondarySort,
  defaultTertiarySort,
  defaultQuaternarySort,
  defaultShowUnsorted,
  loginCallback,
}) => (
  <MainLayout loginCallback={loginCallback}>
    <CubeLayout cube={cube} activeLink="list">
      <CubeListPageRaw
        defaultShowTagColors={defaultShowTagColors}
        defaultFilterText={defaultFilterText}
        defaultView={defaultView}
        defaultPrimarySort={defaultPrimarySort}
        defaultSecondarySort={defaultSecondarySort}
        defaultTertiarySort={defaultTertiarySort}
        defaultQuaternarySort={defaultQuaternarySort}
        defaultShowUnsorted={defaultShowUnsorted}
      />
    </CubeLayout>
  </MainLayout>
);

CubeListPage.propTypes = {
  cube: PropTypes.shape({
    cards: PropTypes.arrayOf(CardPropType).isRequired,
    tag_colors: PropTypes.arrayOf(
      PropTypes.shape({
        tag: PropTypes.string.isRequired,
        color: PropTypes.oneOf(TAG_COLORS.map(([, c]) => c)),
      }),
    ),
    default_sorts: PropTypes.arrayOf(PropTypes.string).isRequired,
    maybe: PropTypes.arrayOf(CardPropType).isRequired,
    _id: PropTypes.string.isRequired,
    owner: PropTypes.string.isRequired,
  }).isRequired,
  defaultShowTagColors: PropTypes.bool.isRequired,
  defaultFilterText: PropTypes.string.isRequired,
  defaultView: PropTypes.string.isRequired,
  defaultPrimarySort: PropTypes.string.isRequired,
  defaultSecondarySort: PropTypes.string.isRequired,
  defaultTertiarySort: PropTypes.string.isRequired,
  defaultQuaternarySort: PropTypes.string.isRequired,
  defaultShowUnsorted: PropTypes.string.isRequired,
  loginCallback: PropTypes.string,
};

CubeListPage.defaultProps = {
  loginCallback: '/',
};

export default RenderToRoot(CubeListPage);
