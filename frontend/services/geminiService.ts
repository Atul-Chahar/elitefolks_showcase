export const startLiveSession = async (...args: any[]) => {
  return {
    sendRealtimeInput: () => {},
    sendToolResponse: () => {},
    close: () => {}
  }
};
export const createPcmBlob = () => new Blob();
export type LiveSession = any;
