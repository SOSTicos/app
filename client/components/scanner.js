import { Fragment, useState } from 'react'
import dynamic from 'next/dynamic'
import FormGroup from '@material-ui/core/FormGroup'
import Dialog from './dialog'
import Input from './input'
import * as qs from '../lib/qs'
import i18n from '../lib/i18n'

const QrReader = dynamic(() => import('react-qr-reader'), {
  ssr: false,
  loading: () => null,
})

const Scanner = ({ verifying = false, open = false, onScan, onError, onClose }) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const onAccept = () => {
    onDetect(value)
  }

  const onDetect = (data) => {
    if (!data) return
    console.log('CODE', data)
    const code = data && data.includes('?code=') ? qs.get('code', data) : data
    return onScan(code)
  }

  return (
    <Dialog
      loading={verifying}
      disableAccept={!value}
      title={i18n`Escanear código`}
      open={open}
      onClose={onClose}
      onAccept={onAccept}
    >
      {!verifying ? (
        <Fragment>
          <div style={{ width: '100%' }}>
            <QrReader delay={500} style={{ width: '100%' }} onError={onError} onScan={onDetect} />
          </div>
          <br />
          <FormGroup row>
            <Input
              fullWidth={true}
              value={value}
              autoComplete="off"
              name="code"
              label={i18n`Ingresar código manualmente`}
              size="small"
              onChange={onChange}
            />
          </FormGroup>
        </Fragment>
      ) : (
        <p>{i18n`Ingresando`}</p>
      )}
    </Dialog>
  )
}

export default Scanner
