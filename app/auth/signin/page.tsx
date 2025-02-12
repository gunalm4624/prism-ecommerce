import { Navbar } from '@/components/blocks/shadcnblocks-com-navbar1'
import { SignInForm } from '@/components/ui/login-form'
import React from 'react'

const SignUp = () => {
  return (
    <div>
      <div>
      <div className="max-w-xxl p-4">

      <Navbar/>
      </div>
      <SignInForm/>
    </div>
    </div>
  )
}

export default SignUp