import { Fragment, useEffect, useState } from 'react'
import { isEmpty } from 'lodash'
import { getSession } from '../../client/lib/auth'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import useApi from '../../client/hooks/api'
import Button from '../../client/components/button'
import Typography from '@material-ui/core/Typography'
import Layout from '../../client/components/layout'
import i18n from '../../shared/lib/i18n'
import Input from '../../client/components/input'
import InputDate from '../../client/components/inputdate'
import ImageSelector from '../../client/components/imageselector'
import { useSnackbar } from 'notistack'

// Constants for dealing with the size of images. These are in pixel units.
// With these values, the image is about 155KB, and the thumbnail is about
// 18KB in size.
const IMG_TARGET_WIDTH = 1024
const THUMBNAIL_TARGET_WIDTH = 256

const MerchandiseReception = ({ user, centers = [] }) => {
  const [submitting, setSubmitting] = useState(false)
  const [isPhotoSelected, setPhotoSelected] = useState(false)
  const api = useApi()
  const router = useRouter()
  const { enqueueSnackbar: notify } = useSnackbar()

  const todaysDate = new Date()
  const userCenter = centers.filter((center) => center._id === user.centerId)[0]

  const { setValue, control, handleSubmit, reset, errors } = useForm({
    mode: 'onChange',
    defaultValues: {
      arrivalDate: todaysDate.toISOString(),
      centerId: '',
      description: '',
      photo: '',
      thumbnail: '',
    },
  })

  useEffect(() => {
    if (!user) router.replace('/signin')
    if (userCenter) {
      setValue('centerId', userCenter._id)
    } else {
      notify(`El usuario ${user.email} no tiene centro de acopio asociado`, { variant: 'error' })
      router.replace('/signin')
    }
  }, [user])

  function backToDashboard() {
    router.replace('/dashboard')
  }

  function onImageSelection(imgSelection) {
    if (imgSelection.img) {
      setValue('photo', imgSelection.img)
    }

    if (imgSelection.thumbnail) {
      setValue('thumbnail', imgSelection.thumbnail)
    }

    setPhotoSelected(imgSelection.img && imgSelection.thumbnail)
  }

  function resetForm() {
    reset()
    setPhotoSelected(false)
  }

  const onSubmit = async (data) => {
    try {
      if (!isPhotoSelected) {
        notify(i18n`No ha seleccionado la foto del donativo`, { variant: 'error' })
        return
      }

      setSubmitting(true)
      await api.merchandise.create(data)
      notify(i18n`Donativo registrado correctamente`, { variant: 'success' })
      resetForm()
    } catch (error) {
      console.log(error)
      notify(i18n`No se pudo registrar el donativo`, { variant: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Layout user={user} backLabel="Volver" onBack={() => router.back()} my={0} mx={2}>
      <Typography variant="h1" gutterBottom>
        {i18n`Recepción de donativo`}
      </Typography>

      <Fragment>
        <Input
          name="center"
          label={i18n`Centro de acopio`}
          inputProps={{
            readOnly: true,
          }}
          value={userCenter ? userCenter.name : ''}
          error={Boolean(errors.name)}
          errorText={errors.name && errors.name.message}
        />
        <InputDate
          name="arrivalDate"
          label={i18n`Fecha de ingreso`}
          control={control}
          okLabel="Aceptar"
          cancelLabel="Cancelar"
          maxDate={todaysDate}
          error={Boolean(errors.name)}
          errorText={errors.name && errors.name.message}
        />
        <Input
          name="description"
          label={i18n`Descripción`}
          error={Boolean(errors.name)}
          errorText={errors.name && errors.name.message}
        />
      </Fragment>
      <ImageSelector
        imgTargetWidth={IMG_TARGET_WIDTH}
        thumbnailTargetWidth={THUMBNAIL_TARGET_WIDTH}
        onSelection={onImageSelection}
        isImageSelected={isPhotoSelected}
        useThumbnail={true}
      />
      <div id="hiddenFields" style={{ display: 'none' }}>
        <Input
          name="centerId"
          control={control}
          inputProps={{
            readOnly: true,
          }}
        />
        <Input
          name="photo"
          control={control}
          inputProps={{
            readOnly: true,
          }}
        />
        <Input
          name="thumbnail"
          control={control}
          inputProps={{
            readOnly: true,
          }}
        />
      </div>
      {isPhotoSelected && (
        <>
          <Button
            style={{ marginBottom: 0 }}
            type="submit"
            loading={submitting}
            loadingText={i18n`Creando...`}
            disabled={!isEmpty(errors)}
            onClick={handleSubmit(onSubmit)}
          >
            {i18n`Crear`}
          </Button>
          <Button variant="outlined" color="secondary" onClick={resetForm}>
            {i18n`Restablecer`}
          </Button>
        </>
      )}
      {!isPhotoSelected && (
        <Button
          style={{ marginBottom: 0 }}
          variant="outlined"
          color="secondary"
          loading={submitting}
          loadingText={i18n`Creando...`}
          onClick={backToDashboard}
        >
          {i18n`Finalizar`}
        </Button>
      )}
    </Layout>
  )
}

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx)
  return { props: { ...session } }
}

export default MerchandiseReception
