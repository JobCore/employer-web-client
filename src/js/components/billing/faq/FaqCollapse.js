import React from 'react';
import { Card, CardBody } from 'reactstrap';
import Loader from './Loader';
import Header from '../billing/Header';
import Accordions from '../billing/accordion/Accordions';
import useFakeFetch from './useFakeFetch';
import pricingFaqs from './data-pricing';

const FaqCollapse = () => {
  const { loading: loadingFaq, data: faqs } = useFakeFetch(pricingFaqs);

  return (
      <Card>
          <Header title="Frequently asked questions" className="text-center" titleTag="h4" light={false} />
          <CardBody className="bg-light">
              {loadingFaq ? (
                  <Loader />
        ) : (
            <Accordions items={faqs} titleKey="question" descriptionKey="answer" isOpenKey="open" />
        )}
          </CardBody>
      </Card>
  );
};

export default FaqCollapse;
