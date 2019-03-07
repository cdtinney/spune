////////////
// Types  //
////////////

export const types = {
  SET_FULLSCREEN: 'UI/SET_FULLSCREEN',
};

//////////////////////
// Action creators  //
//////////////////////

export function setFullscreen(fullscreen) {
  return {
    type: types.SET_FULLSCREEN,
    payload: {
      fullscreen,
    },
  };
}
