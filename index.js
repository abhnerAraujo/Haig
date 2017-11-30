const xlsx = require('xlsx-populate');

// Load an existing workbook
xlsx.fromFileAsync("./spreadsheets/GP.xlsx")
   .then(workbook => {
       // Modify the workbook.
       const products = workbook.sheet("Products");
       const stock = workbook.sheet("Stock");
       const composition = workbook.sheet("Composition");

       rowTotal = 1;
       cellTotal = 0;
       //buscar posição do total
       while(composition.row(1).cell(cellTotal).value() != 'Total'){
            cellTotal++;
       }
       row = 2
       prices = {
           'A2':stock.cell('D2').value()
           ,'A3':stock.cell('D3').value()
           ,'A4':stock.cell('D4').value()
           ,'A5':stock.cell('D5').value()
           ,'A6':stock.cell('D6').value()
           ,'A7':stock.cell('D7').value()
           ,'A8':stock.cell('D8').value()
           ,'A9':stock.cell('D9').value()
           ,'A10':stock.cell('D10').value()
           ,'A11':stock.cell('D11').value()
           ,'A12':stock.cell('D12').value()
           ,'A13':stock.cell('D13').value()}
       //Range com a composição de cada peça de sushi
       pieces = composition.range("A2:N5").value();
       piecePrice = {};
       //Itera sobre cada linha de peça de sushi
       pieces.forEach(element => {
        //recupera o nome do sushi   
        name = element[0];
        //recupera a porção
        portion = element[1];
        sum = 0
        //itera sobre as quantidades
           for(i = 2; i < element.length - 1; i++){
                sum = sum + (prices['A'+i] * element[i]);
           };
           piecePrice[name] = parseFloat(sum.toPrecision(3));
       });
       console.log(piecePrice);

       pratos = [['A2', {
           'B1':'B2'
           ,'C1':'C2'
           ,'D1':'D2'
           ,'E1':'E2'
           }],
        ['A3', {
           'B1':'B3'
           ,'C1':'C3'
           ,'D1':'D3'
           ,'E1':'E3'
           }],
        ['A4', {
           'B1':'B4'
           ,'C1':'C4'
           ,'D1':'D4'
           ,'E1':'E4'
           }],
        ['A5', {
           'B1':'B5'
           ,'C1':'C5'
           ,'D1':'D5'
           ,'E1':'E5'
           }],];
    console.log(pratos);
    pratoPrice = {};
    pratos.forEach(element => {
        pratoPrice[element[0]] = 0;
        for(key in element[1]){
            if(products.cell(key).value() == 'Sushi de Salmão'){
                pratoPrice[element[0]] = pratoPrice[element[0]] + (piecePrice['Sushi de Salmão'] * products.cell(element[1][key]).value());
            }if(products.cell(key).value() == 'Sashimi de Salmão'){
                pratoPrice[element[0]] = pratoPrice[element[0]] + (piecePrice['Sushi de Salmão'] * products.cell(element[1][key]).value());
            }if(products.cell(key).value() == 'Sushi Philadélfia'){
                pratoPrice[element[0]] = pratoPrice[element[0]] + (piecePrice['Sushi de Salmão'] * products.cell(element[1][key]).value());
            }if(products.cell(key).value() == 'Hot Philadélfia'){
                pratoPrice[element[0]] = pratoPrice[element[0]] + (piecePrice['Sushi de Salmão'] * products.cell(element[1][key]).value());
            }
        }
    });
    for(key in pratoPrice){
        pratoPrice[key] = parseFloat(pratoPrice[key].toPrecision(4));
    }
    console.log(pratoPrice);
   });

