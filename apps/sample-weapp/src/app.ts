import {
  readSampleTone,
  resolveSampleTone,
  writeSampleTone,
  type SampleTone,
} from './shared/sample-theme';

type SampleToneListener = (tone: SampleTone) => void;

App({
  globalData: {
    sampleTone: 'default' as SampleTone,
  },

  _sampleToneListeners: [] as SampleToneListener[],

  onLaunch() {
    this.globalData.sampleTone = readSampleTone();
  },

  getSampleTone() {
    return resolveSampleTone(this.globalData.sampleTone);
  },

  setSampleTone(tone: SampleTone) {
    const resolvedTone = resolveSampleTone(tone);
    this.globalData.sampleTone = resolvedTone;
    writeSampleTone(resolvedTone);

    this._sampleToneListeners.forEach((listener) => {
      listener(resolvedTone);
    });
  },

  subscribeSampleTone(listener: SampleToneListener) {
    this._sampleToneListeners.push(listener);

    return () => {
      this._sampleToneListeners = this._sampleToneListeners.filter(
        (candidate) => candidate !== listener,
      );
    };
  },
});
