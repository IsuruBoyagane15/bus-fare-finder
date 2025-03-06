export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-center">Terms and Conditions</h1>
        <p className="text-center text-muted-foreground">Please read these terms carefully before using our service.</p>
        <div className="space-y-4">
          <section>
            <h2 className="text-lg font-semibold">Use of Service</h2>
            <p>
              Our bus fare finder service is provided for informational purposes only. While we strive to maintain
              accurate and up-to-date information, we cannot guarantee the accuracy of all fares and routes. Users are
              advised to verify the information with the respective bus operators before making travel arrangements.
            </p>
            <p>
              By using our service, you agree to use it only for lawful purposes and in a way that does not infringe
              upon the rights of others or restrict their use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">User Responsibilities</h2>
            <p>
              Users are responsible for verifying fare information with the respective bus operators before travel. We
              are not liable for any discrepancies between the information provided and actual fares charged.
            </p>
            <p>
              You are also responsible for maintaining the confidentiality of your account information, if applicable,
              and for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Intellectual Property</h2>
            <p>
              All content and functionality on this website are the property of Sri Lanka Bus Fare Finder and may not be
              copied, reproduced, or distributed without our express permission. This includes, but is not limited to,
              text, graphics, logos, icons, images, audio clips, digital downloads, and software.
            </p>
            <p>
              Any use of our materials without prior written consent is a violation of our intellectual property rights
              and is strictly prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Limitation of Liability</h2>
            <p>
              We are not responsible for any losses or damages arising from the use of our service. Users utilize the
              information provided at their own risk. This includes, but is not limited to, any direct, indirect,
              incidental, consequential, or punitive damages arising out of your access to, or use of, the site.
            </p>
            <p>
              We do not guarantee that our site will be uninterrupted or error-free, and we are not liable for any
              damages arising from service interruptions or data loss.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms and conditions at any time. Continued use of the service after
              changes constitutes acceptance of the new terms. It is your responsibility to check this page periodically
              for changes.
            </p>
            <p>
              If you do not agree with the modified terms, you should discontinue using our service. Your continued use
              of the site following the posting of changes to these terms will be deemed your acceptance of those
              changes.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

