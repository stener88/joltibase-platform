/**
 * PATTERN: Loyalty Program Status Update
 * USE CASE: Monthly loyalty statements with rewards balance, tier benefits, and content recommendations - perfect for travel, e-commerce, subscription services with points/rewards programs
 * TAGS: loyalty, rewards, points, status, retention, engagement, membership, benefits, statement, monthly, tier-based, account-update
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

export default function LoyaltyProgramUpdateEmail() {
  return (
    <>
      <Section style={{ padding: "0 16px 0 16px", marginTop: "20px" }}>
        <Img
          src="https://utfs.io/f/57a79a08-d233-49a3-a17d-97aeda89fd0d-9fp6x0.png"
          width={154}
          height={33}
          alt="Your Brand"
        />
      </Section>

      <Section style={{ marginTop: "28px", padding: "0 16px 0 16px" }}>
        <Img
          src="https://ci3.googleusercontent.com/meips/ADKq_NYsQMty6q0z9VGRE9aAo_kK7_5iY-jvy_D4uHofl_h82J48zL4wnmDjkJFtQVNfjOlVbimj3BuX_9xy-pAjlQnITCvk93Or2GhNiYHhsdQ7E88v_OvKjzmZKPaIG4-wlf8A5jYUvN195HyUjLUg4txNyRU=s0-d-e1-ft#https://a.travel-assets.com/travel-assets-manager/bexaug2024/BEX_Desktop_0_Hero_1200x1200.jpg"
          width={600}
          height={600}
          alt="One Key Update"
          style={{ width: "100%" }}
        />
      </Section>

      <Section style={{
        backgroundColor: "#191E3B",
        padding: "24px",
        paddingBottom: "40px",
        textAlign: "center",
        color: "white"
      }}>
        <Text style={{
          margin: 0,
          fontSize: "28px",
          fontWeight: "500",
          lineHeight: "32px"
        }}>
          One woman, 195 countries (and two camels)
        </Text>
        <Text style={{
          margin: 0,
          marginTop: "16px",
          fontSize: "14px",
          lineHeight: "20px"
        }}>
          She's the first Black woman to have visited every country in the world—now Jessica Nabongo shares how she overcame travel hurdles and embraced adventure
        </Text>
        <Button
          href="#"
          style={{
            marginTop: "16px",
            borderRadius: "100px",
            backgroundColor: "white",
            padding: "8px 16px",
            fontSize: "16px",
            fontWeight: "500",
            color: "#1568E3"
          }}
        >
          Meet her
        </Button>
      </Section>

      <Section style={{ marginTop: "36px", padding: "0 16px 0 16px" }}>
        <Text style={{
          margin: 0,
          marginBottom: "16px",
          fontSize: "13px",
          fontWeight: "500"
        }}>
          Your latest rewards update
        </Text>
        <Section style={{
          borderRadius: "8px",
          backgroundColor: "#f3f4f6",
          padding: "16px"
        }}>
          <Row>
            <Column style={{ verticalAlign: "top" }}>
              <Img
                src="https://utfs.io/f/9f44da82-330a-413e-a0b7-562e58824583-7tkoy7.png"
                width={24}
                height={24}
                alt="Rewards icon"
              />
            </Column>
            <Column style={{ paddingLeft: "16px", verticalAlign: "top" }}>
              <Text style={{
                margin: 0,
                marginTop: "8px",
                fontSize: "13px",
                fontWeight: "500"
              }}>
                You have $6.95 in Rewards Cash
              </Text>
              <Text style={{ margin: 0, marginTop: "8px", fontSize: "14px" }}>
                Save on your next purchase across our platform.¹
              </Text>
              <Link href="#" style={{
                fontSize: "14px",
                color: "#2563eb",
                textDecoration: "underline"
              }}>
                <Text style={{ margin: 0, marginTop: "8px" }}>See your Rewards Cash</Text>
              </Link>
            </Column>
          </Row>
        </Section>
      </Section>

      <Section style={{
        marginTop: "24px",
        padding: "0 16px 0 16px",
        borderTop: "1px solid #DFE0E4"
      }} />

      <Section style={{
        marginTop: "24px",
        padding: "0 16px 0 16px",
        borderRadius: "16px",
        border: "1px solid #828494",
        
      }}>
        <Text style={{
          margin: 0,
          display: "inline-block",
          borderRadius: "4px",
          backgroundColor: "#304CA2",
          padding: "4px 8px",
          fontSize: "12px",
          fontWeight: "500",
          color: "white"
        }}>
          Blue
        </Text>
        <Text style={{ margin: 0, marginTop: "8px", fontSize: "14px", fontWeight: "600" }}>
          Save more with Member Prices
        </Text>
        <Text style={{ margin: 0, marginTop: "8px", fontSize: "14px" }}>
          Blue members save 10% or more on over 100,000 hotels worldwide with Member Prices.
        </Text>
        <Link
          href="#"
          style={{
            marginTop: "8px",
            display: "block",
            fontSize: "14px",
            color: "#2563eb",
            textDecoration: "underline"
          }}
        >
          See Member Prices
        </Link>
      </Section>

      <Section style={{
        marginTop: "24px",
        padding: "0 16px 0 16px",
        borderTop: "1px solid #DFE0E4"
      }} />

      <Section style={{ marginTop: "24px", padding: "0 16px 0 16px" }}>
        <Text style={{
          margin: 0,
          marginBottom: "16px",
          fontSize: "20px",
          fontWeight: "500",
          color: "#191e3b"
        }}>
          Get inspired with more content
        </Text>

        <Row>
          <Column style={{ width: "50%", paddingRight: "4px", verticalAlign: "top" }}>
            <Img
              src="https://utfs.io/f/51ced9c0-a30e-4b42-8c60-15a988ab30eb-8cyv6t.jpg"
              alt="Featured story"
              style={{ height: "365px", width: "100%", borderRadius: "8px" }}
            />
            <Text style={{
              margin: 0,
              marginTop: "12px",
              marginBottom: "12px",
              textAlign: "center",
              fontSize: "14px",
              color: "#818494"
            }}>
              Featured story: Customer confessions
            </Text>
          </Column>

          <Column style={{ width: "50%", paddingLeft: "4px" }}>
            <Img
              src="https://utfs.io/f/bc676881-c956-4b8b-a5fa-787ebe8c561f-e0pjnt.jpg"
              alt="Destination guide"
              style={{ height: "365px", width: "100%", borderRadius: "8px" }}
            />
            <Text style={{
              margin: 0,
              marginTop: "12px",
              marginBottom: "12px",
              textAlign: "center",
              fontSize: "14px",
              color: "#818494"
            }}>
              Discover amazing destinations
            </Text>
          </Column>
        </Row>

        <Row style={{ marginTop: "16px" }}>
          <Column style={{ width: "50%", paddingRight: "4px", verticalAlign: "top" }}>
            <Img
              src="https://utfs.io/f/144e9298-7874-4c6f-accd-5314b1a5ddd0-lfuvil.jpg"
              alt="City guide"
              style={{ height: "247px", width: "100%", borderRadius: "8px" }}
            />
            <Text style={{
              margin: 0,
              marginTop: "12px",
              marginBottom: "12px",
              textAlign: "center",
              fontSize: "14px",
              color: "#818494"
            }}>
              The race is on to see Paris
            </Text>
          </Column>
          <Column style={{ width: "50%", paddingLeft: "4px", verticalAlign: "top" }}>
            <Img
              src="https://utfs.io/f/957e3ab1-0209-4186-836e-8311d1f7021a-vhj3hj.jpg"
              alt="Seasonal guide"
              style={{ height: "247px", width: "100%", borderRadius: "8px" }}
            />
            <Text style={{
              margin: 0,
              marginTop: "12px",
              marginBottom: "12px",
              textAlign: "center",
              fontSize: "14px",
              color: "#818494"
            }}>
              The seasonal hot list
            </Text>
          </Column>
        </Row>
      </Section>

      <Section style={{
        marginTop: "44px",
        padding: "0 16px 0 16px",
        borderTop: "1px solid #DFE0E4"
      }} />

      <Section style={{ marginTop: "16px", padding: "0 16px 0 16px" }}>
        <Row style={{ width: "fit-content" }}>
          <Column align="center">
            <Section>
              <Row style={{ display: "table-cell", width: "0", whiteSpace: "nowrap" }}>
                <Column align="left">
                  <Img
                    src="https://utfs.io/f/f218f7cf-d49a-4132-bbd0-07dc39154e38-13trh3.png"
                    width={24}
                    height={24}
                    alt="Download app icon"
                  />
                </Column>
              </Row>
              <Row style={{
                display: "table-cell",
                width: "0",
                whiteSpace: "nowrap",
                paddingLeft: "16px",
                verticalAlign: "middle"
              }}>
                <Column align="left">
                  <Text style={{
                    margin: 0,
                    fontSize: "14px",
                    lineHeight: "20px",
                    color: "#191e3b"
                  }}>
                    Download the{' '}
                    <Link href="#" style={{ color: "#1668e3", textDecoration: "underline" }}>
                      mobile app
                    </Link>
                  </Text>
                </Column>
              </Row>
            </Section>
          </Column>
        </Row>
        <Row style={{ width: "fit-content" }}>
          <Column align="center">
            <Section>
              <Row style={{ display: "table-cell", width: "0", whiteSpace: "nowrap" }}>
                <Column align="left">
                  <Link href="#">
                    <Text style={{
                      margin: 0,
                      marginTop: "12px",
                      fontSize: "12px",
                      lineHeight: "20px",
                      color: "#1668e3",
                      textDecoration: "underline"
                    }}>
                      Unsubscribe from Monthly Statements
                    </Text>
                  </Link>
                </Column>
              </Row>
              <Row style={{
                display: "table-cell",
                width: "0",
                whiteSpace: "nowrap",
                paddingLeft: "16px"
              }}>
                <Column align="left">
                  <Link href="#">
                    <Text style={{
                      margin: 0,
                      marginTop: "12px",
                      fontSize: "12px",
                      lineHeight: "20px",
                      color: "#1668e3",
                      textDecoration: "underline"
                    }}>
                      Privacy statement
                    </Text>
                  </Link>
                </Column>
              </Row>
              <Row style={{
                display: "table-cell",
                width: "0",
                whiteSpace: "nowrap",
                paddingLeft: "16px"
              }}>
                <Column align="left">
                  <Link href="#">
                    <Text style={{
                      margin: 0,
                      marginTop: "12px",
                      fontSize: "12px",
                      lineHeight: "20px",
                      color: "#1668e3",
                      textDecoration: "underline"
                    }}>
                      Customer service
                    </Text>
                  </Link>
                </Column>
              </Row>
            </Section>
          </Column>
        </Row>
      </Section>

      <Section style={{
        marginTop: "16px",
        padding: "0 16px 0 16px",
        borderTop: "1px solid #DFE0E4"
      }} />

      <Section style={{ marginTop: "16px", paddingBottom: "16px", padding: "0 16px 0 16px" }}>
        <Text style={{
          margin: 0,
          fontSize: "12px",
          lineHeight: "16px",
          color: "#191e3b"
        }}>
          ¹Rewards Cash is not redeemable for cash and can only be used on our platform.{' '}
          <Link href="#" style={{ color: "#1668e3", textDecoration: "underline" }}>
            See terms and conditions.
          </Link>
        </Text>
        <Text style={{
          margin: 0,
          marginTop: "16px",
          fontSize: "12px",
          lineHeight: "16px",
          color: "#191e3b"
        }}>
          This email and its links may contain your personal information; please only forward to people you trust.
        </Text>
        <Text style={{
          margin: 0,
          marginTop: "16px",
          fontSize: "12px",
          lineHeight: "16px",
          color: "#191e3b"
        }}>
          You are receiving this email because you are eligible to receive promotional emails from us.
        </Text>
        <Text style={{
          margin: 0,
          marginTop: "16px",
          fontSize: "12px",
          lineHeight: "16px",
          color: "#191e3b"
        }}>
          Your Company, Inc. 1111 Company Way West, Seattle WA 98119, USA.
        </Text>
      </Section>
    </>
  );
}

