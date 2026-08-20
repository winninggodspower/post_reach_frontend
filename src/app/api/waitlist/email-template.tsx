import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

export const WaitlistEmail = () => (
  <Html>
    <Tailwind>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
      </Head>
      <Preview>Welcome to the PostGlee waitlist!</Preview>
      <Body className="bg-white font-sans my-auto mx-auto pt-10 pb-10">
        <Container className="bg-white border border-gray-200 rounded-xl shadow-sm mx-auto max-w-[480px] overflow-hidden text-center">
          <Section className="w-full">
            <Img
              src="https://postglee.com/email-banner.png"
              width="480"
              alt="Welcome to the Waitlist! PostGlee"
              className="w-full h-auto block mx-auto"
            />
          </Section>
          
          <Section className="px-10 py-10 text-left">
            <Text className="text-gray-700 text-lg leading-relaxed mb-6">
              Hi there,
            </Text>
            
            <Text className="text-gray-700 text-lg leading-relaxed mb-6">
              Welcome to the PostGlee waitlist! We are absolutely thrilled to have you onboard.
            </Text>
            
            <Text className="text-gray-700 text-lg leading-relaxed mb-6">
              We are building PostGlee to make social scheduling and publishing completely effortless. Whether you are scheduling posts, analyzing performance, or managing multiple accounts, our goal is to provide a single, powerful dashboard that saves you hours every week.
            </Text>
            
            <Text className="text-gray-700 text-lg leading-relaxed mb-8">
              We're currently putting the finishing touches on our beta release. Keep an eye on your inbox—as an early supporter, you will be among the very first to get exclusive access when we open the doors!
            </Text>
            
            <Section className="text-center mb-10">
              <Link
                href="https://postglee.com"
                className="bg-orange-500 rounded-full text-white inline-block text-lg font-semibold px-8 py-3.5 no-underline transition-opacity hover:opacity-90"
              >
                Visit PostGlee
              </Link>
            </Section>
            
            <Hr className="border-gray-200 my-8 mx-0" />
            
            <Text className="text-gray-500 text-base leading-relaxed m-0">
              Best regards,<br />
              <strong className="text-gray-700">The PostGlee Team</strong>
            </Text>
          </Section>
          
          <Section className="bg-gray-50 px-10 py-6 text-center border-t border-gray-100">
            <Text className="text-gray-400 text-xs m-0">
              © 2024 PostGlee. All rights reserved.<br />
              You are receiving this email because you opted into our waitlist.
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default WaitlistEmail;
