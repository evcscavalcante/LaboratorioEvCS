import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  
  autoTable(doc, {
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
  
  autoTable(doc, {
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
  
  autoTable(doc, {
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
  
  autoTable(doc, {
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
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Por favor, permita pop-ups para gerar o PDF');
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Relatório de Densidade Real dos Grãos</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #1976D2; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { color: #1976D2; margin: 0; }
        .header h2 { color: #666; margin: 5px 0; font-weight: normal; }
        .section { margin: 20px 0; }
        .section-title { background: #1976D2; color: white; padding: 10px; margin: 15px 0 10px 0; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 10px 0; }
        .info-item { padding: 5px; border-bottom: 1px solid #eee; }
        .label { font-weight: bold; color: #555; }
        .value { color: #333; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
        th { background: #f5f5f5; font-weight: bold; }
        .calculated { background: #e3f2fd; }
        .results { background: #f9f9f9; padding: 15px; border-left: 4px solid #1976D2; }
        .status { padding: 10px; text-align: center; font-weight: bold; margin: 20px 0; }
        .status.APROVADO { background: #4CAF50; color: white; }
        .status.REPROVADO { background: #F44336; color: white; }
        .status.AGUARDANDO { background: #FF9800; color: white; }
        .approval-criteria { background: #fff3cd; padding: 10px; border-left: 4px solid #ffc107; margin: 10px 0; }
        .footer { margin-top: 40px; font-size: 12px; text-align: center; color: #666; }
        @media print { .no-print { display: none; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🧪 Laboratório Ev.C.S</h1>
        <h2>Relatório de Densidade Real dos Grãos</h2>
        <p>Determinação por Picnometria - ABNT NBR 6457</p>
        <p>Data de geração: ${new Date().toLocaleString('pt-BR')}</p>
      </div>

      <div class="section">
        <div class="section-title">Informações Gerais</div>
        <div class="info-grid">
          <div class="info-item"><span class="label">Registro:</span> <span class="value">${data.registrationNumber}</span></div>
          <div class="info-item"><span class="label">Data:</span> <span class="value">${data.date}</span></div>
          <div class="info-item"><span class="label">Operador:</span> <span class="value">${data.operator}</span></div>
          <div class="info-item"><span class="label">Material:</span> <span class="value">${data.material}</span></div>
          <div class="info-item"><span class="label">Origem:</span> <span class="value">${data.origin}</span></div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Teor de Umidade</div>
        <p><strong>Umidade Média:</strong> ${calculations.moisture.average.toFixed(2)}%</p>
      </div>

      <div class="section">
        <div class="section-title">Picnômetro - Determinações</div>
        <table>
          <tr>
            <th>Campo</th>
            <th>Det 1</th>
            <th>Det 2</th>
          </tr>
          <tr>
            <td>Massa do Picnômetro (g)</td>
            <td>${data.picnometer1.massaPicnometro.toFixed(2)}</td>
            <td>${data.picnometer2.massaPicnometro.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Massa Pic + Amostra + Água (g)</td>
            <td>${data.picnometer1.massaPicAmostraAgua.toFixed(2)}</td>
            <td>${data.picnometer2.massaPicAmostraAgua.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Massa Pic + Água (g)</td>
            <td>${data.picnometer1.massaPicAgua.toFixed(2)}</td>
            <td>${data.picnometer2.massaPicAgua.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Temperatura (°C)</td>
            <td>${data.picnometer1.temperatura.toFixed(1)}</td>
            <td>${data.picnometer2.temperatura.toFixed(1)}</td>
          </tr>
          <tr class="calculated">
            <td>Densidade da Água (g/cm³)</td>
            <td>${calculations.picnometer.det1.waterDensity.toFixed(5)}</td>
            <td>${calculations.picnometer.det2.waterDensity.toFixed(5)}</td>
          </tr>
          <tr>
            <td>Massa Solo Úmido (g)</td>
            <td>${data.picnometer1.massaSoloUmido.toFixed(2)}</td>
            <td>${data.picnometer2.massaSoloUmido.toFixed(2)}</td>
          </tr>
          <tr class="calculated">
            <td>Massa Solo Seco (g)</td>
            <td>${calculations.picnometer.det1.dryWeight.toFixed(2)}</td>
            <td>${calculations.picnometer.det2.dryWeight.toFixed(2)}</td>
          </tr>
          <tr class="calculated">
            <td><strong>Densidade Real (g/cm³)</strong></td>
            <td><strong>${calculations.picnometer.det1.realDensity.toFixed(3)}</strong></td>
            <td><strong>${calculations.picnometer.det2.realDensity.toFixed(3)}</strong></td>
          </tr>
        </table>
      </div>

      <div class="section">
        <div class="section-title">Resultados Finais</div>
        <div class="results">
          <p><strong>Densidade Real Média:</strong> ${calculations.results.average.toFixed(3)} g/cm³</p>
          <p><strong>Diferença entre Determinações:</strong> ${calculations.results.difference.toFixed(3)} g/cm³</p>
        </div>
        
        <div class="approval-criteria">
          <p><strong>Critério de Aprovação:</strong> Diferença ≤ 0.02 g/cm³</p>
          <p><em>Conforme normas ABNT para ensaios de densidade real</em></p>
        </div>
      </div>

      <div class="status ${calculations.results.status}">
        STATUS DO ENSAIO: ${calculations.results.status}
      </div>

      <div class="footer">
        <p>Relatório gerado automaticamente pelo Sistema Laboratório Ev.C.S</p>
        <p>Conforme norma ABNT NBR 6457</p>
      </div>

      <div class="no-print" style="text-align: center; margin: 20px;">
        <button onclick="window.print()" style="padding: 10px 20px; background: #1976D2; color: white; border: none; border-radius: 5px; cursor: pointer;">Imprimir PDF</button>
        <button onclick="window.close()" style="padding: 10px 20px; background: #666; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">Fechar</button>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}

/**
 * Generate PDF for Max/Min Density test
 */
export function generateMaxMinDensityPDF(data: any, calculations: any): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Por favor, permita pop-ups para gerar o PDF');
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Relatório de Densidade Máxima e Mínima</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #1976D2; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { color: #1976D2; margin: 0; }
        .header h2 { color: #666; margin: 5px 0; font-weight: normal; }
        .section { margin: 20px 0; }
        .section-title { background: #1976D2; color: white; padding: 10px; margin: 15px 0 10px 0; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 10px 0; }
        .info-item { padding: 5px; border-bottom: 1px solid #eee; }
        .label { font-weight: bold; color: #555; }
        .value { color: #333; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
        th { background: #f5f5f5; font-weight: bold; }
        .calculated { background: #e3f2fd; }
        .results { background: #f9f9f9; padding: 15px; border-left: 4px solid #1976D2; }
        .status { padding: 10px; text-align: center; font-weight: bold; margin: 20px 0; }
        .status.APROVADO { background: #4CAF50; color: white; }
        .status.REPROVADO { background: #F44336; color: white; }
        .status.AGUARDANDO { background: #FF9800; color: white; }
        .footer { margin-top: 40px; font-size: 12px; text-align: center; color: #666; }
        @media print { .no-print { display: none; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🧪 Laboratório Ev.C.S</h1>
        <h2>Relatório de Densidade Máxima e Mínima</h2>
        <p>Determinação dos Índices de Vazios - ABNT NBR 9813</p>
        <p>Data de geração: ${new Date().toLocaleString('pt-BR')}</p>
      </div>

      <div class="section">
        <div class="section-title">Informações Gerais</div>
        <div class="info-grid">
          <div class="info-item"><span class="label">Registro:</span> <span class="value">${data.registrationNumber}</span></div>
          <div class="info-item"><span class="label">Data:</span> <span class="value">${data.date}</span></div>
          <div class="info-item"><span class="label">Operador:</span> <span class="value">${data.operator}</span></div>
          <div class="info-item"><span class="label">Material:</span> <span class="value">${data.material}</span></div>
          <div class="info-item"><span class="label">Origem:</span> <span class="value">${data.origin}</span></div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Densidade Máxima</div>
        <table>
          <tr>
            <th>Campo</th>
            <th>Det 1</th>
            <th>Det 2</th>
            <th>Det 3</th>
          </tr>
          <tr>
            <td>Molde + Solo (g)</td>
            <td>${data.maxDensity1.moldeSolo.toFixed(2)}</td>
            <td>${data.maxDensity2.moldeSolo.toFixed(2)}</td>
            <td>${data.maxDensity3.moldeSolo.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Molde (g)</td>
            <td>${data.maxDensity1.molde.toFixed(2)}</td>
            <td>${data.maxDensity2.molde.toFixed(2)}</td>
            <td>${data.maxDensity3.molde.toFixed(2)}</td>
          </tr>
          <tr class="calculated">
            <td>Solo (g)</td>
            <td>${calculations.maxDensity.det1.soil.toFixed(2)}</td>
            <td>${calculations.maxDensity.det2.soil.toFixed(2)}</td>
            <td>${calculations.maxDensity.det3.soil.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Volume (cm³)</td>
            <td>${data.maxDensity1.volume.toFixed(2)}</td>
            <td>${data.maxDensity2.volume.toFixed(2)}</td>
            <td>${data.maxDensity3.volume.toFixed(2)}</td>
          </tr>
          <tr class="calculated">
            <td><strong>γd (g/cm³)</strong></td>
            <td><strong>${calculations.maxDensity.det1.gammaDMax.toFixed(3)}</strong></td>
            <td><strong>${calculations.maxDensity.det2.gammaDMax.toFixed(3)}</strong></td>
            <td><strong>${calculations.maxDensity.det3.gammaDMax.toFixed(3)}</strong></td>
          </tr>
        </table>
        <p><strong>γdmax Média:</strong> ${calculations.maxDensity.average.toFixed(3)} g/cm³</p>
      </div>

      <div class="section">
        <div class="section-title">Densidade Mínima</div>
        <table>
          <tr>
            <th>Campo</th>
            <th>Det 1</th>
            <th>Det 2</th>
            <th>Det 3</th>
          </tr>
          <tr>
            <td>Molde + Solo (g)</td>
            <td>${data.minDensity1.moldeSolo.toFixed(2)}</td>
            <td>${data.minDensity2.moldeSolo.toFixed(2)}</td>
            <td>${data.minDensity3.moldeSolo.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Molde (g)</td>
            <td>${data.minDensity1.molde.toFixed(2)}</td>
            <td>${data.minDensity2.molde.toFixed(2)}</td>
            <td>${data.minDensity3.molde.toFixed(2)}</td>
          </tr>
          <tr class="calculated">
            <td>Solo (g)</td>
            <td>${calculations.minDensity.det1.soil.toFixed(2)}</td>
            <td>${calculations.minDensity.det2.soil.toFixed(2)}</td>
            <td>${calculations.minDensity.det3.soil.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Volume (cm³)</td>
            <td>${data.minDensity1.volume.toFixed(2)}</td>
            <td>${data.minDensity2.volume.toFixed(2)}</td>
            <td>${data.minDensity3.volume.toFixed(2)}</td>
          </tr>
          <tr class="calculated">
            <td><strong>γd (g/cm³)</strong></td>
            <td><strong>${calculations.minDensity.det1.gammaDMin.toFixed(3)}</strong></td>
            <td><strong>${calculations.minDensity.det2.gammaDMin.toFixed(3)}</strong></td>
            <td><strong>${calculations.minDensity.det3.gammaDMin.toFixed(3)}</strong></td>
          </tr>
        </table>
        <p><strong>γdmin Média:</strong> ${calculations.minDensity.average.toFixed(3)} g/cm³</p>
      </div>

      <div class="section">
        <div class="section-title">Resultados Finais</div>
        <div class="results">
          <p><strong>γdmax:</strong> ${calculations.results.gammaDMax.toFixed(3)} g/cm³</p>
          <p><strong>γdmin:</strong> ${calculations.results.gammaDMin.toFixed(3)} g/cm³</p>
          <p><strong>emax:</strong> ${calculations.results.emax.toFixed(3)}</p>
          <p><strong>emin:</strong> ${calculations.results.emin.toFixed(3)}</p>
        </div>
      </div>

      <div class="status ${calculations.results.status}">
        STATUS DO ENSAIO: ${calculations.results.status}
      </div>

      <div class="footer">
        <p>Relatório gerado automaticamente pelo Sistema Laboratório Ev.C.S</p>
        <p>Conforme norma ABNT NBR 9813</p>
      </div>

      <div class="no-print" style="text-align: center; margin: 20px;">
        <button onclick="window.print()" style="padding: 10px 20px; background: #1976D2; color: white; border: none; border-radius: 5px; cursor: pointer;">Imprimir PDF</button>
        <button onclick="window.close()" style="padding: 10px 20px; background: #666; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">Fechar</button>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
