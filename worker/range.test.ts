import { describe, expect, it } from 'vitest';
import { parseRange, withRangeSupport } from './range';

const BODY = new Uint8Array(Array.from({ length: 100 }, (_, i) => i));

function asset(): Response {
  return new Response(BODY, {
    status: 200,
    headers: { 'Content-Type': 'video/mp4', 'Content-Length': '100', 'Cache-Control': 'public, max-age=86400' },
  });
}

function get(range?: string, method = 'GET'): Request {
  return new Request('https://workingdevshero.com/og-video.mp4', {
    method,
    headers: range ? { Range: range } : {},
  });
}

describe('parseRange', () => {
  it('reads an explicit range', () => {
    expect(parseRange('bytes=0-1', 100)).toEqual({ start: 0, end: 1 });
  });

  it('reads an open-ended range to the end of the file', () => {
    expect(parseRange('bytes=90-', 100)).toEqual({ start: 90, end: 99 });
  });

  it('reads a suffix range as the last N bytes', () => {
    expect(parseRange('bytes=-10', 100)).toEqual({ start: 90, end: 99 });
    expect(parseRange('bytes=-500', 100)).toEqual({ start: 0, end: 99 });
  });

  it('clamps an end past the file to the last byte', () => {
    expect(parseRange('bytes=50-1000', 100)).toEqual({ start: 50, end: 99 });
  });

  it('flags a start past the end of the file as unsatisfiable', () => {
    expect(parseRange('bytes=100-', 100)).toBe('unsatisfiable');
  });

  it('ignores missing, malformed and multi-range headers', () => {
    expect(parseRange(null, 100)).toBeNull();
    expect(parseRange('bytes=-', 100)).toBeNull();
    expect(parseRange('items=0-1', 100)).toBeNull();
    expect(parseRange('bytes=0-1,5-6', 100)).toBeNull();
    expect(parseRange('bytes=5-1', 100)).toBeNull();
  });
});

describe('withRangeSupport', () => {
  it('answers a range request with 206 and just those bytes', async () => {
    const res = await withRangeSupport(get('bytes=0-1'), asset());
    expect(res.status).toBe(206);
    expect(res.headers.get('Content-Range')).toBe('bytes 0-1/100');
    expect(res.headers.get('Content-Length')).toBe('2');
    expect(res.headers.get('Content-Type')).toBe('video/mp4');
    expect(res.headers.get('Cache-Control')).toBe('public, max-age=86400');
    expect([...new Uint8Array(await res.arrayBuffer())]).toEqual([0, 1]);
  });

  it('advertises range support on a plain request', async () => {
    const res = await withRangeSupport(get(), asset());
    expect(res.status).toBe(200);
    expect(res.headers.get('Accept-Ranges')).toBe('bytes');
    expect((await res.arrayBuffer()).byteLength).toBe(100);
  });

  it('answers an unsatisfiable range with 416', async () => {
    const res = await withRangeSupport(get('bytes=200-'), asset());
    expect(res.status).toBe(416);
    expect(res.headers.get('Content-Range')).toBe('bytes */100');
  });

  it('sends the whole file for a range it does not handle', async () => {
    const res = await withRangeSupport(get('bytes=0-1,5-6'), asset());
    expect(res.status).toBe(200);
    expect((await res.arrayBuffer()).byteLength).toBe(100);
  });

  it('passes through anything that is not a 200', async () => {
    const notFound = new Response('not found', { status: 404 });
    expect(await withRangeSupport(get('bytes=0-1'), notFound)).toBe(notFound);
  });
});
