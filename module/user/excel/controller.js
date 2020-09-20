const Excel = require('exceljs');
const { sendResponse } = require('../../../lib/utils')
const fs = require('fs');

/**
 * Create Excel
 */
module.exports.createExcel = async function (req, res, next) {

    try {
        let data = req.body;
        let workbook =  new Excel.Workbook();
        let worksheet = workbook.addWorksheet('Debtors');

        worksheet.columns = [
            {header: 'First Name', key: 'firstName'},
            {header: 'Last Name', key: 'lastName'},
            {header: 'Purchase Price', key: 'purchasePrice'},
            {header: 'Payments Made', key: 'paymentsMade'},
            {header: 'Amount Remaining', key: 'amountRemaining'},
            {header: '% Remaining', key: 'percentRemaining'}
        ];
        
        worksheet.columns.forEach(column => {
            console.log(column.header.length)
        column.width = column.header.length < 12 ? 12 : column.header.length + 5
        })

        worksheet.getRow(1).font = {bold: true};

        data.forEach((e, index) => {
            // row 1 is the header.
            const rowIndex = index + 2
          
            // By using destructuring we can easily dump all of the data into the row without doing much
            // We can add formulas pretty easily by providing the formula property.
            worksheet.addRow({
              ...e,
              amountRemaining: {
                formula: `=C${rowIndex}-D${rowIndex}`
              },
              percentRemaining: {
                formula: `=E${rowIndex}/C${rowIndex}`
              }
            })
        });

        // Set the way columns C - F are formatted
        const figureColumns = [3, 4, 5, 6]
        figureColumns.forEach((i) => {
        worksheet.getColumn(i).numFmt = '$0.00'
        worksheet.getColumn(i).alignment = {horizontal: 'center'}
        })

        // Column F needs to be formatted as a percentage.
        worksheet.getColumn(6).numFmt = '0.00%'

        // loop through all of the rows and set the outline style.
        worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
            worksheet.getCell(`A${rowNumber}`).border = {
            top: {style: 'thin'},
            left: {style: 'thin'},
            bottom: {style: 'thin'},
            right: {style: 'none'}
            }
        
            const insideColumns = ['B', 'C', 'D', 'E']
            insideColumns.forEach((v) => {
            worksheet.getCell(`${v}${rowNumber}`).border = {
                top: {style: 'thin'},
                bottom: {style: 'thin'},
                left: {style: 'none'},
                right: {style: 'none'}
            }
            })
        
            worksheet.getCell(`F${rowNumber}`).border = {
            top: {style: 'thin'},
            left: {style: 'none'},
            bottom: {style: 'thin'},
            right: {style: 'thin'}
            }
        });

        // Keep in mind that reading and writing is promise based.
        let a = await workbook.xlsx.writeFile('Debtors.xlsx');
        let binary = await fs.readFileSync('Debtors.xlsx');

        let base = binary.toString('base64');
        await fs.writeFile('abcd.xlsx', base, {encoding : 'base64'}, function(err){
            if(err){
                console.log(91, err);
            } else {
                console.log('created')
            }
        })

        let buff = new Buffer(base, 'base64');
        let text = buff.toString('ascii');

        // .then((dat) => {
        //     let binary = fs.readFileSync('Debtors.xlsx');
        //     let base = new Buffer(binary).toString('base64');
        //     console.log("done", base)
        //     sendResponse(res, false, 200, 3001, text);
        // }).catch(err => {
        //     console.log(err);
        //     sendResponse(res, false, 200, 3000)
        // })
  

        // let a = await new Excel.stream.xlsx.WorkbookWriter(req.body)
    //    console.log(a)
       
    } catch (error) {
        console.log('error in writing :', error);
    }
}

// module.export = {
//     createExcel
// }