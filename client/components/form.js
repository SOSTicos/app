import React from 'react'

const Form = ({ children, buttonRef, ...props }) => {
  return (
    <form {...props}>
      {children}
      <button type="submit" ref={buttonRef} style={{ display: 'none' }} />
    </form>
  )
}

export default Form
