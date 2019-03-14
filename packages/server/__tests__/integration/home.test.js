describe('/#/home', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:5000/#/home');
  });

  it('should display a login button when the user is not logged in', async () => {
    await expect(page).toMatch('LOG IN WITH SPOTIFY'); // button text is not ideal
  });

  it('redirects the user to auth when the login button is clicked', async () => {
    page.click('#button-login');
    const response = await page.waitForNavigation();
    const redirectUrls =
      response.request().redirectChain().map(request => request.url());
    // Routing uses Passport to auth with Spotify; this will immediately
    // redirect.
    expect(redirectUrls[0]).toEqual('http://localhost:5000/api/auth/spotify');
    // Hard-coding an external API URL is not ideal but works as a smoke test.
    expect(redirectUrls[1]).toContain('https://accounts.spotify.com/authorize');
  });
});
