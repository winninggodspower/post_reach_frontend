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
      <Body className="bg-white font-sans text-gray-800">
        <Container style={{ margin: "0 auto", padding: "20px 0 48px", width: "100%", maxWidth: "600px" }}>
          <Img
            src="https://postglee.com/email-banner.png"
            width="600"
            alt="Welcome to the Waitlist! PostGlee"
            style={{ width: "100%", maxWidth: "600px", height: "auto", display: "block", margin: "0 auto" }}
          />
          
          <Section className="px-6 py-8">
            <Text className="text-gray-800 text-[16px] leading-[26px] mb-6">
              Hi there,
            </Text>
            
            <Text className="text-gray-800 text-[16px] leading-[26px] mb-6">
              Welcome to the PostGlee waitlist! We are absolutely thrilled to have you onboard.
            </Text>
            
            <Text className="text-gray-800 text-[16px] leading-[26px] mb-6">
              We are building PostGlee to make social scheduling and publishing completely effortless. Whether you are scheduling posts, analyzing performance, or managing multiple accounts, our goal is to provide a single, powerful dashboard that saves you hours every week.
            </Text>
            
            <Text className="text-gray-800 text-[16px] leading-[26px] mb-8">
              We're currently putting the finishing touches on our beta release. Keep an eye on your inbox—as an early supporter, you will be among the very first to get exclusive access when we open the doors!
            </Text>
            
            <Section className="mb-10 mt-8">
              <Link
                href="https://postglee.com"
                className="bg-orange-500 rounded-md text-white text-[16px] font-semibold px-6 py-3 no-underline inline-block"
              >
                Visit PostGlee
              </Link>
            </Section>
            
            <Hr className="border-gray-200 my-8" />
            
            <Text className="text-gray-500 text-[14px] leading-[24px]">
              Best regards,<br />
              <strong className="text-gray-700">The PostGlee Team</strong>
            </Text>
            
            <Text className="text-gray-400 text-[12px] leading-[20px] mt-8">
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
