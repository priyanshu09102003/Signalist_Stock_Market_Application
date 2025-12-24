"use client"

import { Button } from '@/components/ui/button'
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
