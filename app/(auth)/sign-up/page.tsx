"use client"

import { CountrySelectField } from '@/components/Forms/CountrySelectField'
import FooterLink from '@/components/Forms/FooterLink'
import InputField from '@/components/Forms/InputField'
import SelectField from '@/components/Forms/SelectField'
import { Button } from '@/components/ui/button'
import { INVESTMENT_GOALS, PREFERRED_INDUSTRIES, RISK_TOLERANCE_OPTIONS } from '@/lib/constants'
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

        <CountrySelectField
        name='country'
        label = "Country"
        control = {control}
        error = {errors.country}
        required
        />


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


        {/* -----RISK TOLERANCE---------- */}

        <SelectField
        name = "riskTolerance"
        label = "Risk Tolerance"
        placeholder = "Select your Risk Tolerance Level"
        options = {RISK_TOLERANCE_OPTIONS}
        control = {control}
        error = {errors.riskTolerance}
        required
        />



        {/* -----PREFERRED INDUSTRY---------- */}

        <SelectField
        name = "prefferedIndustry"
        label = "Preferred Industry"
        placeholder = "Select your Preferred Industry"
        options = {PREFERRED_INDUSTRIES}
        control = {control}
        error = {errors.preferredIndustry}
        required
        />



        {/* Submit button */}
        <Button type='submit' disabled={isSubmitting} className='yellow-btn w-full mt-5'>

          {
            isSubmitting ? "Creating Account ..." : "Start Your Investment Journey"
          }

        </Button>

        <FooterLink
        text='Already have an account? ' 
        linkText='Sign In'
        href='/sign-in'
        />
      </form>

    
    </>
  )
}

export default SignUp
