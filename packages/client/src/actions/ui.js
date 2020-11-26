////////////
// Types  //
////////////

export const types = {
  SET_FULLSCREEN: 'UI/SET_FULLSCREEN',
  CALCULATE_RESPONSIVE_STATE: 'UI/CALCULATE_RESPONSIVE_STATE',
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

export function calculateResponsiveState(window) {
  return {
    type: types.CALCULATE_RESPONSIVE_STATE,
    payload: {
      window: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    },
  };
}
