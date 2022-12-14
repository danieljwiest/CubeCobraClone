const carddb = require('../../serverjs/cards');

const COLORS = ['W', 'U', 'B', 'R', 'G'];
const DEFAULT_FINISH = 'Non-foil';
const DEFAULT_STATUS = 'Not Owned';

const isInvalidCardId = (id) => carddb.cardFromId(id).name === 'Invalid Card';
const isInvalidFinish = (finish) => !['Foil', 'Non-foil'].includes(finish);
const isInvalidStatus = (status) => !['Not Owned', 'Ordered', 'Owned', 'Premium Owned', 'Proxied'].includes(status);
const isInvalidColors = (colors) => !colors || !Array.isArray(colors) || colors.some((c) => !COLORS.includes(c));
const isInvalidTags = (tags) => !tags || tags.some((t) => !t);

const partition = (collection, predicate) => {
  const pass = [];
  const fail = [];
  for (const elem of collection) {
    if (predicate(elem)) pass.push(elem);
    else fail.push(elem);
  }
  return [pass, fail];
};

const cleanCards = (collection, filter = true) => {
  let valid = collection;
  let invalid = [];
  if (filter) {
    [valid, invalid] = partition(collection, (c) => c && !isInvalidCardId(c.cardID));
  }
  for (const card of valid) {
    if (isInvalidFinish(card.finish)) card.finish = DEFAULT_FINISH;
    if (isInvalidStatus(card.status)) card.status = DEFAULT_STATUS;
    if (isInvalidColors(card.colors)) card.colors = carddb.cardFromId(card.cardID).color_identity;
    if (isInvalidTags(card.tags)) card.tags = (card.tags || []).filter((t) => t);
  }
  return [valid, invalid];
};

const cardsNeedsCleaning = (collection) =>
  collection.some(
    (card) =>
      !card ||
      isInvalidCardId(card.cardID) ||
      isInvalidFinish(card.finish) ||
      isInvalidStatus(card.status) ||
      isInvalidColors(card.colors) ||
      isInvalidTags(card.tags),
  );

module.exports = {
  cleanCards,
  cardsNeedsCleaning,
};
