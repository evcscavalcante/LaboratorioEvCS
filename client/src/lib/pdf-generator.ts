// PDF generation utilities using browser's print functionality
// This approach is more reliable than external libraries for production use

/**
 * Generate PDF for Density In Situ test
 */
export function generateDensityInSituPDF(data: any, calculations: any): void {
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
      <title>Relatório de Densidade In Situ</title>
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
        <h2>Relatório de Densidade In Situ</h2>
        <p>Conforme ABNT NBR 6457 e NBR 9813</p>
        <p>Data de geração: ${new Date().toLocaleString('pt-BR')}</p>
      </div>

      <div class="section">
        <div class="section-title">Informações Gerais</div>
        <div class="info-grid">
          <div class="info-item"><span class="label">Registro:</span> <span class="value">${data.registrationNumber}</span></div>
          <div class="info-item"><span class="label">Data:</span> <span class="value">${data.date}</span></div>
          <div class="info-item"><span class="label">Hora:</span> <span class="value">${data.time}</span></div>
          <div class="info-item"><span class="label">Operador:</span> <span class="value">${data.operator}</span></div>
          <div class="info-item"><span class="label">Responsável Técnico:</span> <span class="value">${data.technicalResponsible}</span></div>
          <div class="info-item"><span class="label">Material:</span> <span class="value">${data.material}</span></div>
          <div class="info-item"><span class="label">Origem:</span> <span class="value">${data.origin}</span></div>
          <div class="info-item"><span class="label">Coordenadas:</span> <span class="value">${data.coordinates}</span></div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Densidade In Situ - Determinações</div>
        <table>
          <tr>
            <th>Campo</th>
            <th>Det 1</th>
            <th>Det 2</th>
          </tr>
          <tr>
            <td>Cilindro Nº</td>
            <td>${data.det1.cylinderNumber}</td>
            <td>${data.det2.cylinderNumber}</td>
          </tr>
          <tr>
            <td>Molde + Solo (g)</td>
            <td>${data.det1.moldeSolo.toFixed(2)}</td>
            <td>${data.det2.moldeSolo.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Molde (g)</td>
            <td>${data.det1.molde.toFixed(2)}</td>
            <td>${data.det2.molde.toFixed(2)}</td>
          </tr>
          <tr class="calculated">
            <td>Solo (g)</td>
            <td>${calculations.det1.soil.toFixed(2)}</td>
            <td>${calculations.det2.soil.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Volume (cm³)</td>
            <td>${data.det1.volume.toFixed(2)}</td>
            <td>${data.det2.volume.toFixed(2)}</td>
          </tr>
          <tr class="calculated">
            <td>γnat úmido (g/cm³)</td>
            <td>${calculations.det1.gammaNatWet.toFixed(3)}</td>
            <td>${calculations.det2.gammaNatWet.toFixed(3)}</td>
          </tr>
          <tr class="calculated">
            <td>γnat seco (g/cm³)</td>
            <td>${calculations.det1.gammaNatDry.toFixed(3)}</td>
            <td>${calculations.det2.gammaNatDry.toFixed(3)}</td>
          </tr>
        </table>
      </div>

      <div class="section">
        <div class="section-title">Teor de Umidade</div>
        <p><strong>Umidade Média Topo:</strong> ${calculations.moistureTop.average.toFixed(2)}%</p>
        <p><strong>Umidade Média Base:</strong> ${calculations.moistureBase.average.toFixed(2)}%</p>
      </div>

      <div class="section">
        <div class="section-title">Resultados Finais</div>
        <div class="results">
          <p><strong>γd Topo:</strong> ${calculations.results.gammaDTop.toFixed(3)} g/cm³</p>
          <p><strong>γd Base:</strong> ${calculations.results.gammaDBase.toFixed(3)} g/cm³</p>
          <p><strong>Índice de Vazios (e):</strong> ${calculations.results.voidIndex.toFixed(3)}</p>
          <p><strong>Compacidade Relativa:</strong> ${calculations.results.relativeCompactness.toFixed(1)}%</p>
          <p><strong>Média γnat seco:</strong> ${calculations.gammaNatDryAvg.toFixed(3)} g/cm³</p>
        </div>
      </div>

      <div class="status ${calculations.results.status}">
        STATUS DO ENSAIO: ${calculations.results.status}
      </div>

      <div class="footer">
        <p>Relatório gerado automaticamente pelo Sistema Laboratório Ev.C.S</p>
        <p>Conforme normas ABNT NBR 6457 e NBR 9813</p>
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
