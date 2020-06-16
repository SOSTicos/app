import { useState } from 'react'
import { DropzoneArea } from 'material-ui-dropzone'

const ImageSelector = ({
  imgTargetWidth,
  imgTargetHeight,
  thumbnailTargetWidth,
  thumbnailTargetHeight,
  useThumbnail,
  onSelection,
  showThumbnail,
}) => {
  if (!imgTargetWidth && !imgTargetHeight) {
    throw new Error('Either imgTargetWidth or imgTargetHeight must be defined')
  }

  if (useThumbnail && !thumbnailTargetWidth && !thumbnailTargetHeight) {
    throw new Error(
      'Either thumbnailTargetWidth or thumbnailTargetHeight must be defined when using a thumbnail'
    )
  }

  const [selection, setSelection] = useState({ img: '', thumbnail: '' })

  const isPhotoSelected = selection.img.length > 0 && selection.thumbnail.length > 0

  function resizeBase64(imgB64, targetWidth, targetHeight) {
    const img = document.createElement('img')
    img.src = imgB64

    const canvas = document.createElement('canvas')

    // Rescale image. If both width and height are specified, prioritize
    // for width.
    if (targetWidth) {
      canvas.width = targetWidth
      canvas.height = img.height * (targetWidth / img.width)
    } else if (targetHeight) {
      canvas.height = targetHeight
      canvas.width = img.width * (targetHeight / img.height)
    } else {
      canvas.width = img.height
      canvas.height = img.height
    }

    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

    const resizedImgB64 = canvas.toDataURL('image/jpeg')
    return resizedImgB64
  }

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.addEventListener('load', () => resolve(reader.result))
      reader.addEventListener('error', (error) => reject(error))
    })

  const onPhotoSelected = (fileObjs) => {
    const imgFile = fileObjs[0]
    if (imgFile) {
      toBase64(imgFile).then((originalImgB64) => {
        const imgB64 = resizeBase64(originalImgB64, imgTargetWidth, imgTargetHeight)
        const thumbnailB64 = resizeBase64(
          originalImgB64,
          thumbnailTargetWidth,
          thumbnailTargetHeight
        )
        const selection = {
          img: imgB64,
          thumbnail: thumbnailB64,
        }
        setSelection(selection)
        if (onSelection) {
          onSelection(selection)
        }
      })
    }
  }

  let imageCtrl
  if (isPhotoSelected) {
    if (showThumbnail) {
      imageCtrl = (
        <>
          <img id="previewImg" width="100%" src={selection.img} />
          <img id="miniPreviewImg" width="100%" src={selection.thumbnail} />
        </>
      )
    } else {
      imageCtrl = <img id="previewImg" width="100%" src={selection.img} />
    }
  } else {
    imageCtrl = (
      <DropzoneArea
        acceptedFiles={['image/*']}
        dropzoneText="Selecciona la foto de la mercadería"
        filesLimit={1}
        showAlerts={false}
        onChange={onPhotoSelected}
        onDelete={(fileObject) => console.log('Removed File:', fileObject)}
      />
    )
  }

  return imageCtrl
}

export default ImageSelector
