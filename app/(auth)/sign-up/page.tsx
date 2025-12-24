"use client"

import React from 'react'
import { useForm } from 'react-hook-form'

const SignUp = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: {errors , isSubmitting}
  } = useForm<SignUpFormData>()

  return (
    <>

      <h1 className='form-title'>Sign Up & Personalize</h1>

    
    </>
  )
}

export default SignUp
