const createSheet = (workbook, sheetName) => {
    const worksheet = workbook.addWorksheet(sheetName);
  
    worksheet.columns = [
      { header: "ID", key: "ID", width: 50 },
      { header: "FullName", key: "fname", width: 30 },
      { header: "Address", key: "address", width: 40 }, 
      { header: "Role", key: "role", width: 20 },
      { header: "Remaining DaysOff", key: "RemainingDaysOff", width: 20 },
      { header: "DaysOff Taken", key: "DaysOffTaken", width: 20 },
      { header: "List DayOff", key: "ListDayOff", width: 30 },
    ];
  
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: '000000' } }; 
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF00FF00' }, 
      };
      cell.alignment = { horizontal: 'center' }; 
    });
  
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) { 
        row.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFCCFFCC' }, 
          };
        });
      }
    });
  
    return worksheet;
  };
  
export default createSheet;