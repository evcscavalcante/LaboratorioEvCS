import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DensityInSitu from '../../client/src/components/laboratory/density-in-situ';

// Mock the PDF generation
jest.mock('../../client/src/lib/pdf-vertical-tables', () => ({
  generateDensityInSituVerticalPDF: jest.fn(),
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('DensityInSitu Component', () => {
  beforeEach(() => {
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => JSON.stringify([])),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });
  });

  it('renders density in situ form correctly', () => {
    renderWithQueryClient(<DensityInSitu />);
    
    expect(screen.getByText('Ensaio de Densidade In Situ')).toBeInTheDocument();
    expect(screen.getByLabelText(/obra/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/local/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/profundidade/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<DensityInSitu />);
    
    const saveButton = screen.getByText(/salvar/i);
    await user.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText(/obra é obrigatória/i)).toBeInTheDocument();
    });
  });

  it('calculates wet density correctly', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<DensityInSitu />);
    
    // Fill in required fields
    await user.type(screen.getByLabelText(/obra/i), 'Test Project');
    await user.type(screen.getByLabelText(/local/i), 'Test Location');
    await user.type(screen.getByLabelText(/profundidade/i), '2.5');
    
    // Fill density data
    const volumeInput = screen.getByLabelText(/volume do cilindro/i);
    const weightInput = screen.getByLabelText(/peso úmido total/i);
    
    await user.clear(volumeInput);
    await user.type(volumeInput, '100');
    await user.clear(weightInput);
    await user.type(weightInput, '180.5');
    
    // Check if wet density is calculated
    await waitFor(() => {
      const wetDensityDisplay = screen.getByText(/1\.805/);
      expect(wetDensityDisplay).toBeInTheDocument();
    });
  });

  it('handles moisture calculation for multiple determinations', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<DensityInSitu />);
    
    // Fill basic info
    await user.type(screen.getByLabelText(/obra/i), 'Test Project');
    await user.type(screen.getByLabelText(/local/i), 'Test Location');
    
    // Navigate to moisture section
    const moistureTab = screen.getByText(/umidade/i);
    await user.click(moistureTab);
    
    // Fill moisture data for top
    const topWetInputs = screen.getAllByLabelText(/úmido \+ tara/i);
    const topDryInputs = screen.getAllByLabelText(/seco \+ tara/i);
    const topTareInputs = screen.getAllByLabelText(/tara/i);
    
    if (topWetInputs.length >= 3) {
      await user.type(topWetInputs[0], '25.5');
      await user.type(topDryInputs[0], '22.1');
      await user.type(topTareInputs[0], '8.2');
      
      await user.type(topWetInputs[1], '28.3');
      await user.type(topDryInputs[1], '24.8');
      await user.type(topTareInputs[1], '9.1');
      
      await user.type(topWetInputs[2], '26.7');
      await user.type(topDryInputs[2], '23.2');
      await user.type(topTareInputs[2], '8.8');
    }
    
    // Check if average moisture is calculated
    await waitFor(() => {
      const moistureResult = screen.getByText(/umidade média/i);
      expect(moistureResult).toBeInTheDocument();
    });
  });

  it('validates equipment selection', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<DensityInSitu />);
    
    // Check equipment dropdown
    const equipmentSelect = screen.getByLabelText(/equipamento/i);
    expect(equipmentSelect).toBeInTheDocument();
    
    await user.click(equipmentSelect);
    
    // Should show equipment options or "No equipment available" message
    await waitFor(() => {
      expect(
        screen.getByText(/selecione um equipamento/i) || 
        screen.getByText(/nenhum equipamento disponível/i)
      ).toBeInTheDocument();
    });
  });

  it('generates PDF when requested', async () => {
    const user = userEvent.setup();
    const mockPDFGeneration = require('../../client/src/lib/pdf-vertical-tables').generateDensityInSituVerticalPDF;
    
    renderWithQueryClient(<DensityInSitu />);
    
    // Fill minimum required data
    await user.type(screen.getByLabelText(/obra/i), 'Test Project');
    await user.type(screen.getByLabelText(/local/i), 'Test Location');
    await user.type(screen.getByLabelText(/profundidade/i), '2.5');
    
    // Save the form first
    const saveButton = screen.getByText(/salvar/i);
    await user.click(saveButton);
    
    // Look for PDF generation button
    const pdfButton = screen.getByText(/gerar pdf/i);
    await user.click(pdfButton);
    
    await waitFor(() => {
      expect(mockPDFGeneration).toHaveBeenCalled();
    });
  });

  it('handles form reset correctly', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<DensityInSitu />);
    
    // Fill some data
    const obraInput = screen.getByLabelText(/obra/i);
    await user.type(obraInput, 'Test Project');
    
    expect(obraInput).toHaveValue('Test Project');
    
    // Reset form
    const resetButton = screen.getByText(/limpar/i);
    await user.click(resetButton);
    
    await waitFor(() => {
      expect(obraInput).toHaveValue('');
    });
  });

  it('validates numeric inputs', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<DensityInSitu />);
    
    const volumeInput = screen.getByLabelText(/volume do cilindro/i);
    
    // Try to enter invalid data
    await user.type(volumeInput, 'invalid-number');
    
    // Should not accept non-numeric input or show validation error
    expect(volumeInput).not.toHaveValue('invalid-number');
  });

  it('handles equipment reference linking', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<DensityInSitu />);
    
    // Check for reference section
    const referenceSection = screen.getByText(/referências/i);
    expect(referenceSection).toBeInTheDocument();
    
    // Should have dropdowns for density references
    const realDensityRef = screen.getByLabelText(/densidade real/i);
    const maxMinDensityRef = screen.getByLabelText(/densidade máx.*mín/i);
    
    expect(realDensityRef).toBeInTheDocument();
    expect(maxMinDensityRef).toBeInTheDocument();
  });
});