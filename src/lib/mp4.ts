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

/**
 * Pixel size of the first visual track, read from its tkhd box. Audio tracks
 * have a 0×0 tkhd and are skipped. Returns undefined when there is no video.
 */
export function videoSize(mp4: Uint8Array): { width: number; height: number } | undefined {
  const view = new DataView(mp4.buffer, mp4.byteOffset, mp4.byteLength);
  const latin1 = new TextDecoder('latin1').decode(mp4);
  for (let at = latin1.indexOf('tkhd'); at >= 4; at = latin1.indexOf('tkhd', at + 4)) {
    // width and height are 16.16 fixed point, the last 8 bytes of the box.
    const end = at - 4 + view.getUint32(at - 4);
    const width = view.getUint32(end - 8) >>> 16;
    const height = view.getUint32(end - 4) >>> 16;
    if (width > 0 && height > 0) return { width, height };
  }
  return undefined;
}
