const degree = (deg: number): number => {
  return (deg * Math.PI) / 180;
};

const sleep = async (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export { degree, sleep };
