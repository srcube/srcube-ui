import {
  Image as SrcubeImage,
  ImagePreview,
} from '@srcube-ui/react';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import PageHeader from '@/components/page-header';

export const Route = createFileRoute('/image')({
  component: ImageDemo,
});

function Card({ children }: { children: React.ReactNode }) {
  return <section className="rounded-2xl bg-white p-4 shadow-sm">{children}</section>;
}

function ImageDemo() {
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-100 pb-safe-4 text-slate-900">
      <PageHeader title="Image" />

      <div className="space-y-6 p-4">
        <Card>
          <div className="text-sm font-semibold">Basic / State</div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <SrcubeImage src="https://picsum.photos/200/200?random=11" />
            <SrcubeImage src="https://invalid.srcube-ui.dev/fail.png" fallback="Load failed" />
            <SrcubeImage fallback="No src" />
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">Ratio / Radius / Fit</div>
          <div className="mt-3 space-y-3">
            <SrcubeImage
              isBlock
              ratio="video"
              radius="lg"
              src="https://picsum.photos/800/450?random=13"
            />
            <SrcubeImage
              isBlock
              ratio="photo"
              fit="contain"
              radius="sm"
              src="https://picsum.photos/1200/900?random=14"
            />
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">Preview</div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <SrcubeImage
              src="https://picsum.photos/600/600?random=15"
              isPreviewable
              previewUrls={[
                'https://picsum.photos/1200/1200?random=15',
                'https://picsum.photos/1200/1200?random=16',
              ]}
            />
            <button
              type="button"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium"
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
        src="https://picsum.photos/1000/800?random=17"
        isOpen={previewOpen}
        onOpenChange={setPreviewOpen}
      />
    </main>
  );
}
