import { useState, useEffect } from 'react';

function detectPassiveOption() {
  let supportsPassive = false;
  try {
    let opts = Object.defineProperty({}, 'passive', {
      get: function() {
        supportsPassive = true;
      },
    });
    window.addEventListener('testPassive', null, opts);
    window.removeEventListener('testPassive', null, opts);
  } catch (e) {
    return false;
  }

  return supportsPassive;
}


const useInfiniteScroll = (callback, INFINITE_SCROLL_OFFSET = 0) => {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', handleScrollEvent, detectPassiveOption() ? { passive: true } : false);
    return () => {
      window.removeEventListener('scroll', handleScrollEvent, detectPassiveOption() ? { passive: true } : false);
    };
  }, []);

  useEffect(() => {
    if (!isFetching) return;
    callback();
  }, [isFetching]);

  const handleScrollEvent = () => {
    if (window.scrollY + window.innerHeight >= document.body.scrollHeight - INFINITE_SCROLL_OFFSET && !isFetching) {
      setIsFetching(true);
    }
  };

  return {
    isFetching,
    setIsFetching,
  };
};

export default useInfiniteScroll;
