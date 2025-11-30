/**
 * PATTERN: Travel & Destination Marketing
 * USE CASE: Adventure travel and destination newsletters with personalized recommendations, activity highlights, and booking CTAs - perfect for adventure travel companies, travel platforms, booking sites, tourism boards, travel agencies seeking to inspire wanderlust and exploration
 * TAGS: travel, adventure, destination, exploration, activities, action, exotic, wanderlust, young-adult, energetic, vibrant, dynamic, journey, discovery, booking, promotional, personalized, tourism, trip-planning, recommendation, seasonal, newsletter, campaign
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

export default function TravelDestinationEmail() {
  return (
    <>
      <Section style={{
        padding: "16px 32px 16px 32px",
        backgroundColor: "#ffffff"
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
                <Column align="center">
                  <Link>
                    <Img
                      src="https://q1sgth5o59.ufs.sh/f/f17JrmYUJ9CpK4nSt7TbgS5tRGFilLJCM8QIpvsbhKWudz6Y"
                      style={{
                        width: "220px",
                        height: "56px"
                      }}
                    />
                  </Link>
                </Column>
              </Row>
            </Section>
          </Column>
        </Row>
      </Section>

      <Section style={{
        padding: "16px 0px 16px 0px",
        margin: "16px 0 16px 0"
      }}>
        <Row>
          <Column align="center">
            <Row style={{ display: "table-cell" }}>
              <Column style={{ paddingRight: "72px" }}>
                <Link href="#">
                  <Text style={{ margin: 0 }}>
                    <span style={{ color: "rgb(0, 43, 17)", fontWeight: "bold" }}>Hotels</span>
                  </Text>
                </Link>
              </Column>
              <Column style={{ paddingRight: "72px" }}>
                <Link href="#">
                  <Text style={{ margin: 0 }}>
                    <span style={{ color: "rgb(0, 43, 17)", fontWeight: "bold" }}>Things to do</span>
                  </Text>
                </Link>
              </Column>
              <Column>
                <Link href="#">
                  <Text style={{ margin: 0 }}>
                    <span style={{ color: "rgb(0, 43, 17)", fontWeight: "bold" }}>Restaurants</span>
                  </Text>
                </Link>
              </Column>
            </Row>
          </Column>
        </Row>
      </Section>

      <Section style={{
        padding: "0px 24px 0px 24px",
        backgroundColor: "#ffffff"
      }}>
        <Row>
          <Column align="left" style={{
            width: "100%",
            paddingLeft: "0",
            paddingRight: "0",
            verticalAlign: "top"
          }}>
            <Section style={{
              padding: "14px 24px 14px 24px",
              border: "1px solid #002b11",
              borderRadius: "8px"
            }}>
              <Row>
                <Column align="left" style={{
                  width: "50%",
                  paddingLeft: "0",
                  paddingRight: "10px",
                  verticalAlign: "middle"
                }}>
                  <Section>
                    <Row>
                      <Column align="right" style={{
                        width: "10%",
                        paddingLeft: "0",
                        paddingRight: "4px",
                        verticalAlign: "middle"
                      }}>
                        <Section>
                          <Row>
                            <Column align="right">
                              <Link>
                                <Img
                                  src="https://q1sgth5o59.ufs.sh/f/f17JrmYUJ9CpC1haaX3bSP9zwX7VFZt6lBx3hqQgG8DjJEAR"
                                  style={{
                                    borderRadius: "40px",
                                    width: "20px",
                                    height: "20px"
                                  }}
                                />
                              </Link>
                            </Column>
                          </Row>
                        </Section>
                      </Column>
                      <Column align="left" style={{
                        width: "90%",
                        paddingLeft: "4px",
                        paddingRight: "0",
                        verticalAlign: "middle"
                      }}>
                        <Section style={{ margin: "0px 0 0px 0" }}>
                          <Row>
                            <Column style={{ padding: "0px 0px 0px 0px" }}>
                              <Text style={{ margin: 0 }}>
                                <span style={{ fontWeight: "bold" }}>Hi, Juan</span>
                              </Text>
                            </Column>
                          </Row>
                        </Section>
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
                  <Section style={{ margin: "0px 0 0px 0" }}>
                    <Row>
                      <Column style={{ padding: "0px 0px 0px 0px" }}>
                        <Text style={{ textAlign: "right", margin: 0 }}>
                          <span style={{ color: "rgb(0, 43, 17)", fontSize: "13px", fontWeight: "bold" }}>
                            Member since 2016
                          </span>
                        </Text>
                      </Column>
                    </Row>
                  </Section>
                </Column>
              </Row>
            </Section>
          </Column>
        </Row>
      </Section>

      <Section style={{ margin: "24px 0 0px 0" }}>
        <Row>
          <Column style={{ padding: "0px 40px 0px 40px" }}>
            <Text style={{ textAlign: "center", lineHeight: "40px", margin: 0 }}>
              <span style={{ color: "rgb(0, 43, 17)", fontSize: "50px", fontWeight: "bold" }}>
                Book the best part of your trip
              </span>
            </Text>
          </Column>
        </Row>
      </Section>

      <Section>
        <Row>
          <Column align="left">
            <Link>
              <Img
                src="https://q1sgth5o59.ufs.sh/f/f17JrmYUJ9CpMIwypdosJT3K8L7GIMzwCoRFHVxdqhEg019v"
                style={{
                  borderRadius: "4px",
                  width: "100%",
                  height: "400px",
                  objectFit: "contain",
                  margin: "24px 0 0px 0"
                }}
              />
            </Link>
          </Column>
        </Row>
      </Section>

      <Section style={{ margin: "32px 0 0px 0" }}>
        <Row>
          <Column style={{ padding: "0px 32px 0px 32px" }}>
            <Text style={{ textAlign: "center", lineHeight: "28px", margin: 0 }}>
              <span style={{ fontSize: "24px" }}>
                The best part of any trip? The fun things you can do on it. With over 400,000 things to do, you can find anything you like whether it's underwater adventures or tours of art museums.
              </span>
            </Text>
          </Column>
        </Row>
      </Section>

      <Section style={{
        margin: "32px 0 0px 0",
        padding: "0px 24px 0px 24px",
        backgroundColor: "#ffffff"
      }}>
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
                backgroundColor: "#002b11",
                padding: "17px 24px 17px 24px",
                color: "#ffffff",
                borderRadius: "50px",
                fontSize: "18px",
                lineHeight: "normal",
                margin: "0px 0 0px 0",
                fontWeight: "bold",
                display: "block",
                textAlign: "center"
              }}
            >
              Explore things to do
            </Button>
          </Column>
        </Row>
      </Section>

      <Section style={{
        margin: "24px 0 0px 0",
        padding: "0px 24px 0px 24px",
        backgroundColor: "#ffffff"
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
                <Column align="center">
                  <Link>
                    <Img
                      src="https://q1sgth5o59.ufs.sh/f/f17JrmYUJ9CpDbnVLEjHAn19B3lvfZ8NYyXL6JRbgVEG2dPw"
                      style={{
                        borderRadius: "16px",
                        width: "100%",
                        height: "250px",
                        objectFit: "cover"
                      }}
                    />
                  </Link>
                </Column>
              </Row>
            </Section>

            <Section style={{ margin: "16px 0 0px 0" }}>
              <Row>
                <Column style={{ padding: "0 0 0 0" }}>
                  <Text style={{ textAlign: "left", lineHeight: "32px", margin: 0 }}>
                    <span style={{ color: "rgb(0, 0, 2)", fontSize: "32px", fontWeight: "bold" }}>
                      Check off an iconic road trip
                    </span>
                  </Text>
                </Column>
              </Row>
            </Section>

            <Section style={{ margin: "16px 0 0 0" }}>
              <Row>
                <Column style={{ padding: "0 0 0 0" }}>
                  <Text style={{ textAlign: "left", margin: 0 }}>
                    From Australia's Great Ocean Road to Iceland's Ring Road, these are can't-miss routes around the world with key stops and scenic detours included.
                  </Text>
                </Column>
              </Row>
            </Section>

            <Button
              href="#"
              style={{
                backgroundColor: "#002b11",
                padding: "17px 24px 17px 24px",
                color: "#ffffff",
                borderRadius: "32px",
                fontSize: "16px",
                lineHeight: "normal",
                margin: "16px 0 0 0",
                fontWeight: "bold"
              }}
            >
              Explore
            </Button>
          </Column>
        </Row>
      </Section>

      <Section style={{ margin: "16px 0 0px 0" }}>
        <Row>
          <Column style={{ padding: "0px 24px 0px 24px" }}>
            <Text style={{ margin: 0 }}>
              <span style={{ color: "rgb(0, 0, 2)", fontSize: "32px", fontWeight: "bold" }}>
                European summer has arrived
              </span>
            </Text>
          </Column>
        </Row>
      </Section>

      <Section style={{
        padding: "16px 24px 0px 24px",
        backgroundColor: "#ffffff"
      }}>
        <Row>
          <Column align="center" style={{
            width: "50%",
            paddingLeft: "0",
            paddingRight: "8px",
            verticalAlign: "top"
          }}>
            <Section style={{
              padding: "0px 0px 0px 0px",
              backgroundColor: "transparent"
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
                      <Column align="left">
                        <Link>
                          <Img
                            src="https://q1sgth5o59.ufs.sh/f/f17JrmYUJ9Cpb8FouWQntTSCj8Bcf12WGRNMmUD3VXdPoqIF"
                            style={{
                              borderRadius: "8px",
                              width: "100%",
                              height: "243px",
                              objectFit: "cover"
                            }}
                            alt="London"
                          />
                        </Link>
                      </Column>
                    </Row>
                  </Section>

                  <Section style={{ margin: "16px 0 0 0" }}>
                    <Row>
                      <Column style={{ padding: "0 0 0 0" }}>
                        <Text style={{ textAlign: "left", margin: 0 }}>
                          <span style={{ color: "rgb(0, 0, 2)", fontSize: "24px", fontWeight: "bold" }}>
                            London
                          </span>
                        </Text>
                      </Column>
                    </Row>
                  </Section>

                  <Button
                    href="#"
                    style={{
                      backgroundColor: "#002b11",
                      padding: "17px 24px 17px 24px",
                      color: "#ffffff",
                      borderRadius: "32px",
                      fontSize: "16px",
                      lineHeight: "normal",
                      margin: "16px 0 0 0",
                      fontWeight: "bold"
                    }}
                  >
                    Start planning
                  </Button>
                </Column>
              </Row>
            </Section>
          </Column>

          <Column align="center" style={{
            width: "50%",
            paddingLeft: "8px",
            paddingRight: "0",
            verticalAlign: "top"
          }}>
            <Section style={{
              padding: "0px 0px 0px 0px",
              backgroundColor: "transparent"
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
                      <Column align="left">
                        <Link>
                          <Img
                            src="https://q1sgth5o59.ufs.sh/f/f17JrmYUJ9Cp3S6K3PVnLr2EKdc01BOHDiAylwb4zfe8hGku"
                            style={{
                              borderRadius: "8px",
                              width: "100%",
                              height: "243px",
                              objectFit: "cover"
                            }}
                            alt="Paris"
                          />
                        </Link>
                      </Column>
                    </Row>
                  </Section>

                  <Section style={{ margin: "16px 0 0 0" }}>
                    <Row>
                      <Column style={{ padding: "0 0 0 0" }}>
                        <Text style={{ textAlign: "left", margin: 0 }}>
                          <span style={{ color: "rgb(0, 0, 2)", fontSize: "24px", fontWeight: "bold" }}>
                            Paris
                          </span>
                        </Text>
                      </Column>
                    </Row>
                  </Section>

                  <Button
                    href="#"
                    style={{
                      backgroundColor: "#002b11",
                      padding: "17px 24px 17px 24px",
                      color: "#ffffff",
                      borderRadius: "32px",
                      fontSize: "16px",
                      lineHeight: "normal",
                      margin: "16px 0 0 0",
                      fontWeight: "bold"
                    }}
                  >
                    Start planning
                  </Button>
                </Column>
              </Row>
            </Section>
          </Column>
        </Row>
      </Section>

      <Section style={{
        margin: "24px 0 0px 0",
        padding: "0px 0px 0px 24px",
        backgroundColor: "#feff59"
      }}>
        <Row>
          <Column align="left" style={{
            width: "50%",
            paddingLeft: "0",
            paddingRight: "12px",
            verticalAlign: "middle"
          }}>
            <Section style={{ margin: "0 0 0 0" }}>
              <Row>
                <Column style={{ padding: "0 0 0 0" }}>
                  <Text style={{ lineHeight: "28px", margin: 0 }}>
                    <span style={{ fontSize: "24px", fontWeight: "bold" }}>
                      Get the app to find the best places near you on the go
                    </span>
                  </Text>
                </Column>
              </Row>
            </Section>

            <Button
              href="#"
              style={{
                backgroundColor: "#002b11",
                padding: "17px 24px 17px 24px",
                color: "#ffffff",
                borderRadius: "32px",
                fontSize: "16px",
                lineHeight: "normal",
                margin: "16px 0 0 0",
                fontWeight: "bold"
              }}
            >
              Get the app
            </Button>
          </Column>

          <Column align="left" style={{
            width: "50%",
            paddingLeft: "12px",
            paddingRight: "0",
            verticalAlign: "top"
          }}>
            <Section>
              <Row>
                <Column align="right">
                  <Link>
                    <Img
                      src="https://q1sgth5o59.ufs.sh/f/f17JrmYUJ9CpsxHbijRVPQ84gI0qTOGajKok7MsXxDbt6NLe"
                      style={{
                        width: "275px",
                        height: "274px",
                        objectFit: "cover"
                      }}
                      alt="CTA Image"
                    />
                  </Link>
                </Column>
              </Row>
            </Section>
          </Column>
        </Row>
      </Section>

      <Section style={{
        padding: "48px 24px 48px 24px",
        backgroundColor: "#ffffff"
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
                <Column align="left">
                  <Link>
                    <Img
                      src="https://q1sgth5o59.ufs.sh/f/f17JrmYUJ9CpsC2ubDJRVPQ84gI0qTOGajKok7MsXxDbt6NL"
                      style={{
                        borderRadius: "4px",
                        width: "171px",
                        height: "33px"
                      }}
                    />
                  </Link>
                </Column>
              </Row>
            </Section>

            <Section style={{ margin: "0px 0 0px 0" }}>
              <Row>
                <Column style={{ padding: "16px 0px 0px 0px" }}>
                  <Text style={{ lineHeight: "12px", margin: 0 }}>
                    <span style={{ fontSize: "12px" }}>
                      Please do not reply directly to this email. This message was sent from an address that does not accept replies. If you have more questions or need help, visit our Help Center.
                    </span>
                  </Text>
                </Column>
              </Row>
            </Section>

            <Section style={{ margin: "0px 0 0px 0" }}>
              <Row>
                <Column style={{ padding: "16px 0px 0px 0px" }}>
                  <Text style={{ lineHeight: "12px", margin: 0 }}>
                    <span style={{ fontSize: "12px" }}>
                      Your Company LLC, 400 1st Ave., City, State 02494, Country.
                    </span>
                  </Text>
                </Column>
              </Row>
            </Section>

            <Section style={{ margin: "0px 0 0px 0" }}>
              <Row>
                <Column style={{ padding: "16px 0px 0px 0px" }}>
                  <Text style={{ lineHeight: "12px", margin: 0 }}>
                    <span style={{ fontSize: "12px" }}>
                      © 2025 Your Company LLC. All rights reserved.
                    </span>
                  </Text>
                </Column>
              </Row>
            </Section>

            <Section style={{ margin: "16px 0 0px 0" }}>
              <Row>
                <Column align="left">
                  <Row style={{ display: "table-cell" }}>
                    <Column style={{ paddingRight: "16px" }}>
                      <Link href="#">
                        <Text style={{ margin: 0 }}>
                          <span style={{ color: "rgb(0, 43, 17)", fontSize: "12px", fontWeight: "bold", textDecoration: "underline" }}>
                            Go to site
                          </span>
                        </Text>
                      </Link>
                    </Column>
                    <Column>
                      <Link href="#">
                        <Text style={{ margin: 0 }}>
                          <span style={{ color: "rgb(0, 43, 17)", fontSize: "12px", fontWeight: "bold", textDecoration: "underline" }}>
                            Unsubscribe
                          </span>
                        </Text>
                      </Link>
                    </Column>
                  </Row>
                </Column>
              </Row>
            </Section>

            <Section style={{ margin: "16px 0 0px 0" }}>
              <Row>
                <Column align="left">
                  <Row style={{ display: "table-cell" }}>
                    <Column style={{ paddingRight: "16px" }}>
                      <Link href="#">
                        <Text style={{ margin: 0 }}>
                          <span style={{ color: "rgb(0, 43, 17)", fontSize: "12px", fontWeight: "bold", textDecoration: "underline" }}>
                            Privacy and cookie policy
                          </span>
                        </Text>
                      </Link>
                    </Column>
                    <Column>
                      <Link href="#">
                        <Text style={{ margin: 0 }}>
                          <span style={{ color: "rgb(0, 43, 17)", fontSize: "12px", fontWeight: "bold", textDecoration: "underline" }}>
                            Contact us
                          </span>
                        </Text>
                      </Link>
                    </Column>
                  </Row>
                </Column>
              </Row>
            </Section>

            <Section style={{ margin: "32px 0 48px 0" }}>
              <Row>
                <Column align="left" style={{
                  width: "20%",
                  paddingLeft: "0",
                  paddingRight: "0px",
                  verticalAlign: "top"
                }}>
                  <Section style={{
                    padding: "0 0 0 0",
                    backgroundColor: "#ffffff"
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
                            <Column align="left">
                              <Link href="#">
                                <Img
                                  src="https://www.reactemailtemplate.com/apple-store-badge.png"
                                  style={{
                                    borderRadius: "12px",
                                    width: "140px",
                                    height: "40px",
                                    objectFit: "cover"
                                  }}
                                />
                              </Link>
                            </Column>
                          </Row>
                        </Section>
                      </Column>
                    </Row>
                  </Section>
                </Column>

                <Column align="left" style={{
                  width: "50%",
                  paddingLeft: "0px",
                  paddingRight: "0",
                  verticalAlign: "top"
                }}>
                  <Section style={{
                    padding: "0 0 0 0",
                    backgroundColor: "#ffffff"
                  }}>
                    <Row>
                      <Column align="center" style={{
                        width: "100%",
                        paddingLeft: "0",
                        paddingRight: "0",
                        verticalAlign: "top"
                      }}>
                        <Section>
                          <Row>
                            <Column align="left">
                              <Link href="#">
                                <Img
                                  src="https://www.reactemailtemplate.com/google-play-badge.png"
                                  style={{
                                    borderRadius: "12px",
                                    width: "140px",
                                    height: "40px",
                                    objectFit: "cover"
                                  }}
                                />
                              </Link>
                            </Column>
                          </Row>
                        </Section>
                      </Column>
                    </Row>
                  </Section>
                </Column>
              </Row>
            </Section>
          </Column>
        </Row>
      </Section>
    </>
  );
}

