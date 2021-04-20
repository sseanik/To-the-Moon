import { Row } from "react-bootstrap";

const Footer: React.FC = () => {
  return (
    <Row className="bg-dark fixed-bottom justify-content-center py-1 footer">
      <p className="text-light my-1">
        © 2021 To The Moon | All Rights Reserved
      </p>
    </Row>
  );
};

export default Footer;
