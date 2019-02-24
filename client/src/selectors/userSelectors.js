export function userAuthenticated(state) {
  const {
    spotify: {
      user: {
        request: {
          errored,
          lastUpdated,
        },
        info: {
          id,
        },
      },
    },
  } = state;

  return !errored && lastUpdated !== null && id !== null;
}
