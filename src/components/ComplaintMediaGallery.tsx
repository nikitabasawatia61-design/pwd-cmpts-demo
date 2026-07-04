import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageOff, X, ZoomIn } from 'lucide-react';
import type { ComplaintMedia } from '@/types';

export default function ComplaintMediaGallery({
  media,
  title,
}: {
  media: ComplaintMedia[];
  title?: string;
}) {
  const { t } = useTranslation();
  const [lightbox, setLightbox] = useState<ComplaintMedia | null>(null);

  if (media.length === 0) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-400">
        <ImageOff className="h-5 w-5 flex-shrink-0" />
        {t('noMediaAttached')}
      </div>
    );
  }

  return (
    <>
      <div>
        {title && <h3 className="mb-3 text-sm font-semibold text-pwd-navy">{title}</h3>}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {media.map((m) => {
            const isVideo = m.type.startsWith('video/');
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setLightbox(m)}
                className="group relative overflow-hidden rounded-lg border border-slate-200 bg-slate-100 text-left"
              >
                {isVideo ? (
                  <video src={m.dataUrl} className="h-32 w-full object-cover" muted />
                ) : (
                  <img src={m.dataUrl} alt={m.name} className="h-32 w-full object-cover" loading="lazy" />
                )}
                <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/30">
                  <ZoomIn className="h-6 w-6 text-white opacity-0 transition group-hover:opacity-100" />
                </span>
                <span className="absolute bottom-0 left-0 right-0 truncate bg-black/55 px-2 py-1 text-[10px] text-white">
                  {m.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            onClick={() => setLightbox(null)}
            aria-label={t('back')}
          >
            <X className="h-6 w-6" />
          </button>
          <div className="max-h-[90vh] max-w-4xl" onClick={(e) => e.stopPropagation()}>
            {lightbox.type.startsWith('video/') ? (
              <video src={lightbox.dataUrl} controls autoPlay className="max-h-[85vh] max-w-full rounded-lg" />
            ) : (
              <img src={lightbox.dataUrl} alt={lightbox.name} className="max-h-[85vh] max-w-full rounded-lg object-contain" />
            )}
            <p className="mt-2 text-center text-sm text-white/80">{lightbox.name}</p>
          </div>
        </div>
      )}
    </>
  );
}
