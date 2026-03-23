import {
  Button,
  ButtonGroup,
  ImagePreview,
  Image as SrcubeImage,
} from '@srcube-ui/react';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import PageHeader from '@/components/page-header';

export const Route = createFileRoute('/image')({
  component: ImageDemo,
});

const IMAGE_DEMO_URLS = {
  basic: 'https://picsum.photos/id/1015/200/200',
  video: 'https://picsum.photos/id/1002/800/450',
  photo: 'https://picsum.photos/id/1011/1200/900',
  previewThumb: 'https://picsum.photos/id/1015/600/600',
  previewMain: 'https://picsum.photos/id/1015/1200/1200',
  previewAlt: 'https://picsum.photos/id/1016/1200/1200',
} as const;

const ratioOptions = [
  { label: 'Auto', value: 'auto' },
  { label: 'Square', value: 'square' },
  { label: 'Video', value: 'video' },
  { label: 'Photo', value: 'photo' },
] as const;

const radiusOptions = [
  { label: 'None', value: 'none' },
  { label: 'SM', value: 'sm' },
  { label: 'MD', value: 'md' },
  { label: 'LG', value: 'lg' },
] as const;

const fitOptions = [
  { label: 'Cover', value: 'cover' },
  { label: 'Contain', value: 'contain' },
  { label: 'Fill', value: 'fill' },
  { label: 'None', value: 'none' },
] as const;

type ImageRatio = (typeof ratioOptions)[number]['value'];
type ImageRadius = (typeof radiusOptions)[number]['value'];
type ImageFit = (typeof fitOptions)[number]['value'];
type ImageTone = 'default' | 'dark';

function Card({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: ImageTone;
}) {
  return (
    <section
      className={[
        'rounded-2xl p-4 shadow-sm transition-colors duration-200',
        tone === 'dark'
          ? 'bg-zinc-900 text-zinc-50 shadow-black/20'
          : 'bg-white text-slate-900',
      ].join(' ')}
    >
      {children}
    </section>
  );
}

function ImageDemo() {
  const [tone, setTone] = useState<ImageTone>('default');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [demoRatio, setDemoRatio] = useState<ImageRatio>('video');
  const [demoRadius, setDemoRadius] = useState<ImageRadius>('lg');
  const [demoFit, setDemoFit] = useState<ImageFit>('cover');
  const ratioPreviewSrc =
    demoRatio === 'video' ? IMAGE_DEMO_URLS.video : IMAGE_DEMO_URLS.photo;
  const buttonTone = tone === 'dark' ? 'dark' : 'light';
  const descriptionClassName =
    tone === 'dark'
      ? 'mt-1 text-xs text-zinc-400'
      : 'mt-1 text-xs text-slate-500';

  return (
    <main
      className={[
        'min-h-screen pb-safe-4 transition-colors duration-200',
        tone === 'dark'
          ? 'bg-zinc-950 text-zinc-50'
          : 'bg-slate-100 text-slate-900',
      ].join(' ')}
    >
      <PageHeader title="Image" tone={tone} />

      <div className="space-y-6 p-4">
        <Card tone={tone}>
          <div className="text-sm font-semibold">Tone</div>
          <div className="mt-3 flex gap-2">
            <Button
              size="sm"
              color={tone === 'default' ? 'primary' : 'default'}
              variant={tone === 'default' ? 'solid' : 'flat'}
              onTap={() => {
                setTone('default');
              }}
            >
              default
            </Button>
            <Button
              size="sm"
              tone="dark"
              variant={tone === 'dark' ? 'solid' : 'flat'}
              onTap={() => {
                setTone('dark');
              }}
            >
              dark
            </Button>
          </div>
        </Card>

        <Card tone={tone}>
          <div className="text-sm font-semibold">Basic / State</div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <SrcubeImage
              tone={tone}
              src={IMAGE_DEMO_URLS.basic}
              className="aspect-square w-full"
            />
            <SrcubeImage
              tone={tone}
              src="https://invalid.srcube-ui.dev/fail.png"
              fallback="Load failed"
              className="aspect-square w-full"
            />
            <SrcubeImage
              tone={tone}
              fallback="No src"
              className="aspect-square w-full"
            />
          </div>
        </Card>

        <Card tone={tone}>
          <div className="text-sm font-semibold">Ratio / Radius / Fit</div>
          <div className={descriptionClassName}>
            use ButtonGroup to switch ratio, radius and fit
          </div>
          <div className="mt-3 space-y-2">
            <ButtonGroup size="sm" tone={buttonTone} isBlock>
              {ratioOptions.map((option) => (
                <Button
                  key={option.value}
                  color={demoRatio === option.value ? 'primary' : 'default'}
                  variant={demoRatio === option.value ? 'solid' : 'flat'}
                  onTap={() => {
                    setDemoRatio(option.value);
                  }}
                >
                  {option.label}
                </Button>
              ))}
            </ButtonGroup>

            <ButtonGroup size="sm" tone={buttonTone} isBlock>
              {radiusOptions.map((option) => (
                <Button
                  key={option.value}
                  color={demoRadius === option.value ? 'primary' : 'default'}
                  variant={demoRadius === option.value ? 'solid' : 'flat'}
                  onTap={() => {
                    setDemoRadius(option.value);
                  }}
                >
                  {option.label}
                </Button>
              ))}
            </ButtonGroup>

            <ButtonGroup size="sm" tone={buttonTone} isBlock>
              {fitOptions.map((option) => (
                <Button
                  key={option.value}
                  color={demoFit === option.value ? 'primary' : 'default'}
                  variant={demoFit === option.value ? 'solid' : 'flat'}
                  onTap={() => {
                    setDemoFit(option.value);
                  }}
                >
                  {option.label}
                </Button>
              ))}
            </ButtonGroup>
          </div>
          <div className="mt-3">
            <SrcubeImage
              tone={tone}
              isBlock
              ratio={demoRatio}
              radius={demoRadius}
              fit={demoFit}
              src={ratioPreviewSrc}
            />
          </div>
        </Card>

        <Card tone={tone}>
          <div className="text-sm font-semibold">Preview</div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <SrcubeImage
              tone={tone}
              src={IMAGE_DEMO_URLS.previewThumb}
              previewSrc={IMAGE_DEMO_URLS.previewMain}
              isPreviewable
              className="aspect-square w-full"
              previewUrls={[
                IMAGE_DEMO_URLS.previewMain,
                IMAGE_DEMO_URLS.previewAlt,
              ]}
            />
            <button
              type="button"
              className={[
                'rounded-xl border px-3 py-2 text-sm font-medium transition-colors duration-200',
                tone === 'dark'
                  ? 'border-zinc-700 bg-zinc-950 text-zinc-100'
                  : 'border-slate-200 bg-white text-slate-900',
              ].join(' ')}
              onClick={() => {
                setPreviewOpen(true);
              }}
            >
              Open ImagePreview
            </button>
          </div>
        </Card>
      </div>

      <ImagePreview
        src={IMAGE_DEMO_URLS.previewMain}
        tone={tone}
        isOpen={previewOpen}
        onOpenChange={setPreviewOpen}
      />
    </main>
  );
}
