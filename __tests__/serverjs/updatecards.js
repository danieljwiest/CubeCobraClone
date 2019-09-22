const rimraf = require("rimraf");
const updatecards = require("../../serverjs/updatecards");
const fs = require('fs');

beforeEach(() => {
  rimraf.sync("private");
});

afterEach(() => {
  rimraf.sync("private");
});

test("updateCardbase creates the expected files", () => {
  expect.assertions(7);
  var noopPromise = new Promise((resolve, reject) => {
    process.nextTick(() => {
      resolve();
    });
  });
  var downloadMock = jest.fn();
  downloadMock.mockReturnValue(noopPromise);
  updatecards.downloadDefaultCards = downloadMock;
  return updatecards.updateCardbase('__tests__/fixtures/cards_small.json').then(function() {
    expect(fs.existsSync('private/cardtree.json')).toBe(true);
    expect(fs.existsSync('private/imagedict.json')).toBe(true);
    expect(fs.existsSync('private/cardimages.json')).toBe(true);
    expect(fs.existsSync('private/names.json')).toBe(true);
    expect(fs.existsSync('private/carddict.json')).toBe(true);
    expect(fs.existsSync('private/nameToId.json')).toBe(true);
    expect(fs.existsSync('private/full_names.json')).toBe(true);
  });
});

test("addCardToCatalog", () => {
  // make internal members public, verify that they have been populated
});

test("saveAllCards", () => {
  // do in test what updateCardbase does before call to saveAllCards
  // use that as input to saveallcards for test
  // requires an unload function to be run before every test
});

test("convertCard", () => {});
test("convertExtraCard", () => {});