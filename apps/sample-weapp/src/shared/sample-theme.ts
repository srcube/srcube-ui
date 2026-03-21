export type SampleTone = 'default' | 'dark';

export const SAMPLE_TONE_STORAGE_KEY = 'srcube-sample-tone';

export function resolveSampleTone(value: unknown): SampleTone {
  return value === 'dark' ? 'dark' : 'default';
}

export function readSampleTone(): SampleTone {
  try {
    return resolveSampleTone(wx.getStorageSync(SAMPLE_TONE_STORAGE_KEY));
  } catch {
    return 'default';
  }
}

export function writeSampleTone(tone: SampleTone) {
  try {
    wx.setStorageSync(SAMPLE_TONE_STORAGE_KEY, tone);
  } catch {
    // Ignore storage errors in sample app.
  }
}
