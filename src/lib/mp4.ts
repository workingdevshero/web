/** Top-level MP4 box types in file order, e.g. ['ftyp', 'moov', 'mdat']. */
export function topLevelBoxes(mp4: Uint8Array): string[] {
  const view = new DataView(mp4.buffer, mp4.byteOffset, mp4.byteLength);
  const boxes: string[] = [];
  for (let offset = 0; offset + 8 <= mp4.length; ) {
    const size = view.getUint32(offset);
    boxes.push(String.fromCharCode(...mp4.subarray(offset + 4, offset + 8)));
    if (size < 8) break;
    offset += size;
  }
  return boxes;
}
