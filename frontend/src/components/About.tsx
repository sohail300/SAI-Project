import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-blue-600">About Our House Map Approval Service</CardTitle>
          <CardDescription className="text-xl mt-2">
            Streamlining the process of getting your house plans approved
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-blue-800">Our Mission</h2>
            <p className="text-gray-700">
              We aim to simplify and expedite the house map approval process, providing a seamless experience for homeowners and architects. Our platform bridges the gap between applicants and approval authorities, ensuring efficient communication and faster results.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-blue-800">How It Works</h2>
            <ul className="space-y-2">
              {[
                "Register an account on our platform",
                "Submit your house map files (blueprints, sketches, or 3D models)",
                "Our team reviews your submission",
                "Receive updates on your approval status",
                "Get your approved plans or feedback for improvements"
              ].map((step, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-blue-800">Key Features</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Easy file upload for various map formats",
                "Real-time status tracking",
                "Secure document storage and access",
                "Direct communication with approval authorities",
                "Faster processing times",
                "Transparent approval process"
              ].map((feature, index) => (
                <Card key={index} className="p-4 bg-blue-50">
                  <CardContent className="p-0 flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                    <span className="text-sm font-medium">{feature}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-blue-800">Why Choose Us?</h2>
            <p className="text-gray-700">
              Our platform offers a user-friendly interface, expert review process, and dedicated support to ensure your house map approval journey is as smooth as possible. We understand the importance of your project and strive to provide the most efficient service in the industry.
            </p>
          </section>

          <div className="flex justify-center mt-8">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">
              Start Your Approval Process Today
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}