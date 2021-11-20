/* eslint-disable no-plusplus */
// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  self.addEventListener('message', (e) => { // eslint-disable-line no-restricted-globals
    if (!e) return;

    const { names, query } = e.data;

    let filteredNames = names;
    if (query !== '') {
      // eslint-disable-next-line max-len
      filteredNames = names.filter((name) => name.toLowerCase().includes(query.toLowerCase()));
    }

    postMessage(filteredNames);
  });
};
