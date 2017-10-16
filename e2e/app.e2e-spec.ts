import { NkdPage } from './app.po';

describe('nkd App', () => {
  let page: NkdPage;

  beforeEach(() => {
    page = new NkdPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
