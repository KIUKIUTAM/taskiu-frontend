import { lazy } from 'react';

/**

 * @param importFunc 
 * @param minDelay 
 */
export const lazyWithDelay = (importFunc: () => Promise<any>, minDelay: number = 2500) => {
  return lazy(() => {
    return Promise.all([
      importFunc(),
      new Promise(resolve => setTimeout(resolve, minDelay))
    ]).then(([moduleExports]) => moduleExports);
  });
};
