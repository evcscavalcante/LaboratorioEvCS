import jsPDF from 'jspdf';
import 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

/**
 * Generate PDF for Density In Situ test
 */
export function generateDensityInSituPDF(data: any, calculations: any): void {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(18);
  doc.setTextColor(25, 118, 210);
  doc.text('Laboratório Ev.C.S', 105, 20, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setTextColor(102, 102, 102);
  doc.text('Relatório de Densidade In Situ', 105, 30, { align: 'center' });
  
  doc.setFontSize(10);
  doc.text('Conforme ABNT NBR 6457 e NBR 9813', 105, 38, { align: 'center' });
  doc.text(`Data de geração: ${new Date().toLocaleString('pt-BR')}`, 105, 44, { align: 'center' });
  
  // General Information
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Informações Gerais', 20, 60);
  
  const generalInfo = [
    ['Registro:', data.registrationNumber || '-'],
    ['Data:', data.date || '-'],
    ['Hora:', data.time || '-'],
    ['Operador:', data.operator || '-'],
    ['Responsável Técnico:', data.technicalResponsible || '-'],
    ['Material:', data.material || '-'],
    ['Origem:', data.origin || '-'],
    ['Coordenadas:', data.coordinates || '-']
  ];
  
  doc.autoTable({
    startY: 65,
    head: [],
    body: generalInfo,
    theme: 'grid',
    styles: { fontSize: 9 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 40 },
      1: { cellWidth: 60 }
    }
  });

  // Density Determinations
  doc.text('Densidade In Situ - Determinações', 20, (doc as any).lastAutoTable.finalY + 15);
  
  const densityData = [
    ['Campo', 'Det 1', 'Det 2'],
    ['Cilindro Nº', data.det1?.cylinderNumber || '-', data.det2?.cylinderNumber || '-'],
    ['Molde + Solo (g)', (data.det1?.moldeSolo || 0).toFixed(2), (data.det2?.moldeSolo || 0).toFixed(2)],
    ['Molde (g)', (data.det1?.molde || 0).toFixed(2), (data.det2?.molde || 0).toFixed(2)],
    ['Solo (g)', calculations.det1.soil.toFixed(2), calculations.det2.soil.toFixed(2)],
    ['Volume (cm³)', (data.det1?.volume || 0).toFixed(2), (data.det2?.volume || 0).toFixed(2)],
    ['γnat úmido (g/cm³)', calculations.det1.gammaNatWet.toFixed(3), calculations.det2.gammaNatWet.toFixed(3)],
    ['γnat seco (g/cm³)', calculations.det1.gammaNatDry.toFixed(3), calculations.det2.gammaNatDry.toFixed(3)]
  ];
  
  doc.autoTable({
    startY: (doc as any).lastAutoTable.finalY + 20,
    head: [densityData[0]],
    body: densityData.slice(1),
    theme: 'striped',
    headStyles: { fillColor: [25, 118, 210] },
    styles: { fontSize: 9, halign: 'center' },
    columnStyles: {
      0: { halign: 'left', fontStyle: 'bold' }
    }
  });

  // Results
  doc.text('Resultados Finais', 20, (doc as any).lastAutoTable.finalY + 15);
  
  const results = [
    ['γd Topo:', `${calculations.results.gammaDTop.toFixed(3)} g/cm³`],
    ['γd Base:', `${calculations.results.gammaDBase.toFixed(3)} g/cm³`],
    ['γd Médio:', `${calculations.gammaNatDryAvg.toFixed(3)} g/cm³`],
    ['Umidade Média Topo:', `${calculations.moistureTop.average.toFixed(2)}%`],
    ['Umidade Média Base:', `${calculations.moistureBase.average.toFixed(2)}%`]
  ];
  
  doc.autoTable({
    startY: (doc as any).lastAutoTable.finalY + 20,
    head: [],
    body: results,
    theme: 'grid',
    styles: { fontSize: 10 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 70 },
      1: { cellWidth: 50 }
    }
  });

  // Detailed Results - Top and Base
  doc.text('Índices de Vazios e Compacidade Relativa', 20, (doc as any).lastAutoTable.finalY + 15);
  
  const detailedResults = [
    ['Parâmetro', 'Topo', 'Base'],
    ['Índice de Vazios (e)', calculations.results.voidIndexTop.toFixed(3), calculations.results.voidIndexBase.toFixed(3)],
    ['Compacidade Relativa (%)', calculations.results.relativeCompactnessTop.toFixed(1), calculations.results.relativeCompactnessBase.toFixed(1)]
  ];
  
  doc.autoTable({
    startY: (doc as any).lastAutoTable.finalY + 20,
    head: [detailedResults[0]],
    body: detailedResults.slice(1),
    theme: 'striped',
    headStyles: { fillColor: [25, 118, 210] },
    styles: { fontSize: 10, halign: 'center' },
    columnStyles: {
      0: { halign: 'left', fontStyle: 'bold', cellWidth: 70 },
      1: { cellWidth: 40 },
      2: { cellWidth: 40 }
    }
  });

  // Status
  const statusColors = {
    'APROVADO': [76, 175, 80],
    'REPROVADO': [244, 67, 54],
    'AGUARDANDO': [255, 152, 0]
  };
  
  const statusColor = statusColors[calculations.results.status as keyof typeof statusColors] || [128, 128, 128];
  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.rect(20, (doc as any).lastAutoTable.finalY + 15, 170, 15, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text(`STATUS DO ENSAIO: ${calculations.results.status}`, 105, (doc as any).lastAutoTable.finalY + 25, { align: 'center' });

  // Footer
  doc.setTextColor(128, 128, 128);
  doc.setFontSize(8);
  doc.text('Relatório gerado automaticamente pelo Sistema Laboratório Ev.C.S', 105, 280, { align: 'center' });
  doc.text('Conforme normas ABNT NBR 6457 e NBR 9813', 105, 286, { align: 'center' });

  // Save PDF
  doc.save(`densidade-in-situ-${data.registrationNumber || 'relatorio'}.pdf`);
}

/**
 * Generate PDF for Real Density test
 */
export function generateRealDensityPDF(data: any, calculations: any): void {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.setTextColor(25, 118, 210);
  doc.text('Laboratório Ev.C.S', 105, 20, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setTextColor(102, 102, 102);
  doc.text('Relatório de Densidade Real dos Grãos', 105, 30, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text('Determinação por Picnometria - ABNT NBR 6457', 105, 40, { align: 'center' });
  doc.text(`Data de geração: ${new Date().toLocaleString('pt-BR')}`, 105, 48, { align: 'center' });

  // General Information
  doc.setFontSize(14);
  doc.setTextColor(25, 118, 210);
  doc.text('Informações Gerais', 20, 65);
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Registro: ${data.registrationNumber}`, 20, 75);
  doc.text(`Data: ${data.date}`, 105, 75);
  doc.text(`Operador: ${data.operator}`, 20, 82);
  doc.text(`Material: ${data.material}`, 105, 82);
  doc.text(`Origem: ${data.origin || 'N/A'}`, 20, 89);

  // Moisture Content
  doc.setFontSize(14);
  doc.setTextColor(25, 118, 210);
  doc.text('Teor de Umidade', 20, 105);
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Umidade Média: ${calculations.moisture.average.toFixed(2)}%`, 20, 115);

  // Picnometer determinations table
  doc.setFontSize(14);
  doc.setTextColor(25, 118, 210);
  doc.text('Picnômetro - Determinações', 20, 130);

  const picnometerData = [
    ['Campo', 'Det 1', 'Det 2'],
    ['Massa do Picnômetro (g)', data.picnometer1.massaPicnometro.toFixed(2), data.picnometer2.massaPicnometro.toFixed(2)],
    ['Massa Pic + Amostra + Água (g)', data.picnometer1.massaPicAmostraAgua.toFixed(2), data.picnometer2.massaPicAmostraAgua.toFixed(2)],
    ['Massa Pic + Água (g)', data.picnometer1.massaPicAgua.toFixed(2), data.picnometer2.massaPicAgua.toFixed(2)],
    ['Temperatura (°C)', data.picnometer1.temperatura.toFixed(1), data.picnometer2.temperatura.toFixed(1)],
    ['Densidade da Água (g/cm³)', calculations.picnometer.det1.waterDensity.toFixed(5), calculations.picnometer.det2.waterDensity.toFixed(5)],
    ['Massa Solo Úmido (g)', data.picnometer1.massaSoloUmido.toFixed(2), data.picnometer2.massaSoloUmido.toFixed(2)],
    ['Massa Solo Seco (g)', calculations.picnometer.det1.dryWeight.toFixed(2), calculations.picnometer.det2.dryWeight.toFixed(2)],
    ['Densidade Real (g/cm³)', calculations.picnometer.det1.realDensity.toFixed(3), calculations.picnometer.det2.realDensity.toFixed(3)]
  ];

  (doc as any).autoTable({
    startY: 140,
    head: [picnometerData[0]],
    body: picnometerData.slice(1),
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [245, 245, 245], textColor: [0, 0, 0] },
    columnStyles: {
      0: { cellWidth: 70 },
      1: { cellWidth: 35, halign: 'center' },
      2: { cellWidth: 35, halign: 'center' }
    },
    didParseCell: function(data: any) {
      if (data.row.index >= 4 && data.row.index <= 7 && data.column.index > 0) {
        data.cell.styles.fillColor = [227, 242, 253];
      }
    }
  });

  // Results
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(14);
  doc.setTextColor(25, 118, 210);
  doc.text('Resultados Finais', 20, finalY);

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Densidade Real Média: ${calculations.results.average.toFixed(3)} g/cm³`, 20, finalY + 15);
  doc.text(`Diferença entre Determinações: ${calculations.results.difference.toFixed(3)} g/cm³`, 20, finalY + 25);

  // Approval criteria
  doc.setFontSize(10);
  doc.setTextColor(102, 102, 102);
  doc.text('Critério de Aprovação: Diferença ≤ 0.02 g/cm³', 20, finalY + 40);
  doc.text('Conforme normas ABNT para ensaios de densidade real', 20, finalY + 47);

  // Status
  const statusY = finalY + 60;
  let statusColor: [number, number, number];
  switch (calculations.results.status) {
    case 'APROVADO':
      statusColor = [76, 175, 80];
      break;
    case 'REPROVADO':
      statusColor = [244, 67, 54];
      break;
    default:
      statusColor = [255, 152, 0];
  }

  doc.setFillColor(...statusColor);
  doc.rect(20, statusY - 5, 170, 15, 'F');
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text(`STATUS DO ENSAIO: ${calculations.results.status}`, 105, statusY + 3, { align: 'center' });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(102, 102, 102);
  doc.text('Relatório gerado automaticamente pelo Sistema Laboratório Ev.C.S', 105, 280, { align: 'center' });
  doc.text('Conforme norma ABNT NBR 6457', 105, 286, { align: 'center' });

  // Save PDF
  doc.save(`densidade-real-${data.registrationNumber || 'relatorio'}.pdf`);
}

/**
 * Generate PDF for Max/Min Density test
 */
export function generateMaxMinDensityPDF(data: any, calculations: any): void {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.setTextColor(25, 118, 210);
  doc.text('Laboratório Ev.C.S', 105, 20, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setTextColor(102, 102, 102);
  doc.text('Relatório de Densidade Máxima e Mínima', 105, 30, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text('Determinação dos Índices de Vazios - ABNT NBR 9813', 105, 40, { align: 'center' });
  doc.text(`Data de geração: ${new Date().toLocaleString('pt-BR')}`, 105, 48, { align: 'center' });

  // General Information
  doc.setFontSize(14);
  doc.setTextColor(25, 118, 210);
  doc.text('Informações Gerais', 20, 65);
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Registro: ${data.registrationNumber}`, 20, 75);
  doc.text(`Data: ${data.date}`, 105, 75);
  doc.text(`Operador: ${data.operator}`, 20, 82);
  doc.text(`Material: ${data.material}`, 105, 82);
  doc.text(`Origem: ${data.origin || 'N/A'}`, 20, 89);

  // Maximum Density Table
  doc.setFontSize(14);
  doc.setTextColor(25, 118, 210);
  doc.text('Densidade Máxima', 20, 105);

  const maxDensityData = [
    ['Campo', 'Det 1', 'Det 2', 'Det 3'],
    ['Molde + Solo (g)', data.maxDensity1.moldeSolo.toFixed(2), data.maxDensity2.moldeSolo.toFixed(2), data.maxDensity3.moldeSolo.toFixed(2)],
    ['Molde (g)', data.maxDensity1.molde.toFixed(2), data.maxDensity2.molde.toFixed(2), data.maxDensity3.molde.toFixed(2)],
    ['Solo (g)', calculations.maxDensity.det1.soil.toFixed(2), calculations.maxDensity.det2.soil.toFixed(2), calculations.maxDensity.det3.soil.toFixed(2)],
    ['Volume (cm³)', data.maxDensity1.volume.toFixed(2), data.maxDensity2.volume.toFixed(2), data.maxDensity3.volume.toFixed(2)],
    ['γd (g/cm³)', calculations.maxDensity.det1.gammaDMax.toFixed(3), calculations.maxDensity.det2.gammaDMax.toFixed(3), calculations.maxDensity.det3.gammaDMax.toFixed(3)]
  ];

  (doc as any).autoTable({
    startY: 115,
    head: [maxDensityData[0]],
    body: maxDensityData.slice(1),
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [245, 245, 245], textColor: [0, 0, 0] },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 30, halign: 'center' },
      3: { cellWidth: 30, halign: 'center' }
    },
    didParseCell: function(data: any) {
      if ((data.row.index === 2 || data.row.index === 5) && data.column.index > 0) {
        data.cell.styles.fillColor = [227, 242, 253];
      }
    }
  });

  let currentY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`γdmax Média: ${calculations.maxDensity.average.toFixed(3)} g/cm³`, 20, currentY);

  // Minimum Density Table
  currentY += 15;
  doc.setFontSize(14);
  doc.setTextColor(25, 118, 210);
  doc.text('Densidade Mínima', 20, currentY);

  const minDensityData = [
    ['Campo', 'Det 1', 'Det 2', 'Det 3'],
    ['Molde + Solo (g)', data.minDensity1.moldeSolo.toFixed(2), data.minDensity2.moldeSolo.toFixed(2), data.minDensity3.moldeSolo.toFixed(2)],
    ['Molde (g)', data.minDensity1.molde.toFixed(2), data.minDensity2.molde.toFixed(2), data.minDensity3.molde.toFixed(2)],
    ['Solo (g)', calculations.minDensity.det1.soil.toFixed(2), calculations.minDensity.det2.soil.toFixed(2), calculations.minDensity.det3.soil.toFixed(2)],
    ['Volume (cm³)', data.minDensity1.volume.toFixed(2), data.minDensity2.volume.toFixed(2), data.minDensity3.volume.toFixed(2)],
    ['γd (g/cm³)', calculations.minDensity.det1.gammaDMin.toFixed(3), calculations.minDensity.det2.gammaDMin.toFixed(3), calculations.minDensity.det3.gammaDMin.toFixed(3)]
  ];

  (doc as any).autoTable({
    startY: currentY + 10,
    head: [minDensityData[0]],
    body: minDensityData.slice(1),
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [245, 245, 245], textColor: [0, 0, 0] },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 30, halign: 'center' },
      3: { cellWidth: 30, halign: 'center' }
    },
    didParseCell: function(data: any) {
      if ((data.row.index === 2 || data.row.index === 5) && data.column.index > 0) {
        data.cell.styles.fillColor = [227, 242, 253];
      }
    }
  });

  currentY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`γdmin Média: ${calculations.minDensity.average.toFixed(3)} g/cm³`, 20, currentY);

  // Results
  currentY += 20;
  doc.setFontSize(14);
  doc.setTextColor(25, 118, 210);
  doc.text('Resultados Finais', 20, currentY);

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`emax: ${calculations.results.emax.toFixed(3)}`, 20, currentY + 15);
  doc.text(`emin: ${calculations.results.emin.toFixed(3)}`, 105, currentY + 15);

  // Status
  currentY += 35;
  let statusColor: [number, number, number];
  switch (calculations.results.status) {
    case 'APROVADO':
      statusColor = [76, 175, 80];
      break;
    case 'REPROVADO':
      statusColor = [244, 67, 54];
      break;
    default:
      statusColor = [255, 152, 0];
  }

  doc.setFillColor(...statusColor);
  doc.rect(20, currentY - 5, 170, 15, 'F');
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text(`STATUS DO ENSAIO: ${calculations.results.status}`, 105, currentY + 3, { align: 'center' });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(102, 102, 102);
  doc.text('Relatório gerado automaticamente pelo Sistema Laboratório Ev.C.S', 105, 280, { align: 'center' });
  doc.text('Conforme norma ABNT NBR 9813', 105, 286, { align: 'center' });

  // Save PDF
  doc.save(`densidade-max-min-${data.registrationNumber || 'relatorio'}.pdf`);
}
