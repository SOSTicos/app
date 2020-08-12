import { useEffect, useState } from 'react'
import { isEmpty, isNil, omitBy } from 'lodash'
import { useSnackbar } from 'notistack'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import FormGroup from '@material-ui/core/FormGroup'
import Layout from '../../client/components/layout'
import Autocomplete from '../../client/components/autocomplete'
import Button from '../../client/components/button'
import Input from '../../client/components/input'
import Select from '../../client/components/select'
import { getSession } from '../../client/lib/auth'
import useApi from '../../client/hooks/api'
import { isPhone, toPhone, isEmail } from '../../shared/lib/utils'
import i18n from '../../shared/lib/i18n'
import { provincias, cantones, distritos, all } from '../../shared/lib/locations'
import { estados } from '../../shared/lib/statuses'

const useStyles = makeStyles(() => ({
  inline: {
    justifyContent: 'space-between',
    flexWrap: 'nowrap',
  },
  inlineControl: {
    width: '48%',
  },
}))

const BeneficiaryCreate = ({ user, centers = [] }) => {
  const [submitting, setSubmitting] = useState(false)
  const styles = useStyles()
  const router = useRouter()
  const api = useApi()
  const { enqueueSnackbar: notify } = useSnackbar()

  const { watch, control, handleSubmit, errors } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      docId: '',
      email: '',
      phone: '',
      center: '',
      province: '',
      canton: '',
      district: '',
      address: '',
      necesities: '',
      status: '',
    },
  })

  useEffect(() => {
    if (!user) router.replace('/signin')
  }, [user])

  const { province, canton } = watch()
  const provinces = Object.keys(all)
  const cantons = province ? Object.keys(all[province] || {}) : []
  const districts = cantons.length > 0 ? Object.keys(all[province][canton] || {}) : []

  const normalize = (data) => {
    return omitBy(
      {
        name: data.name,
        docId: data.docId,
        centerId: data?.center?._id,
        phone: toPhone(data.phone),
        email: data.email.toLowerCase(),
        province: data.province,
        canton: data.canton,
        district: data.district,
        address: data.address,
        necesities: data.necesities,
        status: data.status,
      },
      isNil
    )
  }

  function backToBeneficiaries() {
    router.replace('/beneficiaries')
  }

  const onSubmit = async (data) => {
    try {
      setSubmitting(true)
      data = normalize(data)
      await api.beneficiaries.create(data)
      notify(i18n`Beneficiario creado`, { variant: 'success' })
      backToBeneficiaries()
    } catch (error) {
      console.log(error)
      notify(i18n`No se pudo crear al beneficiario`, { variant: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Layout user={user} backLabel="Volver" onBack={() => router.back()} my={0} mx={2}>
      <Typography variant="h1" gutterBottom>
        {i18n`Crear beneficiario`}
      </Typography>
      <br />
      <Input
        name="email"
        type="email"
        control={control}
        label={i18n`Email`}
        error={Boolean(errors.email)}
        errorText={errors.email && errors.email.message}
        rules={{
          required: i18n`Requerido`,
          validate: (value) => (!value ? true : isEmail(value) || i18n`Email inválido`),
        }}
      />

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
      />

      <Select
        name="status"
        control={control}
        label={i18n`Estado`}
        error={Boolean(errors.status)}
        errorText={errors.status && errors.status.message}
      >
        {estados.map((value, key) => (
          <option key={key} value={key}>
            {value}
          </option>
        ))}
      </Select>

      <Input
        type="text"
        name="necesities"
        control={control}
        label={i18n`Necesidades`}
        error={Boolean(errors.address)}
        errorText={errors.address && errors.address.message}
      />

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
      <br />
      <br />
      <br />
    </Layout>
  )
}

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx)
  return { props: { ...session } }
}

export default BeneficiaryCreate
