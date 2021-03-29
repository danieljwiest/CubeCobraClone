import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import CardPropType from 'proptypes/CardPropType';

import { Button, Row, Col, Modal, ModalBody, ModalFooter, ModalHeader, Input, Card } from 'reactstrap';

import { calculateBasicCounts, init } from 'utils/Draft';

const MAX_BASICS = 20;

const BasicsModal = ({ isOpen, toggle, addBasics, deck, draft, basics }) => {
  const [counts, setCounts] = useState(basics.map(() => 0));

  const handleAddBasics = useCallback(() => {
    addBasics(counts);
    setCounts(basics.map(() => 0));
    toggle();
  }, [addBasics, toggle, basics, counts]);

  const calculateBasics = useCallback(async () => {
    const main = deck.playerdeck.flat(2);
    init(draft);
    const { lands } = calculateBasicCounts(main, basics);
    const newCounts = {};
    for (const land of lands) {
      const idx = main.findIndex((c) => c.cardID === land.cardID);
      if (idx < 0) {
        newCounts[land.cardID] = (newCounts[land.cardId] ?? 0) + 1;
      } else {
        main.splice(idx, 1);
      }
    }
    setCounts(basics.map((c) => newCounts[c.cardID] ?? 0));
  }, [deck, draft, setCounts, basics]);

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>Add Basic Lands</ModalHeader>
      <ModalBody>
        <Row>
          {basics.map((card, index) => (
            <Col xs="6" md="3" lg="2" key={`basics-${card.id}`}>
              <Card className="mb-3">
                <img className="w-100" src={card.image_normal} alt={card.name} />
                <Input
                  className="mt-1"
                  type="select"
                  value={counts[index]}
                  onChange={(e) => {
                    const newCount = [...counts];
                    newCount[index] = parseInt(e.target.value, 10);
                    setCounts(newCount);
                  }}
                >
                  {Array.from(new Array(MAX_BASICS).keys()).map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </Input>
              </Card>
            </Col>
          ))}
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button type="submit" color="success" onClick={handleAddBasics}>
          Add
        </Button>
        <Button color="success" onClick={calculateBasics}>
          Calculate
        </Button>
        <Button color="secondary" onClick={toggle}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

BasicsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  addBasics: PropTypes.func.isRequired,
  draft: PropTypes.shape({
    initial_state: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({})))).isRequired,
    synergies: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  }).isRequired,
  deck: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({}))).isRequired,
  basics: PropTypes.arrayOf(CardPropType).isRequired,
};

export default BasicsModal;