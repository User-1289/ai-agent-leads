"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { auth } from "@/lib/firebase"
import BasicInfo from "@/components/onboarding/basic-info"
import SkillsExperience from "@/components/onboarding/skills-experience"
import ServiceAreas from "@/components/onboarding/services"
import Platforms from "@/components/onboarding/platforms"
import { Progress } from "@/components/ui/progress"
import Swal from "sweetalert2"
import { onAuthStateChanged } from "firebase/auth"

export default function Onboarding() {
  const [step, setStep] = useState(1)
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState<{
    fullName: string;
    professionalTitle: string;
    portfolioUrl: string;
    linkedinUrl: string;
    githubUrl: string;
    xUrl: string;
    skills: string[];
    serviceAreas: string[];
    platforms: string[];
    resumeUrl: string;
  }>({
    fullName: "",
    professionalTitle: "",
    portfolioUrl: "",
    linkedinUrl: "",
    githubUrl: "",
    xUrl: "",
    skills: [],
    serviceAreas: [],
    platforms: [],
    resumeUrl: "",
  })

  const router = useRouter()
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })
    
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if(user&&localStorage.getItem('onboard')== 'true'){
      router.push('/dashboard')
    } 
  }, [user])

  const totalSteps = 4
  const progress = (step / totalSteps) * 100

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    setStep((prev) => Math.min(prev + 1, totalSteps))
  }

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1))
  }

  const handleComplete = async () => {
    try {
      const user = auth.currentUser
      
      if (!user) {
        Swal.fire({
          icon: 'error',
          title: 'Authentication Error',
          text: 'You need to be logged in to complete onboarding.',
        })
        return
      }
      
      // Show loading indicator
      Swal.fire({
        title: 'Saving your information',
        text: 'Please wait...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        }
      })
      
      const response = await fetch('/api/onboard-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: user.uid,
          skills: formData.skills,
          services: formData.serviceAreas,
          platform_integrations: formData.platforms,
          name:formData.fullName,
          title:formData.professionalTitle,
          portfolioUrl:formData.portfolioUrl,
          linkedinUrl:formData.linkedinUrl,
          githubUrl:formData.githubUrl,
          xUrl:formData.xUrl,
          resumeUrl:formData.resumeUrl,
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save onboarding data')
      }
      
      // Close the loading indicator
      Swal.close()
      

      // Show success message
      Swal.fire({
        icon: 'info',
        title: 'Profile Created!',
        text: 'Please authorize the reddit account for the app for integration',
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        // Redirect to dashboard
        localStorage.setItem('onboard', 'true')

        router.push('/api/reddit/auth')
        //router.push('/dashboard')
      })
      
    } catch (error) {
      console.log('Error saving onboarding data:', error)
      
      // Show error message
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error instanceof Error ? error.message : 'Something went wrong while saving your profile.',
      })
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Set Up Your Profile</h1>
            <p className="text-gray-600">Let's get you ready to find the perfect clients</p>
            <Progress value={progress} className="mt-4" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {step === 1 && <BasicInfo data={formData} updateData={updateFormData} onNext={nextStep} />}
              {step === 2 && (
                <SkillsExperience data={formData} updateData={updateFormData} onNext={nextStep} onBack={prevStep} />
              )}
              {step === 3 && (
                <ServiceAreas data={formData} updateData={updateFormData} onNext={nextStep} onBack={prevStep} />
              )}
              {step === 4 && (
                <Platforms
                  data={formData}
                  updateData={updateFormData}
                  onBack={prevStep}
                  onComplete={handleComplete}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}