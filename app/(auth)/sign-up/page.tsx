"use client"

import InputField from '@/components/Forms/InputField'
import SelectField from '@/components/Forms/SelectField'
import { Button } from '@/components/ui/button'
import { INVESTMENT_GOALS } from '@/lib/constants'
import React from 'react'
import { useForm } from 'react-hook-form'

const SignUp = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: {errors , isSubmitting}
  } = useForm<SignUpFormData>({

    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      country: 'US',
      investmentGoals: 'Growth',
      riskTolerance: 'Medium',
      preferredIndustry: 'Technology'
    },

    mode: 'onBlur'
   
  })

  const onSubmit = async(data:SignUpFormData) => {
    try {

      console.log(data)
      
    } catch (error) {

      console.log(error)
      
    }
  }



  return (
    <>

      <h1 className='form-title'>Sign Up & Personalize</h1>

      <form className='space-y-5' onSubmit={handleSubmit(onSubmit)}>

        {/* INPUTS */}

        {/* -----FULLNAME---------- */}

        <InputField
        name = "fullName"
        label = "Full Name"
        placeholder = "Stephen Johnson"
        register = {register}
        error = {errors.fullName}
        validation = {{required: 'Full Name is required', minLength: 2}}
        />

        {/* -----EMAIL---------- */}

        <InputField
        name = "email"
        label = "Email"
        placeholder = "stephen.johnson@signalist.com"
        register = {register}
        error = {errors.email}
        validation = {{required: 'Email is required', pattern: /^\w+@\w+\.\w+$/, message: 'Email address is required'}}
        />


        {/* -----PASSWORD---------- */}

        <InputField
        name = "password"
        label = "Password"
        placeholder = "Enter a strong password"
        type='password'
        register = {register}
        error = {errors.password}
        validation = {{required: 'Password is required', minLength: 8}}
        />

        {/* -----COUNTRY---------- */}



        {/* -----INVESTMENT GOALS---------- */}

        <SelectField
        name = "investmentGoals"
        label = "Investment Goals"
        placeholder = "Select your Investment Goal"
        options = {INVESTMENT_GOALS}
        control = {control}
        error = {errors.investmentGoals}
        required
        />



        {/* Submit button */}
        <Button type='submit' disabled={isSubmitting} className='yellow-btn w-full mt-5'>

          {
            isSubmitting ? "Creating Account ..." : "Start Your Investment Journey"
          }

        </Button>
      </form>

    
    </>
  )
}

export default SignUp
