import { useState, useEffect } from 'react'
import isEmail from 'is-email'
import { isEmpty } from 'lodash'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import FormGroup from '@material-ui/core/FormGroup'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { useForm } from 'react-hook-form'
import Select from '../../client/components/select'
import Input from '../../client/components/input'
import Layout from '../../client/components/layout'
import Button from '../../client/components/button'
import { getSession } from '../../client/lib/auth'
import useApi from '../../client/hooks/api'
import { isPhone, toPhone } from '../../shared/lib/utils'
import { provincias, cantones, distritos, all } from '../../shared/lib/locations'
import i18n from '../../shared/lib/i18n'

const useStyles = makeStyles(() => ({
  inline: {
    justifyContent: 'space-between',
    flexWrap: 'nowrap',
  },
  input: {
    width: '48%',
  },
  inlineControl: {
    width: '48%',
  },
}))

const defaultValues = {
  userId: '',
  name: '',
  phone: '',
  email: '',
  province: '',
  canton: '',
  district: '',
  address: '',
}

const CenterCreate = ({ user }) => {
  const [submitting, setSubmitting] = useState(false)
  const [data, setData] = useState({})
  const router = useRouter()
  const api = useApi()
  const styles = useStyles()
  const { enqueueSnackbar: notify } = useSnackbar()

  useEffect(() => {
    if (!user) router.replace('/signin')
  }, [user])

  const { setValue, watch, control, handleSubmit, errors } = useForm({
    mode: 'onChange',
    defaultValues,
  })

  const { province, canton, district } = watch()
  const provinces = Object.keys(all)
  const cantons = province ? Object.keys(all[province] || {}) : []
  const districts = cantons.length > 0 ? Object.keys(all[province][canton] || {}) : []

  const normalize = (data) => {
    return {
      ...data,
      email: data.email.toLowerCase(),
      phone: toPhone(data.phone),
    }
  }

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

  const onSubmit = async (data) => {
    try {
      setSubmitting(true)
      console.log(normalize(data))
      await api.centers.create(normalize(data))
      router.push('/centers')
    } catch (error) {
      console.log(error)
      notify(i18n`No se pudo crear el centro de acopio`, {
        variant: 'error',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Layout user={user} onBack={() => router.push('/centers')} my={0} mx={0}>
      <Typography variant="h1" gutterBottom>
        {i18n`Crear centro de acopio`}
      </Typography>

      <br />

      <Input
        label={i18n`Nombre`}
        error={Boolean(errors.name)}
        errorText={errors.name && errors.name.message}
        type="text"
        name="name"
        rules={{ required: i18n`Requerido` }}
        control={control}
      />

      <Input
        label={i18n`Email`}
        error={Boolean(errors.email)}
        errorText={errors.email && errors.email.message}
        type="text"
        name="email"
        rules={{
          required: i18n`Requerido`,
          validate: (value) => isEmail(value) || i18n`Email inválido`,
        }}
        control={control}
      />

      <Input
        label={i18n`Teléfono`}
        error={Boolean(errors.phone)}
        errorText={errors.phone && errors.phone.message}
        type="number"
        name="phone"
        rules={{
          required: i18n`Requerido`,
          validate: (value) => isPhone(value, 'CR', true) || i18n`Teléfono inválido`,
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

      {
        //   <Select
        //   name="userId"
        //   label={i18n`Coordinador`}
        //   style={{ width: '100%' }}
        //   rules={{ required: 'Requerido' }}
        //   onChange={onChange}
        // >
        //   <option value="onetime">----</option>
        // </Select>
      }

      <Button
        loading={submitting}
        loadingText={i18n`Enviando datos...`}
        type="submit"
        disabled={submitting || !isEmpty(errors)}
        onClick={handleSubmit(onSubmit)}
      >
        {i18n`Crear`}
      </Button>
      <br />
      <br />
    </Layout>
  )
}

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx)
  return { props: { ...session } }
}

export default CenterCreate
