////////////
// Types  //
////////////

export const SET_FULLSCREEN = 'UI/SET_FULLSCREEN';

//////////////////////
// Action creators  //
//////////////////////

export function setFullscreen(fullscreen) {
  return {
    type: SET_FULLSCREEN,
    payload: {
      fullscreen,
    },
  };
}
