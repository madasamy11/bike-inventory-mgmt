import * as XLSX from 'xlsx';

/**
 * Export bikes data to Excel file
 * @param {Array} bikes - Array of bike objects from the API
 * @param {string} filename - Name of the file to download (default: 'bike-inventory-backup.xlsx')
 */
export const exportBikesToExcel = (bikes, filename = 'bike-inventory-backup.xlsx') => {
  try {
    // Handle empty data
    if (!bikes || bikes.length === 0) {
      throw new Error('No data available to export');
    }

    // Format data for Excel - flatten the bike objects
    const formattedData = bikes.map(bike => ({
      'ID': bike._id || '',
      'Brand': bike.brand || '',
      'Model': bike.model || '',
      'License Plate': bike.licensePlate || '',
      'Year': bike.year || '',
      'Price': bike.price || '',
      'Condition': bike.condition || '',
      'Status': bike.status || '',
      'Images': Array.isArray(bike.images) ? bike.images.join(', ') : '',
      'In Date': bike.inDate ? new Date(bike.inDate).toLocaleDateString() : '',
      'Out Date': bike.outDate ? new Date(bike.outDate).toLocaleDateString() : '',
      'Notes': bike.notes || '',
      'Closed': bike.closed ? 'Yes' : 'No',
      'Created At': bike.createdAt ? new Date(bike.createdAt).toLocaleString() : '',
      'Updated At': bike.updatedAt ? new Date(bike.updatedAt).toLocaleString() : ''
    }));

    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    
    // Convert data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory');
    
    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, filename);
    
    return true;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw error;
  }
};
