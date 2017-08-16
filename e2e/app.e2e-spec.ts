import { BlueIvoryClientPage } from './app.po';

describe('blue-ivory-client App', function() {
  let page: BlueIvoryClientPage;

  beforeEach(() => {
    page = new BlueIvoryClientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
