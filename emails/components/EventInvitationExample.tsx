/**
 * PATTERN: Event Invitation & Announcement
 * USE CASE: Multi-event announcements with detailed cards, dates, and locations - perfect for developer events, webinars, conferences, workshops, community meetups
 * TAGS: event, invitation, conference, webinar, workshop, announcement, registration, calendar, developer, community, multi-event
 */

import {
  Column,
  Img,
  Link,
  Row,
  Section,
  Text,
} from '@react-email/components';

export default function EventInvitationEmail() {
  return (
    <>
      <Section>
        <Row>
          <Column align="left">
            <Link>
              <Img
                src="https://q1sgth5o59.ufs.sh/f/f17JrmYUJ9CpEd8pZaCWpFXju5369roDJZIabv0NgmwQKt81"
                style={{
                  borderRadius: "4px",
                  width: "600px",
                  height: "400px"
                }}
              />
            </Link>
          </Column>
        </Row>
      </Section>

      <Section style={{
        padding: "36px 40px 32px 40px",
        backgroundColor: "#f5f5f7"
      }}>
        <Row>
          <Column align="left" style={{
            width: "100%",
            paddingLeft: "0",
            paddingRight: "0",
            verticalAlign: "top"
          }}>
            <Section style={{
              padding: "0px 0px 0px 0px",
              backgroundColor: "#f5f5f7"
            }}>
              <Row>
                <Column align="center" style={{
                  width: "100%",
                  paddingLeft: "0",
                  paddingRight: "0",
                  verticalAlign: "top"
                }}>
                  <Section style={{ margin: "0px 0 12px 0" }}>
                    <Row>
                      <Column style={{ padding: "0 0 0 0" }}>
                        <Text style={{ textAlign: "center", margin: 0 }}>
                          <span style={{ color: "rgb(134, 134, 139)", fontWeight: "bold" }}>
                            MEET WITH US
                          </span>
                        </Text>
                      </Column>
                    </Row>
                  </Section>

                  <Section style={{ margin: "0px 0 0px 0" }}>
                    <Row>
                      <Column style={{ padding: "0 0 0 0" }}>
                        <Text style={{ textAlign: "center", lineHeight: "44px", margin: 0 }}>
                          <span style={{ fontSize: "40px", fontWeight: "bold" }}>
                            New activities
                          </span>
                        </Text>
                        <Text style={{ textAlign: "center", lineHeight: "44px", margin: 0 }}>
                          <span style={{ fontSize: "40px", fontWeight: "bold" }}>
                            around the world
                          </span>
                        </Text>
                      </Column>
                    </Row>
                  </Section>

                  <Link href="#">
                    <Section style={{ margin: "0 0 0 0" }}>
                      <Row>
                        <Column style={{ padding: "12px 0px 0px 0px" }}>
                          <Text style={{ textAlign: "center", margin: 0 }}>
                            <span style={{ fontWeight: "bold" }}>Browse all activities</span>
                          </Text>
                        </Column>
                      </Row>
                    </Section>
                  </Link>

                  <Section style={{
                    padding: "32px 0px 0px 0px",
                    backgroundColor: "#f5f5f7"
                  }}>
                    <Row>
                      <Column align="left" style={{
                        width: "50%",
                        paddingLeft: "0",
                        paddingRight: "6px",
                        verticalAlign: "top"
                      }}>
                        <Section style={{
                          padding: "40px 30px 40px 30px",
                          backgroundColor: "#ffffff",
                          borderRadius: "16px"
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
                                        src="https://q1sgth5o59.ufs.sh/f/f17JrmYUJ9CpBfEboJaj3zOIkXJp9lL8TVnAQbNhqY2Zf1gs"
                                        style={{
                                          borderRadius: "4px",
                                          width: "44px",
                                          height: "44px"
                                        }}
                                      />
                                    </Link>
                                  </Column>
                                </Row>
                              </Section>

                              <Section style={{ margin: "16px 0 0px 0" }}>
                                <Row>
                                  <Column style={{ padding: "0 0 0 0" }}>
                                    <Text style={{ lineHeight: "25px", margin: 0 }}>
                                      <span style={{ color: "rgb(29, 29, 31)", fontSize: "21px", fontWeight: "bold" }}>
                                        Code along with the foundation Models framework
                                      </span>
                                    </Text>
                                  </Column>
                                </Row>
                              </Section>

                              <Section style={{ margin: "8px 0 0 0" }}>
                                <Row>
                                  <Column style={{ padding: "0 0 0 0" }}>
                                    <Text style={{ lineHeight: "20px", margin: 0 }}>
                                      <span style={{ backgroundColor: "rgb(255, 255, 255)", color: "rgb(29, 29, 31)", fontSize: "14px" }}>
                                        Get hands-on experience using the Foundation Models framework to access on-device LLM. In this session, you can code along with us as we build generative AI features into a sample app live.
                                      </span>
                                    </Text>
                                  </Column>
                                </Row>
                              </Section>

                              <Section style={{ margin: "20px 0 0px 0" }}>
                                <Row>
                                  <Column style={{ padding: "0px 0px 0px 0px" }}>
                                    <Text style={{ margin: 0 }}>
                                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>September 25</span>
                                    </Text>
                                    <Text style={{ margin: 0 }}>
                                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>Online</span>
                                    </Text>
                                    <Text style={{ margin: 0 }}>
                                      <span style={{ color: "rgb(0, 102, 204)", fontSize: "14px" }}>Sign up now</span>
                                    </Text>
                                  </Column>
                                </Row>
                              </Section>
                            </Column>
                          </Row>
                        </Section>
                      </Column>

                      <Column align="left" style={{
                        width: "50%",
                        paddingLeft: "6px",
                        paddingRight: "0",
                        verticalAlign: "top"
                      }}>
                        <Section style={{
                          padding: "40px 30px 35px 30px",
                          backgroundColor: "#ffffff",
                          borderRadius: "16px"
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
                                        src="https://q1sgth5o59.ufs.sh/f/f17JrmYUJ9CpqVBwZHi3bEeCzuWnlFapjhAUSD8Z7c6Bk9s4"
                                        style={{
                                          borderRadius: "4px",
                                          width: "44px",
                                          height: "44px"
                                        }}
                                      />
                                    </Link>
                                  </Column>
                                </Row>
                              </Section>

                              <Section style={{ margin: "16px 0 0px 0" }}>
                                <Row>
                                  <Column style={{ padding: "0 0 0 0" }}>
                                    <Text style={{ lineHeight: "25px", margin: 0 }}>
                                      <span style={{ color: "rgb(29, 29, 31)", fontSize: "21px", fontWeight: "bold" }}>
                                        Optimize your app's speed and efficiency
                                      </span>
                                    </Text>
                                  </Column>
                                </Row>
                              </Section>

                              <Section style={{ margin: "8px 0 0 0" }}>
                                <Row>
                                  <Column style={{ padding: "0 0 0 0" }}>
                                    <Text style={{ lineHeight: "20px", margin: 0 }}>
                                      <span style={{ backgroundColor: "rgb(255, 255, 255)", color: "rgb(29, 29, 31)", fontSize: "14px" }}>
                                        Back by popular demand!
                                      </span>
                                    </Text>
                                    <Text style={{ lineHeight: "20px", margin: 0 }}>
                                      <span style={{ backgroundColor: "rgb(255, 255, 255)", color: "rgb(29, 29, 31)", fontSize: "14px" }}>
                                        Join us to discover how you can maximize your app's performance and resolve inefficiencies.
                                      </span>
                                    </Text>
                                  </Column>
                                </Row>
                              </Section>

                              <Section style={{ margin: "8px 0 0 0" }}>
                                <Row>
                                  <Column style={{ padding: "0 0 0 0" }}>
                                    <Text style={{ margin: 0 }}>
                                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>October 30</span>
                                    </Text>
                                    <Text style={{ margin: 0 }}>
                                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>In person (Cupertino)</span>
                                    </Text>
                                    <Text style={{ margin: 0 }}>
                                      <span style={{ color: "rgb(0, 102, 204)", fontSize: "14px" }}>Sign up now</span>
                                    </Text>
                                  </Column>
                                </Row>
                              </Section>

                              <Section style={{ margin: "20px 0 0px 0" }}>
                                <Row>
                                  <Column style={{ padding: "0px 0px 0px 0px" }}>
                                    <Text style={{ margin: 0 }}>
                                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>October 30</span>
                                    </Text>
                                    <Text style={{ margin: 0 }}>
                                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>Online</span>
                                    </Text>
                                    <Text style={{ margin: 0 }}>
                                      <span style={{ color: "rgb(0, 102, 0, 204)", fontSize: "14px" }}>Sign up now</span>
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

                  <Section style={{
                    padding: "12px 0px 0px 0px",
                    backgroundColor: "#f5f5f7"
                  }}>
                    <Row>
                      <Column align="left" style={{
                        width: "50%",
                        paddingLeft: "0",
                        paddingRight: "6px",
                        verticalAlign: "top"
                      }}>
                        <Section style={{
                          padding: "40px 30px 40px 30px",
                          backgroundColor: "#ffffff",
                          borderRadius: "16px"
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
                                        src="https://q1sgth5o59.ufs.sh/f/f17JrmYUJ9CpbaWSXnQntTSCj8Bcf12WGRNMmUD3VXdPoqIF"
                                        style={{
                                          borderRadius: "4px",
                                          width: "44px",
                                          height: "44px"
                                        }}
                                      />
                                    </Link>
                                  </Column>
                                </Row>
                              </Section>

                              <Section style={{ margin: "16px 0 0px 0" }}>
                                <Row>
                                  <Column style={{ padding: "0 0 0 0" }}>
                                    <Text style={{ lineHeight: "25px", margin: 0 }}>
                                      <span style={{ color: "rgb(29, 29, 31)", fontSize: "21px", fontWeight: "bold" }}>
                                        Creative immersive media experiences for visionOS
                                      </span>
                                    </Text>
                                  </Column>
                                </Row>
                              </Section>

                              <Section style={{ margin: "8px 0 0 0" }}>
                                <Row>
                                  <Column style={{ padding: "0 0 0 0" }}>
                                    <Text style={{ lineHeight: "20px", margin: 0 }}>
                                      <span style={{ backgroundColor: "rgb(255, 255, 255)", color: "rgb(29, 29, 31)", fontSize: "14px" }}>
                                        Learn how to create compelling interactive experiences and capture immersive video in this multi-day activity held in person and online.
                                      </span>
                                    </Text>
                                  </Column>
                                </Row>
                              </Section>

                              <Section style={{ margin: "20px 0 0px 0" }}>
                                <Row>
                                  <Column style={{ padding: "0px 0px 16px 0px" }}>
                                    <Text style={{ margin: 0 }}>
                                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>October 21-23</span>
                                    </Text>
                                    <Text style={{ margin: 0 }}>
                                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>In person (Cupertino)</span>
                                    </Text>
                                    <Text style={{ margin: 0 }}>
                                      <span style={{ color: "rgb(0, 102, 204)", fontSize: "14px" }}>Sign up now</span>
                                    </Text>
                                  </Column>
                                </Row>
                              </Section>

                              <Section style={{ margin: "20px 0 0px 0" }}>
                                <Row>
                                  <Column style={{ padding: "0px 0px 0px 0px" }}>
                                    <Text style={{ margin: 0 }}>
                                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>October 21-22</span>
                                    </Text>
                                    <Text style={{ margin: 0 }}>
                                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>Online</span>
                                    </Text>
                                    <Text style={{ margin: 0 }}>
                                      <span style={{ color: "rgb(0, 102, 204)", fontSize: "14px" }}>Sign up now</span>
                                    </Text>
                                  </Column>
                                </Row>
                              </Section>
                            </Column>
                          </Row>
                        </Section>
                      </Column>

                      <Column align="left" style={{
                        width: "50%",
                        paddingLeft: "6px",
                        paddingRight: "0",
                        verticalAlign: "top"
                      }}>
                        <Section style={{
                          padding: "40px 30px 156px 30px",
                          backgroundColor: "#ffffff",
                          borderRadius: "16px"
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
                                        src="https://q1sgth5o59.ufs.sh/f/f17JrmYUJ9CpiSoGgrAUXFtzfojy57MRah2SHBOZcYKACmqp"
                                        style={{
                                          borderRadius: "4px",
                                          width: "44px",
                                          height: "44px"
                                        }}
                                      />
                                    </Link>
                                  </Column>
                                </Row>
                              </Section>

                              <Section style={{ margin: "16px 0 0px 0" }}>
                                <Row>
                                  <Column style={{ padding: "0 0 0 0" }}>
                                    <Text style={{ lineHeight: "25px", margin: 0 }}>
                                      <span style={{ color: "rgb(29, 29, 31)", fontSize: "21px", fontWeight: "bold" }}>
                                        IETF HLS Interest Day 2025
                                      </span>
                                    </Text>
                                  </Column>
                                </Row>
                              </Section>

                              <Section style={{ margin: "8px 0 0 0" }}>
                                <Row>
                                  <Column style={{ padding: "0 0 0 0" }}>
                                    <Text style={{ lineHeight: "20px", margin: 0 }}>
                                      <span style={{ backgroundColor: "rgb(255, 255, 255)", color: "rgb(29, 29, 31)", fontSize: "14px" }}>
                                        Learn about the latest updates to HTTP Live Streaming (HLS), Immersive Video, Spatial Audio, and more.
                                      </span>
                                    </Text>
                                  </Column>
                                </Row>
                              </Section>

                              <Section style={{ margin: "8px 0 0 0" }}>
                                <Row>
                                  <Column style={{ padding: "0 0 0 0" }}>
                                    <Text style={{ margin: 0 }}>
                                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>October 23</span>
                                    </Text>
                                    <Text style={{ margin: 0 }}>
                                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>In person (Cupertino)</span>
                                    </Text>
                                    <Text style={{ margin: 0 }}>
                                      <span style={{ color: "rgb(0, 102, 204)", fontSize: "14px" }}>Sign up now</span>
                                    </Text>
                                  </Column>
                                </Row>
                              </Section>

                              <Section style={{ margin: "8px 0 0 0" }}>
                                <Row>
                                  <Column style={{ padding: "0 0 0 0" }}>
                                    <Text style={{ margin: 0 }}>
                                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>October 23</span>
                                    </Text>
                                    <Text style={{ margin: 0 }}>
                                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>Online</span>
                                    </Text>
                                    <Text style={{ margin: 0 }}>
                                      <span style={{ color: "rgb(0, 102, 204)", fontSize: "14px" }}>Sign up now</span>
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
                </Column>
              </Row>
            </Section>
          </Column>
        </Row>
      </Section>

      <Section style={{
        margin: "20px 0 0px 0",
        backgroundColor: "#ffffff"
      }}>
        <Row>
          <Column align="left" style={{
            width: "100%",
            paddingLeft: "0",
            paddingRight: "0",
            verticalAlign: "top"
          }}>
            <Section style={{ margin: "0px 0 0px 0" }}>
              <Row>
                <Column style={{ padding: "0px 40px 0px 40px" }}>
                  <Text style={{ textAlign: "center", margin: 0 }}>
                    <span style={{ color: "rgb(110, 110, 115)", fontSize: "12px" }}>
                      Copyright Your Company 2025 Inc. One Company Way, MS 923-4DEV, City, State 95014
                    </span>
                  </Text>
                </Column>
              </Row>
            </Section>
          </Column>
        </Row>
      </Section>

      <Section style={{ margin: "6px 0 0px 0" }}>
        <Row>
          <Column align="center">
            <Row style={{ display: "table-cell" }}>
              <Column style={{ paddingRight: "16px" }}>
                <Link href="#">
                  <Text style={{ margin: 0 }}>
                    <span style={{ color: "rgb(66, 66, 69)", fontSize: "12px" }}>All Rights Reserved</span>
                  </Text>
                </Link>
              </Column>
              <Column style={{ paddingRight: "16px" }}>
                <Link href="#">
                  <Text style={{ margin: 0 }}>
                    <span style={{ color: "rgb(66, 66, 69)", fontSize: "12px" }}>Privacy Policy</span>
                  </Text>
                </Link>
              </Column>
              <Column>
                <Link href="#">
                  <Text style={{ margin: 0 }}>
                    <span style={{ color: "rgb(66, 66, 69)", fontSize: "12px" }}>Account</span>
                  </Text>
                </Link>
              </Column>
            </Row>
          </Column>
        </Row>
      </Section>

      <Section style={{ margin: "6px 0 0px 0" }}>
        <Row>
          <Column style={{ padding: "0px 40px 0px 40px" }}>
            <Text style={{ textAlign: "center", margin: 0 }}>
              <span style={{ color: "rgb(110, 110, 115)", fontSize: "12px" }}>
                You can{' '}
              </span>
              <Link href="#">
                <span style={{ color: "rgb(134, 134, 139)", fontSize: "12px" }}>
                  update your email preferences
                </span>
              </Link>
              <span style={{ color: "rgb(110, 110, 115)", fontSize: "12px" }}>
                {' '}or{' '}
              </span>
              <Link href="#">
                <span style={{ color: "rgb(134, 134, 139)", fontSize: "12px" }}>
                  unsubscribe
                </span>
              </Link>
              <span style={{ color: "rgb(110, 110, 115)", fontSize: "12px" }}>.</span>
            </Text>
          </Column>
        </Row>
      </Section>
    </>
  );
}

