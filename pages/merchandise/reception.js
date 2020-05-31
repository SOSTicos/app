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
import { DropzoneArea } from 'material-ui-dropzone'
import Input from '../../client/components/input'
import InputDate from '../../client/components/inputdate'
import { useSnackbar } from 'notistack'

const MerchandiseReception = ({ user }) => {
  const [submitting, setSubmitting] = useState(false)
  const api = useApi()
  const router = useRouter()
  const [photo, setPhoto] = useState(null)
  const { enqueueSnackbar: notify } = useSnackbar()

  const isPhotoSelected = photo !== null

  const todaysDate = new Date()

  // TODO: Deal with collection center
  const { setValue, control, handleSubmit, errors } = useForm({
    mode: 'onChange',
    defaultValues: {
      arrivalDate: todaysDate.toISOString(),
      center: 'POLIDEPORTIVO SANTA CECILIA',
    },
  })

  useEffect(() => {
    if (!user) router.replace('/signin')
  }, [user])

  function normalize(data) {
    return {
      ...data,
      file: photo,
    }
  }

  function backToDashboard() {
    router.replace('/dashboard')
  }

  function resetForm() {
    setValue('arrivalDate', todaysDate.toISOString())
    setPhoto(null)
  }

  const onSubmit = async (data) => {
    try {
      if (photo === null) {
        notify(i18n`No ha seleccionado la foto de la mercadería`, { variant: 'error' })
        return
      }

      setSubmitting(true)
      data = normalize(data)
      await api.merchandise.create(data)
      notify(i18n`Mercadería registrada correctamente`, { variant: 'success' })
      resetForm()
    } catch (error) {
      console.log(error)
      notify(i18n`No se pudo registrar la mercadería`, { variant: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.addEventListener('load', () => resolve(reader.result))
      reader.addEventListener('error', (error) => reject(error))
    })

  const onPhotoSelected = (fileObjs) => {
    const photoFile = fileObjs[0]
    if (photoFile) {
      toBase64(photoFile).then((result) => {
        setPhoto(result)
      })
    }
  }

  const imageSelector = () => {
    let imageCtrl
    if (isPhotoSelected) {
      imageCtrl = (
        <>
          <img width="100%" src={photo} />
        </>
      )
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

  return (
    <Layout user={user} backLabel="Volver" onBack={backToDashboard} my={0} mx={2}>
      <Typography variant="h1" gutterBottom>
        {i18n`Recepción de Mercadería`}
      </Typography>
      <Fragment>
        <Input
          name="center"
          label={i18n`Centro de acopio`}
          control={control}
          inputProps={{
            readOnly: true,
          }}
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
        {imageSelector()}
      </Fragment>
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
