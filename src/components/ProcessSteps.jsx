import React from 'react';
import './ProcessSteps.css';

const ProcessSteps = () => {
  const steps = [
    {
      number: 1,
      title: 'Submit your design',
      description: 'Answer some questions to define a mockup',
    },
    {
      number: 2,
      title: 'Approval & production',
      description: "We'll finalize your design and create the nails",
    },
    {
      number: 3,
      title: 'Receive your nails',
      description: 'The finished nails will be shipped to you',
    },
  ];

  return (
    <section className="process-steps">
      <div className="steps-container">
        {steps.map((step) => (
          <div key={step.number} className="step">
            <div className="step-number">{step.number}</div>
            <div className="step-content">
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProcessSteps;
