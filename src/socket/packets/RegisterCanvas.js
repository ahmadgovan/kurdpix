const OP_CODE = 0xA0;

export default {
  OP_CODE,
  hydrate(data) {
    // SERVER (Receiver)
    const canvasId = data[1];
    return canvasId;
  },
  dehydrate(canvasId) {
    // CLIENT (Sender)
    const buffer = new ArrayBuffer(1 + 1);
    const view = new DataView(buffer);
    view.setInt8(0, OP_CODE);
    view.setInt8(1, Number(canvasId));
    return buffer;
  },
};
