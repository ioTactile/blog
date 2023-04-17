export default async () => {
  const supportVideoType = (type: 'vp9'|'av1'|'h265') => {
    let video

    const formats = {
      vp9: 'video/webm; codecs="vp9"',
      av1: 'video/mp4; codecs="av01.0.08M.08"',
      h265: 'video/mp4; codecs="hvc1"'
    }

    if (!video) {
      video = document.createElement('video')
    }

    if (video.canPlayType(formats[type] || type) === 'probably') {
      return true
    } else {
      return false
    }
  }

  const vp9Available = supportVideoType('vp9')
  const av1Available = supportVideoType('av1')
  const h265Available = supportVideoType('h265')

  const supportsWebp = new Promise<boolean>((resolve) => {
    const image = new Image()
    image.onerror = () => resolve(false)
    image.onload = () => resolve(image.width === 1)
    image.src =
        'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA='
  }).catch(() => false)

  const supportsAvif = async () => {
    try {
      if (!createImageBitmap) { return false }
      const avifData =
          'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A='
      const blob = await fetch(avifData).then(r => r.blob())
      return createImageBitmap(blob).then(
        () => true,
        () => false
      )
    } catch (e) {
      return false
    }
  }

  return {
    vp9Available,
    av1Available,
    h265Available,
    webpAvailable: await supportsWebp,
    avifAvailable: await supportsAvif()
  }
}
