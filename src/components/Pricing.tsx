'use client'
import { Check } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function PricingPage() {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId: "price_1RAosPRp27JASmlNdkbztYwl" }), // Replace with your actual Stripe price ID
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Failed to redirect to Stripe Checkout");
      }
    } catch (error) {
      console.error("Error during subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-16 px-4 md:px-6">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Pricing</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that's right for you and start automating your lead generation process today.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Free Tier */}
        <Card className="flex flex-col border-2">
          <CardHeader className="flex flex-col space-y-1.5">
            <CardTitle className="text-2xl">Free</CardTitle>
            <CardDescription>Perfect for getting started</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-muted-foreground ml-2">/month</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-3">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <span>5 campaign creations</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <span>Limited message creation (20)</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <span>Limited automated messaging</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <span>Basic analytics</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <span>Email support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline">
              Get Started
            </Button>
          </CardFooter>
        </Card>

        {/* Pro Tier */}
        <Card className="flex flex-col border-2 border-primary relative">
          <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
            <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
              Popular
            </span>
          </div>
          <CardHeader className="flex flex-col space-y-1.5">
            <CardTitle className="text-2xl">Pro</CardTitle>
            <CardDescription>For professionals freelancers</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">$9</span>
              <span className="text-muted-foreground ml-2">/month</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-3">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <span className="font-medium">Unlimited campaign creations</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <span className="font-medium">Unlimited message creation</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <span className="font-medium">Unlimited automated messaging</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <span>Advanced analytics and reporting</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <span>Priority support</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                <span>Custom branding</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleSubscribe} disabled={loading}>
              {loading ? "Processing..." : "Upgrade to Pro"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Need something custom?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Contact our team for enterprise solutions tailored to your specific needs.
        </p>
        <Button variant="outline"><Link href="mailto:armaan@frankleads.io">Contact Team</Link></Button>
      </div>
    </div>
  )
}

