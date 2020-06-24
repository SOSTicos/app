import { useEffect, useState } from 'react'
import { isEmpty, isNil, omitBy } from 'lodash'
import { useSnackbar } from 'notistack'
import Typography from '@material-ui/core/Typography'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import Layout from '../../client/components/layout'
import Autocomplete from '../../client/components/autocomplete'
import Button from '../../client/components/button'
import Input from '../../client/components/input'
import Select from '../../client/components/select'
import { getSession } from '../../client/lib/auth'
import useApi from '../../client/hooks/api'
import { isPhone, toPhone } from '../../shared/lib/utils'
import i18n from '../../shared/lib/i18n'

const VolunteerCreate = ({ user, centers = [] }) => {
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const api = useApi()
  const { enqueueSnackbar: notify } = useSnackbar()

  const { control, handleSubmit, errors } = useForm({
    mode: 'onChange',
    defaultValues: {
      role: 'member',
      name: '',
      docId: '',
      email: '',
      phone: '',
      center: '',
    },
  })

  useEffect(() => {
    if (!user) router.replace('/signin')
  }, [user])

  const normalize = (data) => {
    return omitBy(
      {
        name: data.name,
        role: data.role,
        docId: data.docId,
        centerId: data?.center?._id,
        phone: toPhone(data.phone),
        email: data.email.toLowerCase(),
      },
      isNil
    )
  }

  const onSubmit = async (data) => {
    try {
      setSubmitting(true)
      data = normalize(data)
      await api.users.create(data)
      notify(i18n`Voluntario creado`, { variant: 'success' })
    } catch (error) {
      console.log(error)
      notify(i18n`No se pudo crear al voluntario`, { variant: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Layout user={user} backLabel="Volver" onBack={() => router.back()} my={0} mx={2}>
      <Typography variant="h1" gutterBottom>
        {i18n`Crear voluntario`}
      </Typography>
      <br />
      <Input
        name="email"
        control={control}
        label={i18n`Email`}
        rules={{ required: i18n`Requerido` }}
        error={Boolean(errors.email)}
        errorText={errors.email && errors.email.message}
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
        name="role"
        control={control}
        label={i18n`Rol`}
        rules={{ required: i18n`Requerido` }}
        error={Boolean(errors.role)}
        errorText={errors.role && errors.role.message}
      >
        <option value="admin">{i18n`Administrador`}</option>
        <option value="coordinator">{i18n`Coordinador`}</option>
        <option value="carrier">{i18n`Transportista`}</option>
        <option value="member">{i18n`Miembro`}</option>
      </Select>

      <Autocomplete
        label={i18n`Centro de acopio`}
        name="center"
        control={control}
        options={centers}
        error={Boolean(errors.center)}
        errorText={errors.center && errors.center.message}
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
    </Layout>
  )
}

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx)
  return { props: { ...session } }
}

export default VolunteerCreate
