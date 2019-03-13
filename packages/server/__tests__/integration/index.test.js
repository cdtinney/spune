describe('/', () => {
  it('should load without error and redirect to /#/home', async () => {
    await page.goto('http://localhost:5000/');
    expect(await page.title()).toEqual('spune');
    expect(await page.url()).toEqual('http://localhost:5000/#/home');
  });
});
