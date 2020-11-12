import { Fragment, useEffect, useState } from 'react'
import { isEmpty, find, isNil, omitBy } from 'lodash'
import { useSnackbar } from 'notistack'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import FormGroup from '@material-ui/core/FormGroup'
import EditIcon from '@material-ui/icons/Edit'
import ClearIcon from '@material-ui/icons/Clear'
import Typography from '@material-ui/core/Typography'
import Layout from '../../client/components/layout'
import Autocomplete from '../../client/components/autocomplete'
import Button from '../../client/components/button'
import Input from '../../client/components/input'
import Line from '../../client/components/line'
import Select from '../../client/components/select'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import { getSession, getHeaders } from '../../client/lib/auth'
import { getHost } from '../../client/lib/utils'
import useApi from '../../client/hooks/api'
import * as api from '../../client/lib/api'
import i18n from '../../shared/lib/i18n'
import { isPhone, toPhone } from '../../shared/lib/utils'
import { provincias, cantones, distritos, all } from '../../shared/lib/locations'
import { estados } from '../../shared/lib/statuses'
import deliveryStatuses from '../../shared/lib/delivery-statuses'

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

const BeneficiaryDetail = ({ user, data, centers = [], carriers = [] }) => {
  const [submitting, setSubmitting] = useState(false)
  const [editting, setEditting] = useState(false)
  const [editDelivery, setEditDelivery] = useState(false)
  const [tabVal, setTabVal] = useState(0)
  const router = useRouter()
  const styles = useStyles()
  const api = useApi()
  const userId = data._id
  const { enqueueSnackbar: notify } = useSnackbar()

  const { setValue, watch, control, handleSubmit, errors } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: data?.name || '',
      docId: data?.docId || '',
      email: data?.email || '',
      phone: (data?.phone || '').replace('+506', ''),
      province: data?.province || '',
      canton: data?.canton || '',
      district: data?.district || '',
      address: data?.address || '',
      necesities: data?.necesities,
      status: data.status,
      deliveryStatus: data.deliveryStatus ? data.deliveryStatus : 0,
      center: data?.centerId ? find(centers, { _id: data?.centerId }) : { _id: '', name: '' },
      carrier: data?.carrierId ? find(carriers, { _id: data?.carrierId }) : { _id: '', name: '' },
    },
  })

  const center = find(centers, { _id: data?.centerId }) || {}
  const carrier = find(carriers, { _id: data?.carrier }) || {}
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

  const normalize = (data) => {
    return omitBy(
      {
        name: data.name,
        docId: data.docId,
        centerId: data?.center?._id,
        phone: toPhone(data.phone),
        email: data.email?.toLowerCase(),
        province: data.province,
        canton: data.canton,
        district: data.district,
        address: data.address,
        necesities: data.necesities,
        status: data.status,
        deliveryStatus: data.deliveryStatus ? data.deliveryStatus : '0',
        carrier: data.carrier ? data.carrier : '0',
      },
      isNil
    )
  }

  const backToBeneficiaries = () => {
    router.replace('/beneficiaries')
  }

  // Function called when submitting an updated beneficiary
  const onSubmit = async (data) => {
    try {
      setSubmitting(true)
      data = normalize(data)
      await api.beneficiaries.update({ ...data, id: userId })
      notify(i18n`Beneficiario actualizado`, { variant: 'success' })
      backToBeneficiaries()
    } catch {
      notify(i18n`No se pudo actualizar el beneficiario`, { variant: 'error' })
    } finally {
      setSubmitting(false)
      setEditting(false)
    }
  }

  // Function called when submitting an updated beneficiary
  const onTransit = async (carrierData) => {
    try {
      setSubmitting(true)

      // Apply UPDATE: Assgining the carrier Id from the one selected in the drop down. Set status to 1.
      const data = {
        carrier: carrierData?.carrier._id,
        deliveryStatus: '1',
      }

      // Requesting update from the API.
      await api.beneficiaries.update({ ...data, id: userId })
      notify(i18n`El paquete esta 'En tránsito'`, { variant: 'success' })
      backToBeneficiaries()
    } catch {
      notify(i18n`No se pudo colocar al paquete 'En tránsito'`, { variant: 'error' })
    } finally {
      setSubmitting(false)
      setEditting(false)
    }
  }

  const onToggleEdit = () => {
    setEditting((editting) => !editting)
  }

  const onToggleEditDelivery = () => {
    setEditDelivery((editDelivery) => !editDelivery)
  }

  const handleTabChange = (event, newValue) => {
    setTabVal(newValue)
  }

  return (
    <Layout user={user} backLabel="Volver" onBack={() => router.back()} my={0} mx={2}>
      <Typography variant="h1" gutterBottom>
        {i18n`Beneficiario`}
      </Typography>

      <Tabs
        value={tabVal}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="Datos generales" />
        {data.status >= 2 && data.status < 4 ? (
          <Tab label="Estado de entrega" />
        ) : (
          <p style={{ cursor: 'none', pointerEvents: 'none' }} disabled={'true'}>
            <Tab label="Estado de entrega" />
          </p>
        )}
      </Tabs>

      <div style={{ display: tabVal === 0 ? '' : 'none' }}>
        <Box display="flex" justifyContent="flex-end">
          <Button
            size="small"
            className={styles.button}
            fullWidth={false}
            variant="text"
            onClick={onToggleEdit}
          >
            {editting ? (
              <ClearIcon className={styles.icon} />
            ) : data.status < 4 ? (
              <EditIcon className={styles.icon} />
            ) : (
              ''
            )}

            {editting ? i18n`Cancelar` : data.status < 4 ? i18n`Editar` : ''}
          </Button>
        </Box>
        {editting ? (
          <Fragment>
            <Input disabled name="email" control={control} label={i18n`Email`} />
            <Input
              name="name"
              label={i18n`Nombre`}
              control={control}
              error={Boolean(errors.name)}
              errorText={errors.name && errors.name.message}
            />

            <Input
              name="docId"
              control={control}
              label={i18n`Cédula`}
              error={Boolean(errors.docId)}
              errorText={errors.docId && errors.docId.message}
            />

            <Input
              label={i18n`Teléfono`}
              error={Boolean(errors.phone)}
              errorText={errors.phone && errors.phone.message}
              type="number"
              name="phone"
              rules={{
                validate: (value) =>
                  !value ? true : isPhone(value, 'CR', true) || i18n`Teléfono inválido`,
              }}
              control={control}
            />

            <Select
              name="province"
              control={control}
              label={i18n`Provincia`}
              rules={{ required: i18n`Requerido` }}
              error={Boolean(errors.province)}
              errorText={errors.province && errors.province.message}
            >
              {provinces.map((code) => (
                <option key={code} value={code}>
                  {provincias[code]}
                </option>
              ))}
            </Select>

            <FormGroup row className={styles.inline}>
              <Select
                name="canton"
                control={control}
                label={i18n`Cantón`}
                rules={{ required: i18n`Requerido` }}
                className={styles.inlineControl}
                error={Boolean(errors.canton)}
                errorText={errors.canton && errors.canton.message}
              >
                {cantons.map((code) => (
                  <option key={code} value={code}>
                    {cantones[code]}
                  </option>
                ))}
              </Select>
              <Select
                name="district"
                control={control}
                label={i18n`Distrito`}
                rules={{ required: i18n`Requerido` }}
                className={styles.inlineControl}
                error={Boolean(errors.district)}
                errorText={errors.district && errors.district.message}
              >
                {districts.map((code) => (
                  <option key={code} value={code}>
                    {distritos[code]}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <Input
              type="text"
              name="address"
              control={control}
              label={i18n`Otras señas`}
              rules={{ required: i18n`Requerido` }}
              error={Boolean(errors.address)}
              errorText={errors.address && errors.address.message}
            />

            <Autocomplete
              label={i18n`Centro de acopio`}
              name="center"
              control={control}
              options={centers}
              error={Boolean(errors.center)}
              errorText={errors.center && errors.center.message}
              rules={{ required: i18n`Requerido` }}
            />

            <Input
              type="text"
              name="necesities"
              control={control}
              label={i18n`Necesidades`}
              error={Boolean(errors.address)}
              errorText={errors.address && errors.address.message}
            />

            <Select
              name="status"
              control={control}
              label={i18n`Estado`}
              rules={{ required: i18n`Requerido` }}
              error={Boolean(errors.status)}
              errorText={errors.status && errors.status.message}
            >
              {estados.map((value, key) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </Select>

            <Button
              style={{ marginBottom: 0 }}
              type="submit"
              loading={submitting}
              loadingText={i18n`Guardando...`}
              disabled={!isEmpty(errors)}
              onClick={handleSubmit(onSubmit)}
            >
              {i18n`Guardar`}
            </Button>
          </Fragment>
        ) : (
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
        )}
      </div>

      <div style={{ display: tabVal === 1 ? '' : 'none' }}>
        <Box display="flex" justifyContent="flex-end">
          <Button
            size="small"
            className={styles.button}
            fullWidth={false}
            variant="text"
            onClick={onToggleEditDelivery}
          >
            {editDelivery ? (
              <ClearIcon className={styles.icon} />
            ) : (
              <EditIcon className={styles.icon} />
            )}
            {editDelivery ? i18n`Cancelar` : i18n`Asignar transportista`}
          </Button>
        </Box>

        {editDelivery ? (
          <Fragment>
            <Autocomplete
              label={i18n`Transportista`}
              name="carrier"
              control={control}
              options={carriers}
              error={Boolean(errors.carriers)}
              errorText={errors.carrier && errors.carrier.message}
            />
            <Button
              style={{ marginBottom: 0 }}
              type="submit"
              loading={submitting}
              loadingText={i18n`Guardando...`}
              disabled={!isEmpty(errors)}
              onClick={handleSubmit(onTransit)}
            >
              {i18n`Guardar`}
            </Button>
          </Fragment>
        ) : (
          <Paper className={styles.paper}>
            <Line label={i18n`Transportista`} value={carrier.name || '--'} />
            <Line
              label={i18n`Estado`}
              value={
                (data.deliveryStatus ? deliveryStatuses[data.deliveryStatus] : false) ||
                deliveryStatuses[0]
              }
            />
          </Paper>
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

export default BeneficiaryDetail
