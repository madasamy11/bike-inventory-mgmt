import ExcelJS from 'exceljs';

/**
 * Export bikes data to Excel file
 * @param {Array} bikes - Array of bike objects from the API
 * @param {string} filename - Name of the file to download (default: 'bike-inventory-backup.xlsx')
 */
export const exportBikesToExcel = async (bikes, filename = 'bike-inventory-backup.xlsx') => {
  try {
    // Handle empty data
    if (!bikes || bikes.length === 0) {
      throw new Error('No data available to export');
    }

    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Inventory');

    // Define columns
    worksheet.columns = [
      { header: 'ID', key: '_id', width: 25 },
      { header: 'Brand', key: 'brand', width: 15 },
      { header: 'Model', key: 'model', width: 20 },
      { header: 'License Plate', key: 'licensePlate', width: 15 },
      { header: 'Year', key: 'year', width: 10 },
      { header: 'Price', key: 'price', width: 12 },
      { header: 'Condition', key: 'condition', width: 12 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Images', key: 'images', width: 30 },
      { header: 'In Date', key: 'inDate', width: 15 },
      { header: 'Out Date', key: 'outDate', width: 15 },
      { header: 'Notes', key: 'notes', width: 30 },
      { header: 'Closed', key: 'closed', width: 10 },
      { header: 'Created At', key: 'createdAt', width: 20 },
      { header: 'Updated At', key: 'updatedAt', width: 20 }
    ];

    // Add rows
    bikes.forEach(bike => {
      worksheet.addRow({
        _id: bike._id || '',
        brand: bike.brand || '',
        model: bike.model || '',
        licensePlate: bike.licensePlate || '',
        year: bike.year || '',
        price: bike.price || '',
        condition: bike.condition || '',
        status: bike.status || '',
        images: Array.isArray(bike.images) ? bike.images.join(', ') : (bike.images || ''),
        inDate: bike.inDate ? new Date(bike.inDate).toLocaleDateString() : '',
        outDate: bike.outDate ? new Date(bike.outDate).toLocaleDateString() : '',
        notes: bike.notes || '',
        closed: bike.closed ? 'Yes' : 'No',
        createdAt: bike.createdAt ? new Date(bike.createdAt).toLocaleString() : '',
        updatedAt: bike.updatedAt ? new Date(bike.updatedAt).toLocaleString() : ''
      });
    });

    // Style the header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };

    // Generate Excel file and trigger download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw error;
  }
};
