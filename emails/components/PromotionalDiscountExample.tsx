/**
 * PATTERN: Promotional Discount Email
 * USE CASE: Limited-time discount offers with feature highlights - perfect for ride-sharing, SaaS discounts, service promotions with terms and conditions
 * TAGS: promotional, discount, offer, limited-time, campaign, conversion, sale, promo-code, features, service
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

export default function PromotionalDiscountEmail() {
  return (
    <>
      <Section>
        <Row>
          <Column align="left">
            <Link>
              <Img
                src="https://q1sgth5o59.ufs.sh/f/f17JrmYUJ9CpFEUU3Fk3W4b75t0TpzGsedOVQPl9oJ2vyRC1"
                style={{
                  borderTopLeftRadius: "4px",
                  borderTopRightRadius: "4px",
                  borderBottomRightRadius: "4px",
                  borderBottomLeftRadius: "4px",
                  width: "600px",
                  height: "400px"
                }}
              />
            </Link>
          </Column>
        </Row>
      </Section>

      <Section style={{
        borderTopLeftRadius: "0px",
        borderTopRightRadius: "0px",
        borderBottomRightRadius: "0px",
        borderBottomLeftRadius: "0px",
        margin: "30px 0 0px 0"
      }}>
        <Row>
          <Column style={{ padding: "0px 24px 0px 24px" }}>
            <Text style={{ lineHeight: "56px", margin: 0 }}>
              <span style={{ color: "rgb(17, 17, 31)", fontSize: "56px", fontWeight: "bold" }}>
                Enjoy a 15% discount on 10 trips
              </span>
            </Text>
          </Column>
        </Row>
      </Section>

      <Section style={{
        borderTopLeftRadius: "0px",
        borderTopRightRadius: "0px",
        borderBottomRightRadius: "0px",
        borderBottomLeftRadius: "0px",
        margin: "10px 0 0px 0"
      }}>
        <Row>
          <Column style={{ padding: "0px 24px 0px 24px" }}>
            <Text style={{ lineHeight: "22px", margin: 0 }}>
              <span style={{ color: "rgb(17, 17, 31)" }}>
                Treat yourself to a movie. Meet friends for brunch. Go to a show. Whatever your plans, you can save on your commute.
              </span>
            </Text>
          </Column>
        </Row>
      </Section>

      <Section style={{
        borderTopLeftRadius: "0px",
        borderTopRightRadius: "0px",
        borderBottomRightRadius: "0px",
        borderBottomLeftRadius: "0px",
        margin: "24px 0 0px 0"
      }}>
        <Row>
          <Column style={{ padding: "0px 24px 0px 24px" }}>
            <Text style={{ lineHeight: "22px", margin: 0 }}>
              <span style={{ color: "rgb(17, 17, 31)" }}>
                Your discount offer is valid through March 10, 2025. Maximum US$5 per trip. Offer excludes Wait & Save.
              </span>
            </Text>
          </Column>
        </Row>
      </Section>

      <Section style={{ margin: "50px 0 0px 0" }}>
        <Row>
          <Column align="center" style={{
            width: "100%",
            paddingLeft: "0",
            paddingRight: "0",
            verticalAlign: "top"
          }}>
            <Button
              href="#"
              style={{
                backgroundColor: "#523ce5",
                padding: "17px 50px 17px 50px",
                color: "#ffffff",
                borderTopLeftRadius: "100px",
                borderTopRightRadius: "100px",
                borderBottomRightRadius: "100px",
                borderBottomLeftRadius: "100px",
                fontSize: "16px",
                lineHeight: "normal",
                fontWeight: "bold"
              }}
            >
              See the offer
            </Button>
          </Column>
        </Row>
      </Section>

      <Section style={{
        borderTopLeftRadius: "0px",
        borderTopRightRadius: "0px",
        borderBottomRightRadius: "0px",
        borderBottomLeftRadius: "0px",
        margin: "50px 0 0px 0"
      }}>
        <Row>
          <Column style={{ padding: "0px 24px 0px 24px" }}>
            <Text style={{ margin: 0 }}>
              <span style={{ color: "rgb(17, 17, 31)", fontSize: "30px", fontWeight: "bold" }}>
                Think of every detail
              </span>
            </Text>
          </Column>
        </Row>
      </Section>

      <Section style={{
        margin: "50px 0 0px 0",
        padding: "0px 24px 0px 24px"
      }}>
        <Row>
          <Column align="left" style={{
            width: "12%",
            paddingLeft: "0",
            paddingRight: "10px",
            verticalAlign: "top"
          }}>
            <Section>
              <Row>
                <Column align="left">
                  <Link>
                    <Img
                      src="https://q1sgth5o59.ufs.sh/f/f17JrmYUJ9CpBTo7hdj3zOIkXJp9lL8TVnAQbNhqY2Zf1gsG"
                      style={{
                        borderTopLeftRadius: "4px",
                        borderTopRightRadius: "4px",
                        borderBottomRightRadius: "4px",
                        borderBottomLeftRadius: "4px",
                        width: "45px",
                        height: "45px"
                      }}
                    />
                  </Link>
                </Column>
              </Row>
            </Section>
          </Column>
          <Column align="left" style={{
            width: "88%",
            paddingLeft: "10px",
            paddingRight: "0",
            verticalAlign: "top"
          }}>
            <Section style={{
              borderTopLeftRadius: "0px",
              borderTopRightRadius: "0px",
              borderBottomRightRadius: "0px",
              borderBottomLeftRadius: "0px",
              margin: "0px 0 0px 0"
            }}>
              <Row>
                <Column style={{ padding: "0px 0px 0px 0px" }}>
                  <Text style={{ margin: 0 }}>
                    <span style={{ color: "rgb(12, 10, 49)", fontWeight: "bold" }}>Extra comfort</span>
                  </Text>
                </Column>
              </Row>
            </Section>
            <Section style={{
              borderTopLeftRadius: "0px",
              borderTopRightRadius: "0px",
              borderBottomRightRadius: "0px",
              borderBottomLeftRadius: "0px",
              margin: "0px 0 0px 0"
            }}>
              <Row>
                <Column style={{ padding: "0px 0px 0px 0px" }}>
                  <Text style={{ lineHeight: "19px", margin: 0 }}>
                    <span style={{ color: "rgb(12, 10, 49)" }}>
                      Enjoy a relaxed atmosphere with a new car, a larger back seat, and a top-notch driver.
                    </span>
                  </Text>
                </Column>
              </Row>
            </Section>
          </Column>
        </Row>
      </Section>

      <Section style={{
        margin: "24px 0 0px 0",
        padding: "0px 24px 0px 24px"
      }}>
        <Row>
          <Column align="left" style={{
            width: "12%",
            paddingLeft: "0",
            paddingRight: "10px",
            verticalAlign: "top"
          }}>
            <Section>
              <Row>
                <Column align="left">
                  <Link>
                    <Img
                      src="https://q1sgth5o59.ufs.sh/f/f17JrmYUJ9Cp3UL63JoVnLr2EKdc01BOHDiAylwb4zfe8hGk"
                      style={{
                        borderTopLeftRadius: "4px",
                        borderTopRightRadius: "4px",
                        borderBottomRightRadius: "4px",
                        borderBottomLeftRadius: "4px",
                        width: "45px",
                        height: "45px"
                      }}
                    />
                  </Link>
                </Column>
              </Row>
            </Section>
          </Column>
          <Column align="left" style={{
            width: "88%",
            paddingLeft: "10px",
            paddingRight: "0",
            verticalAlign: "top"
          }}>
            <Section style={{
              borderTopLeftRadius: "0px",
              borderTopRightRadius: "0px",
              borderBottomRightRadius: "0px",
              borderBottomLeftRadius: "0px",
              margin: "0px 0 0px 0"
            }}>
              <Row>
                <Column style={{ padding: "0px 0px 0px 0px" }}>
                  <Text style={{ margin: 0 }}>
                    <span style={{ color: "rgb(12, 10, 49)", fontWeight: "bold" }}>XL</span>
                  </Text>
                </Column>
              </Row>
            </Section>
            <Section style={{
              borderTopLeftRadius: "0px",
              borderTopRightRadius: "0px",
              borderBottomRightRadius: "0px",
              borderBottomLeftRadius: "0px",
              margin: "0px 0 0px 0"
            }}>
              <Row>
                <Column style={{ padding: "0px 0px 0px 0px" }}>
                  <Text style={{ lineHeight: "19px", margin: 0 }}>
                    <span style={{ color: "rgb(12, 10, 49)" }}>
                      Keep everyone together. Ideal for brunches, shows, and group gatherings.
                    </span>
                  </Text>
                </Column>
              </Row>
            </Section>
          </Column>
        </Row>
      </Section>

      <Section style={{
        borderTopLeftRadius: "0px",
        borderTopRightRadius: "0px",
        borderBottomRightRadius: "0px",
        borderBottomLeftRadius: "0px",
        margin: "130px 0 0px 0"
      }}>
        <Row>
          <Column style={{ padding: "0px 24px 0px 24px" }}>
            <Text style={{ lineHeight: "10px", margin: 0 }}>
              <span style={{ color: "rgb(17, 17, 31)", fontSize: "10px" }}>
                *OFFER TERMS AND CONDITIONS:
              </span>
            </Text>
            <Text style={{ lineHeight: "10px", margin: 0 }}>
              <span style={{ color: "rgb(17, 17, 31)", fontSize: "10px" }}>
                15% off your next ride. You have 10 rides left. Maximum savings of US$5 per ride. Offer excludes Wait & Save rides, bikes, and scooters. Discount applies only to fare, service charge, tolls, and taxes. Valid through 10/03/2025 at 11:59:00 PM PST. US only. Subject to Terms of Service.
              </span>
            </Text>
          </Column>
        </Row>
      </Section>

      <Section style={{
        margin: "0px 0 0px 0",
        padding: "16px 24px 0px 24px"
      }}>
        <Hr />
      </Section>

      <Section style={{
        padding: "10px 24px 0px 24px",
        margin: "0px 0 0px 0"
      }}>
        <Row>
          <Column align="left">
            <Row style={{ display: "table-cell" }}>
              <Column>
                <Link href="#">
                  <Text style={{ margin: 0 }}>
                    <span style={{ color: "rgb(136, 136, 143)", fontSize: "12px" }}>Unsubscribe</span>
                  </Text>
                </Link>
              </Column>
              <Column style={{ paddingLeft: "4px", paddingRight: "4px" }}>
                <span style={{ color: "#88888f", fontSize: "11px", lineHeight: "1" }}>|</span>
              </Column>
              <Column>
                <Link href="#">
                  <Text style={{ margin: 0 }}>
                    <span style={{ color: "rgb(136, 136, 143)", fontSize: "12px" }}>Contact</span>
                  </Text>
                </Link>
              </Column>
            </Row>
          </Column>
        </Row>
      </Section>

      <Section style={{
        borderTopLeftRadius: "0px",
        borderTopRightRadius: "0px",
        borderBottomRightRadius: "0px",
        borderBottomLeftRadius: "0px",
        margin: "16px 0 0px 0"
      }}>
        <Row>
          <Column style={{ padding: "0px 24px 0px 24px" }}>
            <Text style={{ lineHeight: "16px", margin: 0 }}>
              <span style={{ color: "rgb(136, 136, 143)", fontSize: "12px" }}>
                548 Market St., PO Box 68514, San Francisco, CA 94104
              </span>
            </Text>
            <Text style={{ lineHeight: "16px", margin: 0 }}>
              <span style={{ color: "rgb(136, 136, 143)", fontSize: "12px" }}>
                © 2025 Your Company, Inc.
              </span>
            </Text>
          </Column>
        </Row>
      </Section>
    </>
  );
}

