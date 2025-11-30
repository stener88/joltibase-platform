/**
 * PATTERN: Customer Feedback Survey (NPS)
 * USE CASE: Net Promoter Score surveys with rating scale, customer satisfaction checks - perfect for SaaS, B2B platforms, post-purchase feedback, service quality assessments
 * TAGS: feedback, survey, nps, customer-satisfaction, rating, engagement, retention, research, questionnaire, customer-experience
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

export default function FeedbackSurveyEmail() {
  return (
    <>
      <Section style={{
        padding: "24px 16px 24px 16px",
        backgroundColor: "#ffe27c"
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
                      src="https://q1sgth5o59.ufs.sh/f/f17JrmYUJ9CpzMVSW9UHg9WzVRP0tOTQZ1m47oacSfjXDiKw"
                      style={{
                        width: "56px",
                        height: "19px"
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
        padding: "40px 20px 100px 20px",
        backgroundColor: "#fffbf5"
      }}>
        <Row>
          <Column align="left" style={{
            width: "100%",
            paddingLeft: "0",
            paddingRight: "0",
            verticalAlign: "top"
          }}>
            <Section style={{
              margin: "0px 0 0px 0"
            }}>
              <Row>
                <Column style={{ padding: "16px 20px 16px 20px" }}>
                  <Text style={{ textAlign: "left", margin: 0 }}>
                    <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                      Time for a quick check-in!
                    </span>
                  </Text>
                </Column>
              </Row>
            </Section>

            <Section style={{
              margin: "14px 0 14px 0"
            }}>
              <Row>
                <Column style={{ padding: "0px 20px 0px 20px" }}>
                  <Text style={{ lineHeight: "24px", margin: 0 }}>
                    <span style={{ color: "rgb(27, 27, 27)", fontSize: "14px" }}>
                      We'd love your feedback to ensure we're delivering the best possible service for you.
                    </span>
                  </Text>
                </Column>
              </Row>
            </Section>

            <Section style={{
              margin: "0px 0 0px 0"
            }}>
              <Row>
                <Column style={{ padding: "0px 20px 0px 20px" }}>
                  <Text style={{ margin: 0 }}>
                    <span style={{ color: "rgb(27, 27, 27)", fontSize: "14px" }}>
                      We're proud to partner with your organization to ensure a seamless and efficient journey.
                    </span>
                  </Text>
                </Column>
              </Row>
            </Section>

            <Section style={{
              margin: "14px 0 14px 0"
            }}>
              <Row>
                <Column style={{ padding: "0px 20px 0px 20px" }}>
                  <Text style={{ margin: 0 }}>
                    <span style={{ color: "rgb(27, 27, 27)", fontSize: "14px" }}>
                      We help thousands of companies globally with unmatched speed, flexibility, and compliance. We're always working to make your experience even better.
                    </span>
                  </Text>
                </Column>
              </Row>
            </Section>

            <Section style={{
              margin: "50px 0 0px 0",
              padding: "0px 20px 0px 20px",
              backgroundColor: "#fef0d8",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
              borderBottomLeftRadius: "8px",
              borderBottomRightRadius: "8px"
            }}>
              <Row>
                <Column align="left" style={{
                  width: "100%",
                  paddingLeft: "0",
                  paddingRight: "0",
                  verticalAlign: "top"
                }}>
                  <Section style={{
                    margin: "16px 0px 16px 0px"
                  }}>
                    <Row>
                      <Column style={{ padding: "16px 0px 16px 0px" }}>
                        <Text style={{ textAlign: "center", lineHeight: "24px", margin: 0 }}>
                          <span style={{ fontSize: "26px", fontWeight: "bold" }}>
                            How likely are you to recommend us to a friend or colleague?
                          </span>
                        </Text>
                      </Column>
                    </Row>
                  </Section>

                  <Section>
                    <Row>
                      <Column align="left" style={{
                        width: "50%",
                        paddingLeft: "0",
                        paddingRight: "5px",
                        verticalAlign: "top"
                      }}>
                        <Section>
                          <Row>
                            <Column align="center">
                              <Row style={{ display: "table-cell" }}>
                                <Column style={{ paddingRight: "10px" }}>
                                  <Link href="#">
                                    <Button
                                      href="#"
                                      style={{
                                        backgroundColor: "#ffe27c",
                                        padding: "8px 12px 8px 12px",
                                        color: "#000000",
                                        borderRadius: "100px",
                                        fontSize: "12px",
                                        lineHeight: "normal",
                                        fontWeight: "bold"
                                      }}
                                    >
                                      0
                                    </Button>
                                  </Link>
                                </Column>
                                <Column style={{ paddingRight: "10px" }}>
                                  <Link href="#">
                                    <Button
                                      href="#"
                                      style={{
                                        backgroundColor: "#ffe27c",
                                        padding: "8px 13px 8px 13px",
                                        color: "#000000",
                                        borderRadius: "100px",
                                        fontSize: "12px",
                                        lineHeight: "normal",
                                        fontWeight: "bold"
                                      }}
                                    >
                                      1
                                    </Button>
                                  </Link>
                                </Column>
                                <Column style={{ paddingRight: "10px" }}>
                                  <Link href="#">
                                    <Button
                                      href="#"
                                      style={{
                                        backgroundColor: "#ffe27c",
                                        padding: "8px 12px 8px 12px",
                                        color: "#000000",
                                        borderRadius: "100px",
                                        fontSize: "12px",
                                        lineHeight: "normal",
                                        fontWeight: "bold"
                                      }}
                                    >
                                      2
                                    </Button>
                                  </Link>
                                </Column>
                                <Column style={{ paddingRight: "10px" }}>
                                  <Link href="#">
                                    <Button
                                      href="#"
                                      style={{
                                        backgroundColor: "#ffe27c",
                                        padding: "8px 12px 8px 12px",
                                        color: "#000000",
                                        borderRadius: "100px",
                                        fontSize: "12px",
                                        lineHeight: "normal",
                                        fontWeight: "bold"
                                      }}
                                    >
                                      3
                                    </Button>
                                  </Link>
                                </Column>
                                <Column style={{ paddingRight: "10px" }}>
                                  <Link href="#">
                                    <Button
                                      href="#"
                                      style={{
                                        backgroundColor: "#ffe27c",
                                        padding: "8px 12px 8px 12px",
                                        color: "#000000",
                                        borderRadius: "100px",
                                        fontSize: "12px",
                                        lineHeight: "normal",
                                        fontWeight: "bold"
                                      }}
                                    >
                                      4
                                    </Button>
                                  </Link>
                                </Column>
                                <Column style={{ paddingRight: "10px" }}>
                                  <Link href="#">
                                    <Button
                                      href="#"
                                      style={{
                                        backgroundColor: "#ffe27c",
                                        padding: "8px 12px 8px 12px",
                                        color: "#000000",
                                        borderRadius: "100px",
                                        fontSize: "12px",
                                        lineHeight: "normal",
                                        fontWeight: "bold"
                                      }}
                                    >
                                      5
                                    </Button>
                                  </Link>
                                </Column>
                                <Column>
                                  <Link href="#">
                                    <Button
                                      href="#"
                                      style={{
                                        backgroundColor: "#ffe27c",
                                        padding: "8px 12px 8px 12px",
                                        color: "#000000",
                                        borderRadius: "100px",
                                        fontSize: "12px",
                                        lineHeight: "normal",
                                        fontWeight: "bold"
                                      }}
                                    >
                                      6
                                    </Button>
                                  </Link>
                                </Column>
                              </Row>
                            </Column>
                          </Row>
                        </Section>
                      </Column>
                      <Column align="left" style={{
                        width: "50%",
                        paddingLeft: "5px",
                        paddingRight: "0",
                        verticalAlign: "top"
                      }}>
                        <Section>
                          <Row>
                            <Column align="center">
                              <Row style={{ display: "table-cell" }}>
                                <Column style={{ paddingRight: "10px" }}>
                                  <Link href="#">
                                    <Button
                                      href="#"
                                      style={{
                                        backgroundColor: "#ffe27c",
                                        padding: "8px 12px 8px 12px",
                                        color: "#000000",
                                        borderRadius: "100px",
                                        fontSize: "12px",
                                        lineHeight: "normal",
                                        fontWeight: "bold"
                                      }}
                                    >
                                      7
                                    </Button>
                                  </Link>
                                </Column>
                                <Column style={{ paddingRight: "10px" }}>
                                  <Link href="#">
                                    <Button
                                      href="#"
                                      style={{
                                        backgroundColor: "#ffe27c",
                                        padding: "8px 12px 8px 12px",
                                        color: "#000000",
                                        borderRadius: "100px",
                                        fontSize: "12px",
                                        lineHeight: "normal",
                                        fontWeight: "bold"
                                      }}
                                    >
                                      8
                                    </Button>
                                  </Link>
                                </Column>
                                <Column style={{ paddingRight: "10px" }}>
                                  <Link href="#">
                                    <Button
                                      href="#"
                                      style={{
                                        backgroundColor: "#ffe27c",
                                        padding: "8px 12px 8px 12px",
                                        color: "#000000",
                                        borderRadius: "100px",
                                        fontSize: "12px",
                                        lineHeight: "normal",
                                        fontWeight: "bold"
                                      }}
                                    >
                                      9
                                    </Button>
                                  </Link>
                                </Column>
                                <Column>
                                  <Link href="#">
                                    <Button
                                      href="#"
                                      style={{
                                        backgroundColor: "#ffe27c",
                                        padding: "8px 10px 8px 10px",
                                        color: "#000000",
                                        borderRadius: "100px",
                                        fontSize: "12px",
                                        lineHeight: "normal",
                                        fontWeight: "bold"
                                      }}
                                    >
                                      10
                                    </Button>
                                  </Link>
                                </Column>
                              </Row>
                            </Column>
                          </Row>
                        </Section>
                      </Column>
                    </Row>
                  </Section>

                  <Section style={{
                    padding: "20px 0px 30px 0px",
                    backgroundColor: "#fef0d8"
                  }}>
                    <Row>
                      <Column align="left" style={{
                        width: "50%",
                        paddingLeft: "0",
                        paddingRight: "16px",
                        verticalAlign: "top"
                      }}>
                        <Section style={{
                          margin: "0px 0 0px 0"
                        }}>
                          <Row>
                            <Column style={{ padding: "0px 16px 0px 16px" }}>
                              <Text style={{ margin: 0 }}>
                                <span style={{ color: "rgb(155, 155, 155)", fontSize: "14px" }}>
                                  0 - Not at all likely
                                </span>
                              </Text>
                            </Column>
                          </Row>
                        </Section>
                      </Column>
                      <Column align="left" style={{
                        width: "50%",
                        paddingLeft: "16px",
                        paddingRight: "0",
                        verticalAlign: "top"
                      }}>
                        <Section style={{
                          margin: "0px 0 0px 0"
                        }}>
                          <Row>
                            <Column style={{ padding: "0px 16px 0px 16px" }}>
                              <Text style={{ textAlign: "right", margin: 0 }}>
                                <span style={{ color: "rgb(155, 155, 155)", fontSize: "14px" }}>
                                  10 - Extremely likely
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

            <Section style={{ backgroundColor: "#fffbf6" }}>
              <Row>
                <Column align="center" style={{
                  width: "100%",
                  paddingLeft: "0",
                  paddingRight: "0",
                  verticalAlign: "top"
                }}>
                  <Section style={{
                    margin: "50px 0 14px 0"
                  }}>
                    <Row>
                      <Column style={{ padding: "0px 20px 0px 20px" }}>
                        <Text style={{ margin: 0 }}>
                          <span style={{ color: "rgb(27, 27, 27)", fontSize: "14px" }}>
                            All the best,
                          </span>
                        </Text>
                        <Text style={{ margin: 0 }}>
                          <span style={{ color: "rgb(27, 27, 27)", fontSize: "14px" }}>
                            The Team
                          </span>
                        </Text>
                      </Column>
                    </Row>
                  </Section>

                  <Section>
                    <Row>
                      <Column align="left">
                        <Row style={{ display: "table-cell" }}>
                          <Column>
                            <Link href="#">
                              <Text style={{ margin: 0 }}>
                                <span style={{ color: "rgb(17, 86, 204)", fontSize: "13px", textDecoration: "underline" }}>
                                  Unsubscribe From This List
                                </span>
                              </Text>
                            </Link>
                          </Column>
                          <Column style={{ paddingLeft: "8px", paddingRight: "8px" }}>
                            <span style={{ color: "#000000", fontSize: "14px", lineHeight: "1" }}>
                              |
                            </span>
                          </Column>
                          <Column>
                            <Link href="#">
                              <Text style={{ margin: 0 }}>
                                <span style={{ color: "rgb(17, 86, 204)", fontSize: "13px", textDecoration: "underline" }}>
                                  Manage Email Preferences
                                </span>
                              </Text>
                            </Link>
                          </Column>
                        </Row>
                      </Column>
                    </Row>
                  </Section>
                </Column>
              </Row>
            </Section>
          </Column>
        </Row>
      </Section>

      <Section style={{
        padding: "64px 56px 64px 56px",
        backgroundColor: "#1b1b1b"
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
                <Column align="center">
                  <Link>
                    <Img
                      src="https://q1sgth5o59.ufs.sh/f/f17JrmYUJ9CpEqJTInCWpFXju5369roDJZIabv0NgmwQKt81"
                      style={{
                        width: "80px",
                        height: "27px"
                      }}
                    />
                  </Link>
                </Column>
              </Row>
            </Section>

            <Section style={{ margin: "0px 0 0px 0" }}>
              <Row>
                <Column style={{ padding: "0 0 0 0" }}>
                  <Text style={{ textAlign: "center", margin: 0 }}>
                    <span style={{ color: "rgb(255, 255, 255)", fontSize: "14px" }}>
                      Copyright 2025. All Rights Reserved
                    </span>
                  </Text>
                </Column>
              </Row>
            </Section>

            <Section style={{ margin: "0px 0 0px 0" }}>
              <Row>
                <Column style={{ padding: "0px 0px 0px 0px" }}>
                  <Text style={{ textAlign: "center", margin: 0 }}>
                    <span style={{ color: "rgb(255, 255, 255)", fontSize: "14px" }}>
                      650 2nd Street, San Francisco, California, 94107, USA
                    </span>
                  </Text>
                </Column>
              </Row>
            </Section>

            <Section style={{
              padding: "0 0 0 0",
              margin: "24px 0 0px 0"
            }}>
              <Row>
                <Column align="center">
                  <Row style={{ display: "table-cell" }}>
                    <Column style={{ paddingRight: "8px" }}>
                      <Link href="#">
                        <Img
                          src="https://q1sgth5o59.ufs.sh/f/f17JrmYUJ9CpKC2gp6bgS5tRGFilLJCM8QIpvsbhKWudz6Y1"
                          style={{
                            borderRadius: "4px",
                            width: "32px",
                            height: "32px"
                          }}
                        />
                      </Link>
                    </Column>
                    <Column style={{ paddingRight: "8px" }}>
                      <Link href="#">
                        <Img
                          src="https://q1sgth5o59.ufs.sh/f/f17JrmYUJ9CpsWPBvtRVPQ84gI0qTOGajKok7MsXxDbt6NLe"
                          style={{
                            borderRadius: "4px",
                            width: "32px",
                            height: "32px"
                          }}
                        />
                      </Link>
                    </Column>
                    <Column style={{ paddingRight: "8px" }}>
                      <Link href="#">
                        <Img
                          src="https://q1sgth5o59.ufs.sh/f/f17JrmYUJ9CpbqwTuZ4QntTSCj8Bcf12WGRNMmUD3VXdPoqI"
                          style={{
                            borderRadius: "4px",
                            width: "32px",
                            height: "32px"
                          }}
                        />
                      </Link>
                    </Column>
                    <Column>
                      <Link href="#">
                        <Img
                          src="https://q1sgth5o59.ufs.sh/f/f17JrmYUJ9Cpz9ZcpXUHg9WzVRP0tOTQZ1m47oacSfjXDiKw"
                          style={{
                            borderRadius: "4px",
                            width: "32px",
                            height: "32px"
                          }}
                        />
                      </Link>
                    </Column>
                  </Row>
                </Column>
              </Row>
            </Section>

            <Section style={{ margin: "16px 0 0 0" }}>
              <Row>
                <Column style={{ padding: "0 0 0 0" }}>
                  <Text style={{ textAlign: "center", margin: 0 }}>
                    <span style={{ color: "rgb(255, 255, 255)", fontSize: "14px" }}>
                      This is a no-reply email
                    </span>
                  </Text>
                </Column>
              </Row>
            </Section>

            <Section>
              <Row>
                <Column align="center">
                  <Row style={{ display: "table-cell" }}>
                    <Column>
                      <Link href="#">
                        <Text style={{ margin: 0 }}>
                          <span style={{ color: "rgb(255, 255, 255)", fontSize: "14px", textDecoration: "underline" }}>
                            Contact us
                          </span>
                        </Text>
                      </Link>
                    </Column>
                    <Column style={{ paddingLeft: "8px", paddingRight: "8px" }}>
                      <span style={{ color: "#cccccc", fontSize: "14px", lineHeight: "1" }}>
                        |
                      </span>
                    </Column>
                    <Column>
                      <Link href="#">
                        <Text style={{ margin: 0 }}>
                          <span style={{ color: "rgb(255, 255, 255)", fontSize: "14px", textDecoration: "underline" }}>
                            Email preferences
                          </span>
                        </Text>
                      </Link>
                    </Column>
                  </Row>
                </Column>
              </Row>
            </Section>

            <Section style={{ margin: "48px 0 0px 0" }}>
              <Row>
                <Column style={{ padding: "0 0 0 0" }}>
                  <Text style={{ textAlign: "center", lineHeight: "22px", margin: 0 }}>
                    <span style={{ color: "rgb(255, 255, 255)", fontSize: "14px" }}>
                      To manage the emails you receive,
                    </span>
                  </Text>
                  <Text style={{ textAlign: "center", lineHeight: "22px", margin: 0 }}>
                    <span style={{ color: "rgb(255, 255, 255)", fontSize: "14px", textDecoration: "underline" }}>
                      go to notifications settings
                    </span>
                  </Text>
                </Column>
              </Row>
            </Section>
          </Column>
        </Row>
      </Section>
    </>
  );
}

