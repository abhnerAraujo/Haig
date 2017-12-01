import { setTimeout } from 'timers';

const xlsx = require('xlsx-populate');

var day = 1;
var dishPrice = {};
var clients = {};
var clientBill = {};
var inStock = {};
var dishes;
var minStock = {
    'A2':'F2'
    ,'A3':'F3'
    ,'A4':'F4'
    ,'A5':'F5'
    ,'A6':'F6'
    ,'A7':'F7'
    ,'A8':'F8'
    ,'A9':'F9'
    ,'A10':'F10'
    ,'A11':'F11'
    ,'A12':'F12'
    ,'A13':'F13'};
var pieceComposition = [['A2', {
    'C1':'C2'
    ,'D1':'D2'
    ,'E1':'E2'
    ,'F1':'F2'
    ,'G1':'G2'
    ,'H1':'H2'
    ,'I1':'I2'
    ,'J1':'J2'
    ,'K1':'k2'
    ,'L1':'L2'
    ,'M1':'M2'
    ,'N1':'N2'
    }],
 ['A3', {
    'C1':'C2'
    ,'D1':'D2'
    ,'E1':'E2'
    ,'F1':'F2'
    ,'G1':'G2'
    ,'H1':'H2'
    ,'I1':'I2'
    ,'J1':'J2'
    ,'K1':'k2'
    ,'L1':'L2'
    ,'M1':'M2'
    ,'N1':'N2'
    }],
 ['A4', {
    'C1':'C2'
    ,'D1':'D2'
    ,'E1':'E2'
    ,'F1':'F2'
    ,'G1':'G2'
    ,'H1':'H2'
    ,'I1':'I2'
    ,'J1':'J2'
    ,'K1':'k2'
    ,'L1':'L2'
    ,'M1':'M2'
    ,'N1':'N2'
    }],
 ['A5', {
    'C1':'C2'
    ,'D1':'D2'
    ,'E1':'E2'
    ,'F1':'F2'
    ,'G1':'G2'
    ,'H1':'H2'
    ,'I1':'I2'
    ,'J1':'J2'
    ,'K1':'k2'
    ,'L1':'L2'
    ,'M1':'M2'
    ,'N1':'N2'
    }],];
// Load an existing workbook
var setupAmbient = () => {
    xlsx.fromFileAsync("./spreadsheets/GP.xlsx")
    .then(workbook => {
        console.log('setting the things up before oppening');
        const products = workbook.sheet("Products");
        const stock = workbook.sheet("Stock");
        const composition = workbook.sheet("Composition");
        //Ingredients in stock
        inStock = {
            'A2':stock.cell('C2').value()
            ,'A3':stock.cell('C3').value()
            ,'A4':stock.cell('C4').value()
            ,'A5':stock.cell('C5').value()
            ,'A6':stock.cell('C6').value()
            ,'A7':stock.cell('C7').value()
            ,'A8':stock.cell('C8').value()
            ,'A9':stock.cell('C9').value()
            ,'A10':stock.cell('C10').value()
            ,'A11':stock.cell('C11').value()
            ,'A12':stock.cell('C12').value()
            ,'A13':stock.cell('C13').value()};
        //test if stock has the minimum required
        for(key in minStock){
            if(inStock[key] < stock.cell(minStock[key]).value() && day == 5){
                setTimeout(() => {
                    console.log('estoque minimo alcançado')
                }, 5000);
            }
        }
        rowTotal = 1;
        cellTotal = 0;
        //buscar posição do total
        while(composition.row(1).cell(cellTotal).value() != 'Total'){
             cellTotal++;
        }
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
        console.log('all ingredients prices set');
        //Range com a composição de cada peça de sushi
        pieces = composition.range("A2:N5").value();
        console.log('pieces of sushi loaded');
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
        console.log('sushi prices set');
        //posição do prato com as posições das peças e suas respectivas quantidades para tal prato
        dishes = [['A2', {
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
    //Calcular o preço do prato
     dishes.forEach(element => {
         dishPrice[element[0]] = 0;
         for(key in element[1]){
             if(products.cell(key).value() == 'Sushi de Salmão'){
                 dishPrice[element[0]] = dishPrice[element[0]] + (piecePrice['Sushi de Salmão'] * products.cell(element[1][key]).value());
             }if(products.cell(key).value() == 'Sashimi de Salmão'){
                 dishPrice[element[0]] = dishPrice[element[0]] + (piecePrice['Sushi de Salmão'] * products.cell(element[1][key]).value());
             }if(products.cell(key).value() == 'Sushi Philadélfia'){
                 dishPrice[element[0]] = dishPrice[element[0]] + (piecePrice['Sushi de Salmão'] * products.cell(element[1][key]).value());
             }if(products.cell(key).value() == 'Hot Philadélfia'){
                 dishPrice[element[0]] = dishPrice[element[0]] + (piecePrice['Sushi de Salmão'] * products.cell(element[1][key]).value());
             }
         }
     });
     for(key in dishPrice){
         dishPrice[key] = parseFloat(dishPrice[key].toPrecision(4));
     }
     console.log('products ready');
     console.log('setup finished successfully');
     console.log('Openning the doors');
     reception();
    }); 
};

var randomDish = () => {
    rand = Math.floor(Math.random()*Object.keys(dishPrice).length);
    i = 0
    for(key in dishPrice){
        if(i == rand){
            return key;
        }else{
            i++;
        }
    }
};

var getDish = (position) =>{
    xlsx.fromFileAsync("./spreadsheets/GP.xlsx")
    .then(workbook => {
        console.log(1)
        return workbook.sheet('Products').cell(position).value();
    });
};

var getDicLength = (dic) => {
    i = 0;
    for(key in dic){
        i++;
    }
    return i;
}

var consumption = (client) => {
    dish = clients[client];
    pieceComposition.forEach(element => {
        if(element[0] == dish){
            for(key in element[1]){
            }
        }
    });
}

function newClient(){
    clientsLen = getDicLength(clients);
    if(clientsLen < 100){
        dish = randomDish();
        clients[clientsLen + 1] = dish
        console.log('New client arrived. Total of clients: ' + (clientsLen + 1));
    }
}

var reception = () =>{
    setInterval(newClient, Math.floor(Math.random() * 10000) + 1000);
};

setupAmbient();


