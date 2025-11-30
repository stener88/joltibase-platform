/**
 * PATTERN: Retail Sale Promotional Email
 * USE CASE: Bold, high-urgency retail promotions with store locators - perfect for e-commerce sales, back-to-school, seasonal campaigns, flash sales with specific discount thresholds
 * TAGS: promotional, retail, sale, e-commerce, urgent, discount, seasonal, campaign, store-locator, bold-design, high-conversion
 */

import {
  Button,
  Column,
  Hr,
  Img,
  Link,
  Row,
  Section,
  Text,
} from '@react-email/components';

export default function RetailSaleEmail() {
  return (
    <>
      <Section style={{ backgroundColor: "#EFEFEF", padding: "12px 16px" }}>
        <Text style={{ margin: 0, fontSize: "12px", color: "#222222" }}>
          Take $25 off a purchase of $150 or more
        </Text>
      </Section>

      <Section style={{ padding: "20px 16px" }}>
        <Row>
          <Column>
            <Img
              src="https://utfs.io/f/54b50378-3734-418f-82cd-0fca6385d9f8-ndg9vb.png"
              style={{ height: "24px", width: "150px" }}
            />
          </Column>
          <Column align="right">
            <Section>
              <Row>
                <Column style={{ width: "0" }} align="right">
                  <Img
                    src="https://utfs.io/f/66f2009e-15e7-488b-84c4-b2366fb50f09-6g0nvf.png"
                    style={{ height: "22px", width: "15px" }}
                  />
                </Column>
                <Column style={{ width: "0", paddingLeft: "8px" }}>
                  <Link href="#">
                    <Text style={{ margin: 0, fontSize: "14px", fontWeight: "bold", color: "#222222" }}>
                      Find store
                    </Text>
                  </Link>
                </Column>
              </Row>
            </Section>
          </Column>
        </Row>
      </Section>

      <Section>
        <Img
          src="https://utfs.io/f/37c40d70-2089-496c-a409-7c0504d63905-oteagv.jpg"
          style={{ height: "600px", width: "100%" }}
        />
      </Section>

      <Section style={{ padding: "56px 0" }}>
        <Row>
          <Column align="center">
            <Text style={{ margin: 0, fontSize: "30px", fontWeight: "600" }}>
              School supplies
            </Text>
            <Hr style={{
              marginBottom: "24px",
              marginTop: "32px",
              maxWidth: "80px",
              border: "4px solid #D4082D"
            }} />
            <Text style={{ margin: 0, fontSize: "16px", color: "#090909" }}>
              Start the new year with new favorites
            </Text>
            <Button
              href="#"
              style={{
                marginTop: "24px",
                backgroundColor: "#D00B2C",
                padding: "16px 56px",
                fontSize: "14px",
                fontWeight: "bold",
                color: "white"
              }}
            >
              Get directions
            </Button>
          </Column>
        </Row>
      </Section>

      <Section style={{
        backgroundColor: "#CF0C2C",
        padding: "80px 32px 24px 32px"
      }}>
        <Row>
          <Column align="center">
            <Text style={{ margin: 0, fontSize: "18px", color: "white" }}>
              Factory Stores only
            </Text>

            <Text style={{ marginTop: "20px", fontSize: "36px", fontWeight: "bold", color: "white" }}>
              Take $25 off a purchase of
              <br />
              $150 or more
            </Text>
            <Button
              href="#"
              style={{
                marginTop: "16px",
                backgroundColor: "white",
                padding: "16px 40px",
                fontSize: "14px",
                fontWeight: "bold",
                color: "#CF0C2C"
              }}
            >
              Find a store
            </Button>
            <Text style={{ marginTop: "32px", maxWidth: "300px", fontSize: "12px", color: "white" }}>
              Exclusions apply. Can't be applied to previous purchases of gift cards and cannot be redeemed for cash or used in combination with any other offer.
            </Text>
            <Text style={{ marginTop: "32px", fontSize: "12px", color: "white" }}>
              Coupon valid from 8/09/2024-9/02/2024
            </Text>
          </Column>
        </Row>
      </Section>

      <Section>
        <Img
          src="https://utfs.io/f/31794cc4-3c8d-4e83-8c71-1e3d87eda243-kkzoqk.jpg"
          style={{ height: "205px", width: "100%" }}
        />
      </Section>

      <Section style={{
        borderBottom: "1px solid #EFEFEF",
        borderTop: "1px solid #EFEFEF",
        padding: "28px 16px"
      }}>
        <Row>
          <Column style={{ width: "0", verticalAlign: "top" }}>
            <Text style={{ margin: 0, whiteSpace: "nowrap", fontSize: "14px", fontWeight: "bold", color: "#222222" }}>
              Your Local store:
            </Text>
          </Column>
          <Column style={{ paddingLeft: "12px" }}>
            <Text style={{ margin: 0, paddingLeft: "16px", fontSize: "14px", fontWeight: "bold", color: "#222222" }}>
              Factory Store Location
            </Text>
            <Text style={{ margin: 0, paddingLeft: "16px", fontSize: "12px", color: "#222222" }}>
              2610 Sawgrass Mills Cir
            </Text>
            <Text style={{ margin: 0, paddingLeft: "16px", fontSize: "12px", color: "#222222" }}>
              Sunrise, FL 33323
            </Text>
          </Column>
        </Row>
      </Section>

      <Section style={{ padding: "28px 16px" }}>
        <Row>
          <Text style={{ margin: 0, fontSize: "14px", color: "#222222" }}>
            Got this from a friend?
          </Text>
          <Link href="#">
            <Text style={{ margin: 0, whiteSpace: "nowrap", fontSize: "14px", fontWeight: "bold", color: "#222222" }}>
              Sign up for emails
            </Text>
          </Link>
        </Row>
      </Section>

      <Section style={{ padding: "0 16px" }}>
        <Row style={{ display: "table-cell", width: "0", whiteSpace: "nowrap" }}>
          <Column align="left">
            <Link style={{ fontSize: "12px", color: "black", textDecoration: "none" }} href="#">
              View in browser
            </Link>
          </Column>
        </Row>
        <Row style={{ display: "table-cell", width: "0", whiteSpace: "nowrap", paddingLeft: "16px" }}>
          <Column align="left">
            <Link style={{ fontSize: "12px", color: "black", textDecoration: "none" }} href="#">
              Unsubscribe
            </Link>
          </Column>
        </Row>
        <Row style={{ display: "table-cell", width: "0", whiteSpace: "nowrap", paddingLeft: "16px" }}>
          <Column align="left">
            <Link style={{ fontSize: "12px", color: "black", textDecoration: "none" }} href="#">
              Privacy Policy
            </Link>
          </Column>
        </Row>
        <Row style={{ display: "table-cell", width: "0", whiteSpace: "nowrap", paddingLeft: "16px" }}>
          <Column align="left">
            <Link style={{ fontSize: "12px", color: "black", textDecoration: "none" }} href="#">
              Terms & Conditions
            </Link>
          </Column>
        </Row>
        <Row style={{ display: "table-cell", width: "0", whiteSpace: "nowrap", paddingLeft: "16px" }}>
          <Column align="left">
            <Link style={{ fontSize: "12px", color: "black", textDecoration: "none" }} href="#">
              Help
            </Link>
          </Column>
        </Row>
      </Section>

      <Section style={{ padding: "16px" }}>
        <Text style={{ fontSize: "12px", color: "#222222" }}>
          © 2024, Your Brand 100 Guest St. Boston, MA 02135
        </Text>
        <Text style={{ fontSize: "12px", color: "#222222" }}>
          Coupon valid from 8/9/2024-09/02/2024. Coupon must be scanned at time of purchase to receive discount on pre-tax total. Coupon cannot be combined with additional coupons, discounts, or promotions. No cash back. Limited one coupon per customer per transaction per day. Not valid on prior purchases. One time use only. No cash value. Exclusions apply.
        </Text>
      </Section>
    </>
  );
}

