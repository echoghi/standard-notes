/** Via https://davidwalsh.name/javascript-debounce-function */
export function debounce(this: any, func: any, wait: number, immediate = false) {
  let timeout: NodeJS.Timeout | null;
  return () => {
    // eslint-disable-next-line @typescript-eslint/no-this-alias, no-invalid-this
    const context = this;
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    const args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    const callNow = immediate && !timeout;
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
}
