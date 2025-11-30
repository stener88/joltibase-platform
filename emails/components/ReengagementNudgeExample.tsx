/**
 * PATTERN: Re-engagement Product Nudge Email
 * USE CASE: Bring inactive users back to platform with personalized suggestions - perfect for SaaS, design tools, creative platforms, project management tools encouraging next action
 * TAGS: re-engagement, nudge, inactive-user, winback, retention, saas, platform, next-action, personalization, product-led
 */

import {
  Button,
  Column,
  Img,
  Link,
  Row,
  Section,
  Text,
} from '@react-email/components';

export default function ReengagementNudgeEmail() {
  return (
    <>
      <Section style={{
        padding: "52px 48px 0px 48px",
        backgroundColor: "#ffffff",
        borderTopLeftRadius: "8px",
        borderTopRightRadius: "8px",
        borderBottomLeftRadius: "0px",
        borderBottomRightRadius: "0px"
      }}>
        <Row>
          <Column align="left" style={{
            width: "100%",
            paddingLeft: "0",
            paddingRight: "0",
            verticalAlign: "top"
          }}>
            <Section>
              <Row>
                <Column align="left" style={{
                  width: "50%",
                  paddingLeft: "0",
                  paddingRight: "10px",
                  verticalAlign: "middle"
                }}>
                  <Section>
                    <Row>
                      <Column align="left">
                        <Link>
                          <Img
                            src="https://q1sgth5o59.ufs.sh/f/f17JrmYUJ9CpUOcwuj2pb9KHPka8TQFEzY4AyUoDMm5jVInL"
                            style={{
                              borderTopLeftRadius: "4px",
                              borderTopRightRadius: "4px",
                              borderBottomRightRadius: "4px",
                              borderBottomLeftRadius: "4px",
                              width: "80px",
                              height: "28px"
                            }}
                          />
                        </Link>
                      </Column>
                    </Row>
                  </Section>
                </Column>
                <Column align="right" style={{
                  width: "50%",
                  paddingLeft: "10px",
                  paddingRight: "0",
                  verticalAlign: "middle"
                }}>
                  <Button
                    href="#"
                    style={{
                      backgroundColor: "#f2f3f5",
                      padding: "9px 16px 9px 16px",
                      color: "#2f3337",
                      borderTopLeftRadius: "4px",
                      borderTopRightRadius: "4px",
                      borderBottomRightRadius: "4px",
                      borderBottomLeftRadius: "4px",
                      fontSize: "14px",
                      lineHeight: "24px",
                      fontWeight: "bold"
                    }}
                  >
                    Start designing
                  </Button>
                </Column>
              </Row>
            </Section>

            <Section style={{
              borderTopLeftRadius: "0px",
              borderTopRightRadius: "0px",
              borderBottomRightRadius: "0px",
              borderBottomLeftRadius: "0px",
              margin: "68px 0 0px 0"
            }}>
              <Row>
                <Column style={{ padding: "0px 0px 0px 0px" }}>
                  <Text style={{ lineHeight: "36px", margin: 0 }}>
                    <span style={{ fontSize: "42px" }}>Your next design:</span>
                  </Text>
                  <Text style={{ lineHeight: "36px", margin: 0 }}>
                    <span style={{ fontSize: "42px" }}>Presentation</span>
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
                <Column style={{ padding: "0px 0px 0px 0px" }}>
                  <Text style={{ lineHeight: "20px", margin: 0 }}>
                    <span style={{ fontSize: "14px" }}>
                      You finished your design a while ago. Want to start creating something new? Explore hundreds of presentation templates and easily customize them.
                    </span>
                  </Text>
                </Column>
              </Row>
            </Section>

            <Button
              href="#"
              style={{
                backgroundColor: "#8b3eff",
                padding: "9px 16px 9px 16px",
                color: "#ffffff",
                borderTopLeftRadius: "4px",
                borderTopRightRadius: "4px",
                borderBottomRightRadius: "4px",
                borderBottomLeftRadius: "4px",
                fontSize: "14px",
                lineHeight: "24px",
                margin: "24px 0 24px 0",
                fontWeight: "bold"
              }}
            >
              Explore the templates
            </Button>
          </Column>
        </Row>
      </Section>

      <Section>
        <Row>
          <Column align="left">
            <Link>
              <Img
                src="https://q1sgth5o59.ufs.sh/f/f17JrmYUJ9CpMsJrk4qosJT3K8L7GIMzwCoRFHVxdqhEg019"
                style={{
                  borderTopLeftRadius: "0px",
                  borderTopRightRadius: "0px",
                  borderBottomRightRadius: "8px",
                  borderBottomLeftRadius: "8px",
                  width: "600px",
                  height: "337px",
                  padding: "0px 0px 0px 0px"
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
        margin: "0px 0 0px 0"
      }}>
        <Row>
          <Column style={{ padding: "24px 20px 24px 20px" }}>
            <Text style={{ textAlign: "center", margin: 0 }}>
              <span style={{ color: "rgb(81, 85, 89)", fontSize: "14px" }}>
                You received this email because you have an account.
              </span>
            </Text>
          </Column>
        </Row>
      </Section>

      <Section style={{
        padding: "24px 0px 24px 0px",
        borderTop: "1px solid #dde1e3",
        borderRight: "0px solid #000000",
        borderBottom: "1px solid #dde1e3",
        borderLeft: "0px solid #000000"
      }}>
        <Row>
          <Column align="center">
            <Row style={{ display: "table-cell" }}>
              <Column>
                <Link href="#">
                  <Text style={{ margin: 0 }}>
                    <span style={{ color: "rgb(44, 49, 53)", fontSize: "14px", textDecoration: "underline" }}>
                      iPhone
                    </span>
                  </Text>
                </Link>
              </Column>
              <Column style={{ paddingLeft: "8px", paddingRight: "8px" }}>
                <span style={{ color: "#e2e5e9", fontSize: "14px", lineHeight: "1" }}>|</span>
              </Column>

              <Column>
                <Link href="#">
                  <Text style={{ margin: 0 }}>
                    <span style={{ color: "rgb(44, 49, 53)", fontSize: "14px", textDecoration: "underline" }}>
                      iPad
                    </span>
                  </Text>
                </Link>
              </Column>
              <Column style={{ paddingLeft: "8px", paddingRight: "8px" }}>
                <span style={{ color: "#e2e5e9", fontSize: "14px", lineHeight: "1" }}>|</span>
              </Column>

              <Column>
                <Link href="#">
                  <Text style={{ margin: 0 }}>
                    <span style={{ color: "rgb(44, 49, 53)", fontSize: "14px", textDecoration: "underline" }}>
                      Android
                    </span>
                  </Text>
                </Link>
              </Column>
              <Column style={{ paddingLeft: "8px", paddingRight: "8px" }}>
                <span style={{ color: "#e2e5e9", fontSize: "14px", lineHeight: "1" }}>|</span>
              </Column>

              <Column>
                <Link href="#">
                  <Text style={{ margin: 0 }}>
                    <span style={{ color: "rgb(44, 49, 53)", fontSize: "14px", textDecoration: "underline" }}>
                      Mac
                    </span>
                  </Text>
                </Link>
              </Column>
              <Column style={{ paddingLeft: "8px", paddingRight: "8px" }}>
                <span style={{ color: "#e2e5e9", fontSize: "14px", lineHeight: "1" }}>|</span>
              </Column>

              <Column>
                <Link href="#">
                  <Text style={{ margin: 0 }}>
                    <span style={{ color: "rgb(44, 49, 53)", fontSize: "14px", textDecoration: "underline" }}>
                      Windows
                    </span>
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
        margin: "0px 0 0px 0"
      }}>
        <Row>
          <Column style={{ padding: "24px 20px 24px 20px" }}>
            <Text style={{ textAlign: "center", lineHeight: "24px", margin: 0 }}>
              <span style={{ color: "rgb(81, 85, 89)", fontSize: "14px" }}>
                For you, from Your Company
              </span>
            </Text>
            <Text style={{ textAlign: "center", lineHeight: "24px", margin: 0 }}>
              <span style={{ color: "rgb(81, 85, 89)", fontSize: "14px" }}>
                Pty Ltd, 110 Kippax St, Sydney, NSW 2010, Australia. ABN 80 158 929 938.
              </span>
            </Text>
            <Text style={{ textAlign: "center", lineHeight: "24px", margin: 0 }}>
              <span style={{ color: "rgb(81, 85, 89)", fontSize: "14px" }}>
                If you need help, please contact us through our Help Center.
              </span>
            </Text>
            <Text style={{ textAlign: "center", lineHeight: "24px", margin: 0 }}>
              <Link href="http://yoursite.com">
                <span style={{ color: "rgb(81, 85, 89)", fontSize: "14px", textDecoration: "underline" }}>
                  Visit yoursite.com
                </span>
              </Link>
              <span style={{ color: "rgb(81, 85, 89)", fontSize: "14px" }}> · </span>
              <Link href="#">
                <span style={{ color: "rgb(81, 85, 89)", fontSize: "14px", textDecoration: "underline" }}>
                  Cancel subscription
                </span>
              </Link>
            </Text>
            <Text style={{ textAlign: "center", lineHeight: "24px", margin: 0 }}>
              <Link href="#">
                <span style={{ color: "rgb(81, 85, 89)", fontSize: "14px", textDecoration: "underline" }}>
                  Notifications
                </span>
              </Link>
            </Text>
          </Column>
        </Row>
      </Section>

      <Section style={{ padding: "0px 0px 64px 0px" }}>
        <Row>
          <Column align="center">
            <Row style={{ display: "table-cell" }}>
              <Column style={{ paddingRight: "16px" }}>
                <Link href="#">
                  <Img
                    src="https://q1sgth5o59.ufs.sh/f/f17JrmYUJ9CpdRfNOFcYQbdUpCt01x3Gfr9TPuiFkwazVM7s"
                    style={{
                      borderTopLeftRadius: "4px",
                      borderTopRightRadius: "4px",
                      borderBottomRightRadius: "4px",
                      borderBottomLeftRadius: "4px",
                      width: "24px",
                      height: "24px"
                    }}
                  />
                </Link>
              </Column>

              <Column style={{ paddingRight: "16px" }}>
                <Link href="#">
                  <Img
                    src="https://q1sgth5o59.ufs.sh/f/f17JrmYUJ9Cp2dLHT4X059WGn8DjpmzUyxPQYgLwEfJCscAl"
                    style={{
                      borderTopLeftRadius: "4px",
                      borderTopRightRadius: "4px",
                      borderBottomRightRadius: "4px",
                      borderBottomLeftRadius: "4px",
                      width: "24px",
                      height: "24px"
                    }}
                  />
                </Link>
              </Column>

              <Column style={{ paddingRight: "16px" }}>
                <Link href="#">
                  <Img
                    src="https://q1sgth5o59.ufs.sh/f/f17JrmYUJ9CpCtxNJs3bSP9zwX7VFZt6lBx3hqQgG8DjJEAR"
                    style={{
                      borderTopLeftRadius: "4px",
                      borderTopRightRadius: "4px",
                      borderBottomRightRadius: "4px",
                      borderBottomLeftRadius: "4px",
                      width: "24px",
                      height: "24px"
                    }}
                  />
                </Link>
              </Column>

              <Column>
                <Link href="#">
                  <Img
                    src="https://q1sgth5o59.ufs.sh/f/f17JrmYUJ9CpsVPa5ZRVPQ84gI0qTOGajKok7MsXxDbt6NLe"
                    style={{
                      borderTopLeftRadius: "4px",
                      borderTopRightRadius: "4px",
                      borderBottomRightRadius: "4px",
                      borderBottomLeftRadius: "4px",
                      width: "24px",
                      height: "24px"
                    }}
                  />
                </Link>
              </Column>
            </Row>
          </Column>
        </Row>
      </Section>
    </>
  );
}

