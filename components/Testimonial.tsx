interface TestimonialProps {
  quote: string
  author: string
  role: string
  photo?: string
}

export default function Testimonial({
  quote,
  author,
  role,
  photo,
}: TestimonialProps) {
  return (
    <div className="bg-white rounded-lg shadow-card p-6 md:p-8">
      <blockquote className="mb-4">
        <p className="text-lg text-neutral-gray-700 italic">
          "{quote}"
        </p>
      </blockquote>

      <div className="flex items-center">
        {photo && (
          <img
            src={photo}
            alt={`Photo of ${author}`}
            className="w-12 h-12 rounded-full mr-4 object-cover"
          />
        )}
        <div>
          <p className="font-semibold text-neutral-charcoal">{author}</p>
          <p className="text-sm text-neutral-gray-600">{role}</p>
        </div>
      </div>
    </div>
  )
}
