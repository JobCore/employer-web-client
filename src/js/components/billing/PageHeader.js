import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Card, CardBody, Col, Row } from 'reactstrap';
import Background from './Background';
import corner4 from './corner-4.png';
import createMarkup from './createMarkup';

const PageHeader = ({ title, titleTag: TitleTag, description, image, col, children, ...rest }) => (
    <Card {...rest}>
        <Background
      image={image}
      className="bg-card"
      // style={{  }} // borderTopRightRadius: '0.375rem', borderBottomRightRadius: '0.375rem'
    />
        <CardBody >
            <Row>
                <Col md="auto">
                <div className="loginLogo mt-2">
                  <img
                      className="banner logo mt-2 p-3 "
                      src={
                        "https://res.cloudinary.com/hq02xjols/image/upload/v1626700274/logo1.png"
                      }
                      width={270}
                      
                  />
                  
                </div>
                </Col>
                <Col {...col}>
                    <TitleTag className="mb-0 display-4">{title}</TitleTag>
                    {description && (
                    <h1
              className={classNames('mt-2 font-weight-light', { 'mb-0': !children })}
              dangerouslySetInnerHTML={createMarkup(description)}
            />
          )}
                    {children}
                </Col>
            </Row>
        </CardBody>
    </Card>
);

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  titleTag: PropTypes.string,
  description: PropTypes.string,
  col: PropTypes.shape(Col.propTypes),
  image: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node
};

PageHeader.defaultProps = { col: { lg: 8 }, image: corner4, titleTag: 'h1' };

export default PageHeader;
