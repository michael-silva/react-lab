export default class WebWorker {
  constructor(worker) {
    const code = worker.toString();
    const blob = new Blob([`(${code})()`]);
    // eslint-disable-next-line no-constructor-return
    return new Worker(URL.createObjectURL(blob));
  }
}
