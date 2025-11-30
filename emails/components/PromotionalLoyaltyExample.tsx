/**
 * PATTERN: Loyalty Program Promotional Email
 * USE CASE: Seasonal retail campaigns with loyalty/rewards integration - perfect for e-commerce brands with points programs, member-exclusive offers, multi-category product showcases
 * TAGS: promotional, loyalty, rewards, points, retail, seasonal, e-commerce, member, multi-cta, product-grid, back-to-school, campaign
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

export default function LoyaltyPromotionalEmail() {
  return (
    <>
      <Section style={{ margin: "4px 0" }}>
        <Row>
          <Column>
            <Link href="#" style={{ fontSize: "14px", color: "#767677", textDecoration: "underline" }}>
              Refresh your sneaker rotation with new arrivals and more.
            </Link>
          </Column>
          <Column align="right">
            <Link href="#" style={{ fontSize: "14px", color: "#767677", textDecoration: "underline" }}>
              View this email online
            </Link>
          </Column>
        </Row>
      </Section>

      <Section style={{ margin: "24px 0" }}>
        <Row>
          <Column align="center">
            <Img
              src="https://utfs.io/f/96e5f1bb-92de-4c11-9dec-31913e58464d-3r2fxk.png"
              style={{ height: "24px", width: "38px" }}
            />
          </Column>
        </Row>
      </Section>

      <Section style={{
        borderBottom: "1px solid #C6C6C6",
        borderTop: "1px solid #C6C6C6",
        paddingBottom: "13px",
        paddingTop: "16px"
      }}>
        <Row style={{ display: "table-cell", width: "0", whiteSpace: "nowrap" }}>
          <Column style={{ paddingLeft: "16px" }}>
            <Text style={{ margin: 0, fontSize: "16px", fontWeight: "bold", lineHeight: "22px" }}>
              LEVEL 2
            </Text>
          </Column>
        </Row>
        <Row style={{ display: "table-cell", paddingLeft: "24px" }}>
          <Column>
            <Img
              src="https://utfs.io/f/8ac8c0f1-8505-4271-81c2-dfd42c26fcd4-d0heyt.png"
              style={{ height: "17px", width: "17px" }}
            />
          </Column>
          <Column style={{ paddingLeft: "12px" }}>
            <Text style={{ margin: 0, fontSize: "16px", fontWeight: "bold", lineHeight: "22px" }}>
              2760
            </Text>
          </Column>
          <Column style={{ paddingLeft: "24px" }}>
            <Text style={{ margin: 0, fontSize: "16px", lineHeight: "22px" }}>
              Points to spend
            </Text>
          </Column>
        </Row>
        <Row style={{ display: "table-cell", whiteSpace: "nowrap" }}>
          <Column>
            <Text style={{ margin: 0, fontSize: "16px", lineHeight: "22px" }}>JOHN DOE</Text>
          </Column>
          <Column style={{ paddingLeft: "8px" }}>
            <Img
              src="https://utfs.io/f/c233b7db-a129-4be4-9a37-d7f09648a37f-ugjs96.png"
              style={{ height: "24px", width: "24px" }}
            />
          </Column>
        </Row>
      </Section>

      <Section style={{ marginTop: "40px" }}>
        <Row>
          <Img
            src="https://utfs.io/f/e22f4445-aae5-40e9-bc15-58c43b47539c-ctxjej.jpg"
            style={{ height: "600px", width: "100%" }}
          />
        </Row>
      </Section>

      <Section style={{ marginTop: "40px" }}>
        <Row>
          <Text style={{ margin: 0, fontSize: "38px", lineHeight: "38px", letterSpacing: "1px", color: "#111111" }}>
            CLASSROOM CLASSICS
          </Text>
        </Row>
        <Row>
          <Text style={{ marginBottom: 0, marginTop: "40px", fontSize: "16px", lineHeight: "22px", color: "#111111" }}>
            Back to school means it's Samba season—and you can't go wrong with classic sneakers from the 3-Stripes. Or, step up your game with the timeless styles of Gazelle, Spezial, and more iconic staples for your day one fit. The trending looks you'll love for back to school are{' '}
            <Link href="#">available in-store today.*</Link>
          </Text>
        </Row>
        <Row style={{ marginTop: "40px" }}>
          <Column>
            <Button href="#" style={{ backgroundColor: "#111111", padding: "14px 20px" }}>
              <Row>
                <Column>
                  <Text style={{ display: "table-cell", fontSize: "14px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "2px", color: "white", margin: 0 }}>
                    SHOP MEN
                  </Text>
                </Column>
                <Column>
                  <Img
                    src="https://utfs.io/f/1b1e8ec3-156d-42b7-aa53-332333b8ae84-6hsmcs.png"
                    style={{ display: "table-cell", paddingLeft: "12px" }}
                  />
                </Column>
              </Row>
            </Button>
          </Column>
        </Row>
        <Row style={{ marginTop: "16px" }}>
          <Column>
            <Button href="#" style={{ backgroundColor: "#111111", padding: "14px 20px" }}>
              <Row>
                <Column>
                  <Text style={{ display: "table-cell", fontSize: "14px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "2px", color: "white", margin: 0 }}>
                    SHOP WOMEN
                  </Text>
                </Column>
                <Column>
                  <Img
                    src="https://utfs.io/f/1b1e8ec3-156d-42b7-aa53-332333b8ae84-6hsmcs.png"
                    style={{ display: "table-cell", paddingLeft: "12px" }}
                  />
                </Column>
              </Row>
            </Button>
          </Column>
        </Row>
        <Row style={{ marginTop: "16px" }}>
          <Column>
            <Button href="#" style={{ backgroundColor: "#111111", padding: "14px 20px" }}>
              <Row>
                <Column>
                  <Text style={{ display: "table-cell", fontSize: "14px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "2px", color: "white", margin: 0 }}>
                    SHOP KIDS
                  </Text>
                </Column>
                <Column>
                  <Img
                    src="https://utfs.io/f/1b1e8ec3-156d-42b7-aa53-332333b8ae84-6hsmcs.png"
                    style={{ display: "table-cell", paddingLeft: "12px" }}
                  />
                </Column>
              </Row>
            </Button>
          </Column>
        </Row>
      </Section>

      <Section style={{ marginTop: "40px" }}>
        <Row>
          <Column style={{ paddingRight: "14px" }}>
            <Img
              src="https://utfs.io/f/7046af4f-31e2-44c5-9d40-95737b66e836-w2u8m9.png"
              style={{ height: "306px", width: "306px" }}
            />
          </Column>
          <Column style={{ paddingLeft: "14px" }}>
            <Img
              src="https://utfs.io/f/e7b36868-d128-429f-b5c8-078abda58901-qugw1p.jpg"
              style={{ height: "306px", width: "306px" }}
            />
          </Column>
        </Row>
        <Row style={{ marginTop: "40px" }}>
          <Column style={{ paddingRight: "14px" }}>
            <Img
              src="https://utfs.io/f/75071562-2554-4cde-86a9-a443e07cc618-w0n6cg.jpg"
              style={{ height: "306px", width: "306px" }}
            />
          </Column>
          <Column style={{ paddingLeft: "14px" }}>
            <Img
              src="https://utfs.io/f/a64168b2-cd20-4e18-a165-3f3375ff4d89-w2xvhf.jpg"
              style={{ height: "306px", width: "306px" }}
            />
          </Column>
        </Row>
      </Section>

      <Section style={{
        marginTop: "44px",
        borderBottom: "1px solid #C6C6C6",
        borderTop: "1px solid #C6C6C6"
      }}>
        <Row style={{ paddingBottom: "13px", paddingTop: "16px" }}>
          <Column align="center">
            <Link
              href="#"
              style={{
                margin: 0,
                fontSize: "14px",
                fontWeight: "bold",
                textTransform: "uppercase",
                lineHeight: "22px",
                letterSpacing: "2px",
                color: "#111111",
                textDecoration: "none"
              }}
            >
              Stories, styles and sportswear since 1949
            </Link>
          </Column>
        </Row>
      </Section>

      <Section style={{ margin: "40px 0" }}>
        <Row style={{ display: "table-cell", width: "0", whiteSpace: "nowrap" }}>
          <Column align="left">
            <Link style={{ fontSize: "14px", color: "black", textDecoration: "none" }} href="#">
              My Account
            </Link>
          </Column>
        </Row>
        <Row style={{ display: "table-cell", width: "0", whiteSpace: "nowrap", paddingLeft: "16px" }}>
          <Column align="left">
            <Link style={{ fontSize: "14px", color: "black", textDecoration: "none" }} href="#">
              Privacy Statement
            </Link>
          </Column>
        </Row>
        <Row style={{ display: "table-cell", width: "0", whiteSpace: "nowrap", paddingLeft: "16px" }}>
          <Column align="left">
            <Link style={{ fontSize: "14px", color: "black", textDecoration: "none" }} href="#">
              Support
            </Link>
          </Column>
        </Row>
      </Section>

      <Section>
        <Text style={{ margin: 0, fontSize: "14px" }}>
          *Selection and availability may vary by store.
        </Text>
        <Text style={{ marginTop: "24px", fontSize: "14px" }}>
          © 2024 Your Brand, Inc. and the 3-Stripes mark are registered trademarks 5055 N. Greeley Avenue Portland, OR 97217
        </Text>
      </Section>
    </>
  );
}

