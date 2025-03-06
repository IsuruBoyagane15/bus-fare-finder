export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-center">Privacy Policy</h1>
        <p className="text-center text-muted-foreground">
          At Sri Lanka Bus Fare Finder, we are committed to protecting your privacy. This policy outlines how we
          collect, use, and safeguard your personal information.
        </p>
        <div className="space-y-4">
          <section>
            <h2 className="text-lg font-semibold">Information Collection</h2>
            <p>
              We collect information you provide when using our service, such as search queries for bus routes and
              fares. This may include origin and destination cities, preferred travel dates, and bus types.
            </p>
            <p>
              We may also collect non-personal information such as browser type, IP address, device type, and operating
              system. This information helps us improve our service and provide a better user experience.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Use of Information</h2>
            <p>
              We use the collected information to provide and improve our bus fare finding service, analyze usage
              patterns, and enhance user experience. This includes personalizing content, improving our search
              algorithms, and sending service-related notifications.
            </p>
            <p>
              We may use your email address to send you updates about our service, special offers, or important notices.
              You can opt out of these communications at any time.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Data Protection</h2>
            <p>
              We implement security measures to protect your information from unauthorized access, alteration,
              disclosure, or destruction. These measures include encryption, firewalls, and secure server facilities.
            </p>
            <p>
              While we strive to use commercially acceptable means to protect your personal information, we cannot
              guarantee its absolute security. Any transmission of personal information is at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Third-Party Services</h2>
            <p>
              We may use third-party services to analyze site usage and improve our service. These third parties have
              their own privacy policies and may collect information about your online activities over time and across
              different websites.
            </p>
            <p>
              We are not responsible for the privacy practices or content of these third-party services. We encourage
              you to review their privacy policies to understand how they handle your information.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Cookies</h2>
            <p>
              We use cookies to enhance user experience and analyze site usage. Cookies are small files stored on your
              device that help us provide and improve our services. They allow us to remember your preferences and
              understand how you interact with our website.
            </p>
            <p>
              You can modify your browser settings to decline cookies if you prefer. However, this may prevent you from
              taking full advantage of our website's features.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Changes to Privacy Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new
              privacy policy on this page and updating the "last modified" date at the bottom of this page.
            </p>
            <p>
              We encourage you to review this privacy policy periodically for any changes. Your continued use of our
              service after we post any modifications to the privacy policy will constitute your acknowledgment of the
              modifications and your consent to abide and be bound by the modified privacy policy.
            </p>
          </section>
        </div>
        <p className="text-sm text-muted-foreground text-center">Last modified: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  )
}

