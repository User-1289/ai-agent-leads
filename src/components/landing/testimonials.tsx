import Image from "next/image"

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Connor",
      role: "Freelance Consultant",
      quote: "The AI capabilities revolutionized my client acquisition strategy.",
      image: "/placeholder.svg",
    },
    {
      name: "John Doe",
      role: "Digital Marketer",
      quote: "A game-changer for managing multiple freelance platforms efficiently.",
      image: "/placeholder.svg",
    },
    {
      name: "Jane Smith",
      role: "Business Developer",
      quote: "Exceptional tool for optimizing lead generation and tracking performance.",
      image: "/placeholder.svg",
    },
  ]

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="text-center">
              <div className="mb-4">
                <Image
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  width={64}
                  height={64}
                  className="mx-auto rounded-full"
                />
              </div>
              <h3 className="font-semibold">{testimonial.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{testimonial.role}</p>
              <p className="text-gray-700 italic">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

