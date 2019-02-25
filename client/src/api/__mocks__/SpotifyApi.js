export const mockGetMe = jest.fn();

const mockClass = jest.fn().mockImplementation(() => {
  return {
    getMe: mockGetMe,
  };
});

export default mockClass;
