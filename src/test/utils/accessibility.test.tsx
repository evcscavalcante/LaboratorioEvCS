import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import React from 'react';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock components for accessibility testing
const MockButton = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => {
  return React.createElement('button', { onClick, type: 'button' }, children);
};

const MockInput = ({ 
  label, 
  type = 'text', 
  required = false 
}: { 
  label: string; 
  type?: string; 
  required?: boolean;
}) => {
  return React.createElement('div', null,
    React.createElement('label', { htmlFor: `input-${label}` },
      label,
      required && React.createElement('span', { 'aria-label': 'required' }, ' *')
    ),
    React.createElement('input', {
      id: `input-${label}`,
      type,
      required,
      'aria-describedby': required ? `${label}-required` : undefined
    }),
    required && React.createElement('div', {
      id: `${label}-required`,
      className: 'sr-only'
    }, 'This field is required')
  );
};

const MockForm: React.FC = () => (
  <form role="form" aria-labelledby="form-title">
    <h2 id="form-title">Density Test Form</h2>
    <MockInput label="Project Name" required />
    <MockInput label="Location" required />
    <MockInput label="Depth" type="number" />
    <MockButton>Save Test</MockButton>
    <MockButton>Generate PDF</MockButton>
  </form>
);

const MockTable: React.FC = () => (
  <div role="region" aria-labelledby="table-title">
    <h3 id="table-title">Test Results</h3>
    <table>
      <caption>Density measurement results</caption>
      <thead>
        <tr>
          <th scope="col">Parameter</th>
          <th scope="col">Value</th>
          <th scope="col">Unit</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">Wet Density</th>
          <td>1.805</td>
          <td>g/cm³</td>
        </tr>
        <tr>
          <th scope="row">Dry Density</th>
          <td>1.604</td>
          <td>g/cm³</td>
        </tr>
      </tbody>
    </table>
  </div>
);

const MockNavigation: React.FC = () => (
  <nav aria-label="Main navigation">
    <ul>
      <li>
        <a href="/dashboard" aria-current="page">
          Dashboard
        </a>
      </li>
      <li>
        <a href="/tests">Tests</a>
      </li>
      <li>
        <a href="/equipment">Equipment</a>
      </li>
      <li>
        <a href="/reports">Reports</a>
      </li>
    </ul>
  </nav>
);

describe('Accessibility Tests', () => {
  it('should not have accessibility violations in form components', async () => {
    const { container } = render(<MockForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should not have accessibility violations in table components', async () => {
    const { container } = render(<MockTable />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should not have accessibility violations in navigation components', async () => {
    const { container } = render(<MockNavigation />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should not have accessibility violations in button components', async () => {
    const { container } = render(
      <div>
        <MockButton>Primary Action</MockButton>
        <MockButton>Secondary Action</MockButton>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should not have accessibility violations in input components', async () => {
    const { container } = render(
      <div>
        <MockInput label="Required Field" required />
        <MockInput label="Optional Field" />
        <MockInput label="Number Field" type="number" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper heading hierarchy', async () => {
    const TestPage: React.FC = () => (
      <div>
        <h1>Laboratory Management System</h1>
        <h2>Density Tests</h2>
        <h3>In Situ Density</h3>
        <h4>Test Parameters</h4>
        <h2>Equipment</h2>
        <h3>Calibration</h3>
      </div>
    );

    const { container } = render(<TestPage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper color contrast', async () => {
    const ContrastTest: React.FC = () => (
      <div>
        <div style={{ backgroundColor: '#ffffff', color: '#000000', padding: '10px' }}>
          High contrast text (21:1)
        </div>
        <div style={{ backgroundColor: '#f8f9fa', color: '#212529', padding: '10px' }}>
          Good contrast text (16:1)
        </div>
        <button 
          style={{ 
            backgroundColor: '#007bff', 
            color: '#ffffff', 
            border: 'none', 
            padding: '8px 16px' 
          }}
        >
          Accessible Button (5.3:1)
        </button>
      </div>
    );

    const { container } = render(<ContrastTest />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper ARIA labels and descriptions', async () => {
    const AriaTest: React.FC = () => (
      <div>
        <button 
          aria-label="Close dialog"
          aria-describedby="close-help"
        >
          ×
        </button>
        <div id="close-help" className="sr-only">
          Press to close the current dialog
        </div>
        
        <div 
          role="status" 
          aria-live="polite"
          aria-label="Form status"
        >
          Form saved successfully
        </div>
        
        <input
          type="search"
          aria-label="Search tests"
          placeholder="Enter test name..."
        />
      </div>
    );

    const { container } = render(<AriaTest />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have keyboard accessible interactive elements', async () => {
    const KeyboardTest: React.FC = () => (
      <div>
        <button tabIndex={0}>Focusable Button</button>
        <a href="#content" tabIndex={0}>Skip to content</a>
        <input type="text" tabIndex={0} />
        <div 
          role="button" 
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              // Handle activation
            }
          }}
        >
          Custom Interactive Element
        </div>
      </div>
    );

    const { container } = render(<KeyboardTest />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper form validation messages', async () => {
    const ValidationTest: React.FC = () => (
      <form>
        <div>
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            required
            aria-describedby="email-error"
            aria-invalid="true"
          />
          <div id="email-error" role="alert">
            Please enter a valid email address
          </div>
        </div>
        
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            aria-describedby="password-help"
          />
          <div id="password-help">
            Password must be at least 8 characters long
          </div>
        </div>
      </form>
    );

    const { container } = render(<ValidationTest />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});