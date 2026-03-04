const CLOUDINARY_UPLOAD_PREFIX = 'https://pga-tour-res.cloudinary.com/image/upload/';

/**
 * Rewrites a Cloudinary headshot URL with optimized transformation parameters
 * for the given display size. Replaces the baked-in transformations (e.g.
 * `c_thumb,g_face,w_280,h_350,z_0.7`) with a face-detected thumbnail crop
 * at the correct resolution, plus auto-format and auto-quality for modern codecs.
 *
 * @param url  The original Cloudinary headshot URL
 * @param size The CSS display size in pixels (used to compute a 3× DPR source)
 */
export function getOptimizedHeadshotUrl(url: string, size: number): string {
  if (!url.startsWith(CLOUDINARY_UPLOAD_PREFIX)) {
    return url;
  }

  const assetPath = url.slice(CLOUDINARY_UPLOAD_PREFIX.length).replace(/^[^/]+\//, '');

  const px = Math.round(size * 3);

  return `${CLOUDINARY_UPLOAD_PREFIX}c_thumb,g_face,z_0.7,w_${px},h_${px},f_auto,q_auto/${assetPath}`;
}
