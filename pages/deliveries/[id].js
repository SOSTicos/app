import { useEffect, useState } from 'react'
import { isEmpty, find, isNil, omitBy } from 'lodash'
import { useSnackbar } from 'notistack'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import CancelIcon from '@material-ui/icons/Cancel'
import Typography from '@material-ui/core/Typography'
import Layout from '../../client/components/layout'
import Button from '../../client/components/button'
import Line from '../../client/components/line'
import { getSession, getHeaders } from '../../client/lib/auth'
import { getHost } from '../../client/lib/utils'
import useApi from '../../client/hooks/api'
import * as api from '../../client/lib/api'
import i18n from '../../shared/lib/i18n'
import { provincias, cantones, distritos, all } from '../../shared/lib/locations'
import { estados } from '../../shared/lib/statuses'
import ImageSelector from '../../client/components/imageselector'

// Constants for dealing with the size of images. These are in pixel units.
// With these values, the image is about 155KB, and the thumbnail is about
// 18KB in size.
const IMG_TARGET_WIDTH = 1024
const THUMBNAIL_TARGET_WIDTH = 256

const useStyles = makeStyles((theme) => ({
  inline: {
    justifyContent: 'space-between',
    flexWrap: 'nowrap',
  },
  inlineControl: {
    width: '48%',
  },
  button: {
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(0),
  },
  paper: {
    padding: 28,
  },
  icon: {
    marginRight: 8,
  },
}))

const DeliveryDetail = ({ user, data, centers = [] }) => {
  const [submitting, setSubmitting] = useState(false)
  const [isPhotoSelected, setPhotoSelected] = useState(false)
  const [photo, setPhoto] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const router = useRouter()
  const styles = useStyles()
  const api = useApi()
  const userId = data._id
  const { enqueueSnackbar: notify } = useSnackbar()

  const { setValue, watch, handleSubmit, reset, errors } = useForm({
    mode: 'onChange',
    defaultValues: {
      deliveryStatus: data.deliveryStatus ? data.deliveryStatus : 0,
      photo: '',
      thumbnail: '',
    },
  })

  const center = find(centers, { _id: data?.centerId }) || {}
  const { province, canton, district } = watch()
  const provinces = Object.keys(all)
  const cantons = province ? Object.keys(all[province] || {}) : []
  const districts = cantons.length > 0 ? Object.keys(all[province][canton] || {}) : []

  useEffect(() => {
    if (!user) router.replace('/signin')
  }, [user])

  useEffect(() => {
    if (province && !provinces.includes(province)) {
      setValue('province', '')
    }
  }, [provinces, province])

  useEffect(() => {
    if (canton && !cantons.includes(canton)) {
      setValue('canton', '')
    }
  }, [cantons, canton])

  useEffect(() => {
    if (district && !districts.includes(district)) {
      setValue('district', '')
    }
  }, [districts, district])

  function backToDeliveries() {
    router.replace('/deliveries')
  }

  // Function called when submitting an updated beneficiary
  const onSubmit = async () => {
    try {
      if (!isPhotoSelected) {
        notify(i18n`No ha seleccionado la foto del donativo`, { variant: 'error' })
        return
      }

      setSubmitting(true)

      // Apply UPDATE: Assgining the carrier Id from the one selected in the drop down. Set status to 1.
      const updateData = {
        deliveryStatus: '2',
        photo,
        thumbnail,
      }

      console.log('data frontend', updateData)

      // Requesting update from the API.
      await api.beneficiaries.update({ ...updateData, id: userId })
      notify(i18n`Paquete marcado como 'ENTREGADO'`, { variant: 'success' })
      backToDeliveries()
    } catch {
      notify(
        i18n`No se pudo marcar el paquete como 'ENTREGADO' en el sistema. Contactar a soporte.`,
        { variant: 'error' }
      )
    } finally {
      setSubmitting(false)
    }
  }

  // Function called when submitting an updated beneficiary
  const onCancel = async () => {
    try {
      setSubmitting(true)

      // Apply UPDATE: the status value means that its delivery is being cancelled.
      data.deliveryStatus = '3'

      // Requesting update from the API.
      await api.beneficiaries.update({ ...data, id: userId })
      notify(i18n`El paquete fue 'CANCELADO'`, { variant: 'success' })
      backToDeliveries()
    } catch {
      notify(i18n`No se pudo cancelar la entrega del paquete en el sistema. Contactar a soporte.`, {
        variant: 'error',
      })
    } finally {
      setSubmitting(false)
    }
  }

  function onImageSelection(imgSelection) {
    if (imgSelection.img) {
      setPhoto(imgSelection.img)
    }

    if (imgSelection.thumbnail) {
      setThumbnail(imgSelection.thumbnail)
    }

    setPhotoSelected(imgSelection.img && imgSelection.thumbnail)
  }

  function resetForm() {
    reset()
    setPhotoSelected(false)
  }

  return (
    <Layout user={user} backLabel="Volver" onBack={() => router.back()} my={0} mx={2}>
      <Typography variant="h1" gutterBottom>
        {i18n`Entrega a Beneficiario`}
      </Typography>

      <div>
        <Box display="flex" justifyContent="flex-end">
          <Button
            size="small"
            className={styles.button}
            fullWidth={false}
            variant="text"
            onClick={backToDeliveries}
          >
            <CancelIcon className={styles.icon} />
            {i18n`Cancelar`}
          </Button>
        </Box>
        <Paper className={styles.paper}>
          <Line label={i18n`Email`} value={data.email} />
          <Line label={i18n`Nombre`} value={data.name} />
          <Line label={i18n`Cédula`} value={data.docId} />
          <Line label={i18n`Teléfono`} value={data.phone} />
          <Line label={i18n`Provincia`} value={provincias[data.province]} />
          <Line label={i18n`Cantón`} value={cantones[data.canton]} />
          <Line label={i18n`Distrito`} value={distritos[data.district]} />
          <Line label={i18n`Otras señas`} value={data.address} />
          <Line label={i18n`Centro de acopio`} value={center.name} />
          <Line label={i18n`Necesidades`} value={data.necesities} />
          <Line label={i18n`Estado`} value={estados[data.status]} />
        </Paper>
        <ImageSelector
          imgTargetWidth={IMG_TARGET_WIDTH}
          thumbnailTargetWidth={THUMBNAIL_TARGET_WIDTH}
          onSelection={onImageSelection}
          isImageSelected={isPhotoSelected}
          useThumbnail={true}
        />
        {isPhotoSelected ? (
          <>
            <Button
              style={{ marginBottom: 0 }}
              type="submit"
              loading={submitting}
              loadingText={i18n`Creando...`}
              disabled={!isEmpty(errors)}
              onClick={handleSubmit(onSubmit)}
            >
              {i18n`Marcar Entregado`}
            </Button>
            <Button variant="outlined" color="secondary" onClick={resetForm}>
              {i18n`Restablecer`}
            </Button>
          </>
        ) : (
          <>
            <Button variant="outlined" color="secondary" onClick={onCancel}>
              {i18n`Eliminar Entrega`}
            </Button>
          </>
        )}
      </div>
    </Layout>
  )
}

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx)
  const { id } = ctx.query

  try {
    const host = getHost(ctx)
    const headers = getHeaders(ctx)

    // Pulls the users with the carrier role from the carriers endpoint.
    const carriersBackend = await api.get(`${host}/api/carriers`, {}, { headers })

    // Formats the data to join the name and the phone for the drop down.
    const carriers = carriersBackend.map((e) => {
      return { _id: e._id, name: `${e.name} - ${e.phone}` }
    })

    // Pulls the beneficiaries from the endpoint.
    const data = await api.get(`${host}/api/beneficiaries/${id}`, {}, { headers })

    // The data and carriers objects MUST have that name if they're implicitely set or have the assignment be explicit.
    return { props: omitBy({ ...session, data, carriers }, isNil) }
  } catch (error) {
    console.log(error)
    return { props: { ...session } }
  }
}

export default DeliveryDetail
