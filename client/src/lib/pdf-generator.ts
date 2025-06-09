/**
 * Canvas-based report generator for high-quality technical reports
 * Generates professional laboratory reports as downloadable images
 */

/**
 * Generate report for Density In Situ test
 */
export async function generateDensityInSituPDF(data: any, calculations: any): Promise<void> {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');
    
    canvas.width = 800;
    canvas.height = 1000;
    
    // White background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Header
    ctx.fillStyle = '#1976D2';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Laboratório Ev.C.S', canvas.width / 2, 50);
    
    ctx.fillStyle = '#666666';
    ctx.font = '20px Arial';
    ctx.fillText('Relatório de Densidade In Situ', canvas.width / 2, 80);
    
    ctx.fillStyle = '#000000';
    ctx.font = '14px Arial';
    ctx.fillText('Determinação da Densidade Natural - ABNT NBR 9813', canvas.width / 2, 105);
    ctx.fillText(`Data de geração: ${new Date().toLocaleString('pt-BR')}`, canvas.width / 2, 125);
    
    // Information section
    ctx.textAlign = 'left';
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#1976D2';
    let y = 170;
    ctx.fillText('Informações Gerais', 50, y);
    
    y += 10;
    ctx.strokeStyle = '#E0E0E0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(50, y);
    ctx.lineTo(750, y);
    ctx.stroke();
    
    y += 25;
    ctx.font = '12px Arial';
    ctx.fillStyle = '#000000';
    ctx.fillText(`Registro: ${data.registrationNumber}`, 50, y);
    ctx.fillText(`Data: ${data.date}`, 400, y);
    y += 20;
    ctx.fillText(`Operador: ${data.operator}`, 50, y);
    ctx.fillText(`Material: ${data.material}`, 400, y);
    y += 20;
    ctx.fillText(`Origem: ${data.origin || 'N/A'}`, 50, y);
    ctx.fillText(`Coordenadas: ${data.coordinates || 'N/A'}`, 400, y);
    
    // Density determinations table
    y += 40;
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#1976D2';
    ctx.fillText('Determinações de Densidade', 50, y);
    
    y += 10;
    ctx.strokeStyle = '#E0E0E0';
    ctx.beginPath();
    ctx.moveTo(50, y);
    ctx.lineTo(750, y);
    ctx.stroke();
    
    y += 25;
    
    // Table header
    ctx.fillStyle = '#F5F5F5';
    ctx.fillRect(50, y - 15, 700, 25);
    ctx.strokeStyle = '#CCCCCC';
    ctx.strokeRect(50, y - 15, 700, 25);
    
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 12px Arial';
    ctx.fillText('Campo', 70, y);
    ctx.fillText('Det 1', 300, y);
    ctx.fillText('Det 2', 550, y);
    
    y += 25;
    
    // Table rows
    const tableData = [
      ['Molde + Solo (g)', data.det1?.moldeSolo?.toFixed(2) || '0.00', data.det2?.moldeSolo?.toFixed(2) || '0.00'],
      ['Molde (g)', data.det1?.molde?.toFixed(2) || '0.00', data.det2?.molde?.toFixed(2) || '0.00'],
      ['Solo (g)', calculations.det1?.soil?.toFixed(2) || '0.00', calculations.det2?.soil?.toFixed(2) || '0.00'],
      ['Volume (cm³)', data.det1?.volume?.toFixed(2) || '0.00', data.det2?.volume?.toFixed(2) || '0.00'],
      ['γnat úmido (g/cm³)', calculations.det1?.gammaNatWet?.toFixed(3) || '0.000', calculations.det2?.gammaNatWet?.toFixed(3) || '0.000'],
      ['γnat seco (g/cm³)', calculations.det1?.gammaNatDry?.toFixed(3) || '0.000', calculations.det2?.gammaNatDry?.toFixed(3) || '0.000']
    ];
    
    ctx.font = '11px Arial';
    tableData.forEach((row, index) => {
      const rowY = y + (index * 20);
      
      // Alternate row background
      if (index % 2 === 1) {
        ctx.fillStyle = '#F9F9F9';
        ctx.fillRect(50, rowY - 12, 700, 20);
      }
      
      // Row border
      ctx.strokeStyle = '#EEEEEE';
      ctx.strokeRect(50, rowY - 12, 700, 20);
      
      ctx.fillStyle = '#000000';
      ctx.fillText(row[0], 70, rowY);
      ctx.fillText(row[1], 300, rowY);
      ctx.fillText(row[2], 550, rowY);
    });
    
    y += tableData.length * 20 + 40;
    
    // Results section
    ctx.fillStyle = '#F8F9FA';
    ctx.fillRect(50, y - 20, 700, 150);
    ctx.strokeStyle = '#E0E0E0';
    ctx.strokeRect(50, y - 20, 700, 150);
    
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#1976D2';
    ctx.fillText('Resultados Finais', 70, y);
    
    y += 25;
    ctx.font = '14px Arial';
    ctx.fillStyle = '#000000';
    ctx.fillText(`γd Topo: ${calculations.results?.gammaDTop?.toFixed(3) || '0.000'} g/cm³`, 70, y);
    y += 20;
    ctx.fillText(`γd Base: ${calculations.results?.gammaDBase?.toFixed(3) || '0.000'} g/cm³`, 70, y);
    y += 20;
    ctx.fillText(`Índice de Vazios Topo: ${calculations.results?.voidIndexTop?.toFixed(3) || 'N/A'}`, 70, y);
    y += 20;
    ctx.fillText(`Índice de Vazios Base: ${calculations.results?.voidIndexBase?.toFixed(3) || 'N/A'}`, 70, y);
    y += 20;
    ctx.fillText(`Compacidade Relativa Topo: ${calculations.results?.relativeCompactnessTop?.toFixed(1) || 'N/A'}%`, 70, y);
    y += 20;
    ctx.fillText(`Compacidade Relativa Base: ${calculations.results?.relativeCompactnessBase?.toFixed(1) || 'N/A'}%`, 70, y);
    
    y += 40;
    
    // Status
    const status = calculations.results?.status || 'AGUARDANDO';
    let statusColor = status === 'APROVADO' ? '#4CAF50' : status === 'REPROVADO' ? '#F44336' : '#FF9800';
    
    ctx.fillStyle = statusColor;
    ctx.fillRect(50, y - 20, 700, 40);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`STATUS DO ENSAIO: ${status}`, canvas.width / 2, y);
    
    // Footer
    y = canvas.height - 50;
    ctx.fillStyle = '#666666';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Relatório gerado automaticamente pelo Sistema Laboratório Ev.C.S', canvas.width / 2, y);
    ctx.fillText('Conforme normas ABNT NBR 6457 e NBR 9813', canvas.width / 2, y + 15);
    
    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `densidade-in-situ-${data.registrationNumber || 'relatorio'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    });
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    throw error;
  }
}

/**
 * Generate report for Real Density test
 */
export async function generateRealDensityPDF(data: any, calculations: any): Promise<void> {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');
    
    canvas.width = 800;
    canvas.height = 700;
    
    // White background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Header
    ctx.fillStyle = '#1976D2';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Laboratório Ev.C.S', canvas.width / 2, 50);
    
    ctx.fillStyle = '#666666';
    ctx.font = '20px Arial';
    ctx.fillText('Relatório de Densidade Real dos Grãos', canvas.width / 2, 80);
    
    ctx.fillStyle = '#000000';
    ctx.font = '14px Arial';
    ctx.fillText('Determinação por Picnometria - ABNT NBR 6457', canvas.width / 2, 105);
    ctx.fillText(`Data de geração: ${new Date().toLocaleString('pt-BR')}`, canvas.width / 2, 125);
    
    // Information
    ctx.textAlign = 'left';
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#1976D2';
    let y = 170;
    ctx.fillText('Informações Gerais', 50, y);
    
    y += 10;
    ctx.strokeStyle = '#E0E0E0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(50, y);
    ctx.lineTo(750, y);
    ctx.stroke();
    
    y += 25;
    ctx.font = '12px Arial';
    ctx.fillStyle = '#000000';
    ctx.fillText(`Registro: ${data.registrationNumber}`, 50, y);
    ctx.fillText(`Data: ${data.date}`, 400, y);
    y += 20;
    ctx.fillText(`Operador: ${data.operator}`, 50, y);
    ctx.fillText(`Material: ${data.material}`, 400, y);
    y += 20;
    ctx.fillText(`Origem: ${data.origin || 'N/A'}`, 50, y);
    
    // Moisture content
    y += 40;
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#1976D2';
    ctx.fillText('Teor de Umidade', 50, y);
    
    y += 10;
    ctx.strokeStyle = '#E0E0E0';
    ctx.beginPath();
    ctx.moveTo(50, y);
    ctx.lineTo(750, y);
    ctx.stroke();
    
    y += 25;
    ctx.font = '12px Arial';
    ctx.fillStyle = '#000000';
    ctx.fillText(`Umidade Média: ${calculations.moisture?.average?.toFixed(2) || '0.00'}%`, 50, y);
    
    // Picnometer table
    y += 40;
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#1976D2';
    ctx.fillText('Picnômetro - Determinações', 50, y);
    
    y += 10;
    ctx.strokeStyle = '#E0E0E0';
    ctx.beginPath();
    ctx.moveTo(50, y);
    ctx.lineTo(750, y);
    ctx.stroke();
    
    y += 25;
    
    // Table header
    ctx.fillStyle = '#F5F5F5';
    ctx.fillRect(50, y - 15, 700, 25);
    ctx.strokeStyle = '#CCCCCC';
    ctx.strokeRect(50, y - 15, 700, 25);
    
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 12px Arial';
    ctx.fillText('Campo', 70, y);
    ctx.fillText('Det 1', 350, y);
    ctx.fillText('Det 2', 600, y);
    
    y += 25;
    
    // Table data
    const picData = [
      ['Massa do Picnômetro (g)', data.picnometer1?.massaPicnometro?.toFixed(2) || '0.00', data.picnometer2?.massaPicnometro?.toFixed(2) || '0.00'],
      ['Massa Pic + Amostra + Água (g)', data.picnometer1?.massaPicAmostraAgua?.toFixed(2) || '0.00', data.picnometer2?.massaPicAmostraAgua?.toFixed(2) || '0.00'],
      ['Massa Pic + Água (g)', data.picnometer1?.massaPicAgua?.toFixed(2) || '0.00', data.picnometer2?.massaPicAgua?.toFixed(2) || '0.00'],
      ['Temperatura (°C)', data.picnometer1?.temperatura?.toFixed(1) || '0.0', data.picnometer2?.temperatura?.toFixed(1) || '0.0'],
      ['Massa Solo Úmido (g)', data.picnometer1?.massaSoloUmido?.toFixed(2) || '0.00', data.picnometer2?.massaSoloUmido?.toFixed(2) || '0.00'],
      ['Densidade Real (g/cm³)', calculations.picnometer?.det1?.realDensity?.toFixed(3) || '0.000', calculations.picnometer?.det2?.realDensity?.toFixed(3) || '0.000']
    ];
    
    ctx.font = '11px Arial';
    picData.forEach((row, index) => {
      const rowY = y + (index * 20);
      
      if (index % 2 === 1) {
        ctx.fillStyle = '#F9F9F9';
        ctx.fillRect(50, rowY - 12, 700, 20);
      }
      
      ctx.strokeStyle = '#EEEEEE';
      ctx.strokeRect(50, rowY - 12, 700, 20);
      
      ctx.fillStyle = '#000000';
      ctx.fillText(row[0], 70, rowY);
      ctx.fillText(row[1], 350, rowY);
      ctx.fillText(row[2], 600, rowY);
    });
    
    y += picData.length * 20 + 40;
    
    // Results
    ctx.fillStyle = '#F8F9FA';
    ctx.fillRect(50, y - 20, 700, 120);
    ctx.strokeStyle = '#E0E0E0';
    ctx.strokeRect(50, y - 20, 700, 120);
    
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#1976D2';
    ctx.fillText('Resultados Finais', 70, y);
    
    y += 25;
    ctx.font = '14px Arial';
    ctx.fillStyle = '#000000';
    ctx.fillText(`Densidade Real Média: ${calculations.results?.average?.toFixed(3) || '0.000'} g/cm³`, 70, y);
    y += 20;
    ctx.fillText(`Diferença entre Determinações: ${calculations.results?.difference?.toFixed(3) || '0.000'} g/cm³`, 70, y);
    y += 20;
    ctx.font = '12px Arial';
    ctx.fillStyle = '#666666';
    ctx.fillText('Critério de Aprovação: Diferença ≤ 0.02 g/cm³', 70, y);
    
    y += 30;
    
    // Status
    const status = calculations.results?.status || 'AGUARDANDO';
    let statusColor = status === 'APROVADO' ? '#4CAF50' : status === 'REPROVADO' ? '#F44336' : '#FF9800';
    
    ctx.fillStyle = statusColor;
    ctx.fillRect(50, y - 20, 700, 40);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`STATUS DO ENSAIO: ${status}`, canvas.width / 2, y);
    
    // Footer
    y = canvas.height - 50;
    ctx.fillStyle = '#666666';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Relatório gerado automaticamente pelo Sistema Laboratório Ev.C.S', canvas.width / 2, y);
    ctx.fillText('Conforme norma ABNT NBR 6457', canvas.width / 2, y + 15);
    
    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `densidade-real-${data.registrationNumber || 'relatorio'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    });
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    throw error;
  }
}

/**
 * Generate report for Max/Min Density test
 */
export async function generateMaxMinDensityPDF(data: any, calculations: any): Promise<void> {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');
    
    canvas.width = 800;
    canvas.height = 600;
    
    // White background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Header
    ctx.fillStyle = '#1976D2';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Laboratório Ev.C.S', canvas.width / 2, 50);
    
    ctx.fillStyle = '#666666';
    ctx.font = '20px Arial';
    ctx.fillText('Relatório de Densidade Máxima e Mínima', canvas.width / 2, 80);
    
    ctx.fillStyle = '#000000';
    ctx.font = '14px Arial';
    ctx.fillText('Determinação dos Índices de Vazios - ABNT NBR 9813', canvas.width / 2, 105);
    ctx.fillText(`Data de geração: ${new Date().toLocaleString('pt-BR')}`, canvas.width / 2, 125);
    
    // Information
    ctx.textAlign = 'left';
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#1976D2';
    let y = 170;
    ctx.fillText('Informações Gerais', 50, y);
    
    y += 10;
    ctx.strokeStyle = '#E0E0E0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(50, y);
    ctx.lineTo(750, y);
    ctx.stroke();
    
    y += 25;
    ctx.font = '12px Arial';
    ctx.fillStyle = '#000000';
    ctx.fillText(`Registro: ${data.registrationNumber}`, 50, y);
    ctx.fillText(`Data: ${data.date}`, 400, y);
    y += 20;
    ctx.fillText(`Operador: ${data.operator}`, 50, y);
    ctx.fillText(`Material: ${data.material}`, 400, y);
    y += 20;
    ctx.fillText(`Origem: ${data.origin || 'N/A'}`, 50, y);
    
    // Results
    y += 60;
    ctx.fillStyle = '#F8F9FA';
    ctx.fillRect(50, y - 20, 700, 120);
    ctx.strokeStyle = '#E0E0E0';
    ctx.strokeRect(50, y - 20, 700, 120);
    
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#1976D2';
    ctx.fillText('Resultados Finais', 70, y);
    
    y += 25;
    ctx.font = '14px Arial';
    ctx.fillStyle = '#000000';
    ctx.fillText(`γdmax Média: ${calculations.maxDensity?.average?.toFixed(3) || '0.000'} g/cm³`, 70, y);
    y += 20;
    ctx.fillText(`γdmin Média: ${calculations.minDensity?.average?.toFixed(3) || '0.000'} g/cm³`, 70, y);
    y += 20;
    ctx.fillText(`emax: ${calculations.results?.emax?.toFixed(3) || '0.000'}`, 70, y);
    y += 20;
    ctx.fillText(`emin: ${calculations.results?.emin?.toFixed(3) || '0.000'}`, 70, y);
    
    y += 40;
    
    // Status
    const status = calculations.results?.status || 'AGUARDANDO';
    let statusColor = status === 'APROVADO' ? '#4CAF50' : status === 'REPROVADO' ? '#F44336' : '#FF9800';
    
    ctx.fillStyle = statusColor;
    ctx.fillRect(50, y - 20, 700, 40);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`STATUS DO ENSAIO: ${status}`, canvas.width / 2, y);
    
    // Footer
    y = canvas.height - 50;
    ctx.fillStyle = '#666666';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Relatório gerado automaticamente pelo Sistema Laboratório Ev.C.S', canvas.width / 2, y);
    ctx.fillText('Conforme norma ABNT NBR 9813', canvas.width / 2, y + 15);
    
    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `densidade-max-min-${data.registrationNumber || 'relatorio'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    });
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    throw error;
  }
}