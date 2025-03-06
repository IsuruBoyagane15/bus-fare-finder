import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <form className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">
            Name
          </label>
          <Input id="name" type="text" placeholder="Your name" required />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <Input id="email" type="email" placeholder="Your email" required />
        </div>
        <div>
          <label htmlFor="message" className="block mb-1">
            Message
          </label>
          <Textarea id="message" placeholder="Your message" required />
        </div>
        <Button type="submit">Send Message</Button>
      </form>
    </div>
  )
}

