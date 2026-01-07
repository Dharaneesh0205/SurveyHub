export const exportToCSV = (data: any[], filename: string) => {
  const headers = Object.keys(data[0] || {});
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportAnalyticsToPDF = async (surveyTitle: string, analytics: any) => {
  const content = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h1>${surveyTitle} - Analytics Report</h1>
      <p>Total Responses: ${analytics.totalResponses}</p>
      <p>Generated on: ${new Date().toLocaleDateString()}</p>
      
      ${analytics.questions.map((q: any, index: number) => `
        <div style="margin: 20px 0; page-break-inside: avoid;">
          <h3>Q${index + 1}: ${q.questionText}</h3>
          ${q.type === 'multiple-choice' 
            ? Object.entries(q.data).map(([option, count]) => 
                `<p>${option}: ${count} responses</p>`
              ).join('')
            : `<p>${q.data.length} text responses</p>`
          }
        </div>
      `).join('')}
    </div>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  }
};