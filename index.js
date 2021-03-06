const xlsx = require('xlsx-populate');

var day = 0;
var dishPrice = {};
var clients = {};
var earned = 0;
var inStock = {};
var profit = 0;
var toBuy = {};
var orders = [];
//posição do prato com as posições das peças e suas respectivas quantidades para tal prato
var dishes = [['A2', {
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
var minStock = {
    'Salmão':'F2'
    ,'Arroz':'F3'
    ,'Folhas Nori':'F4'
    ,'Água':'F5'
    ,'Açúcar':'F6'
    ,'Sal':'F7'
    ,'Vinagre de Arroz':'F8'
    ,'Shoyu':'F9'
    ,'Gengibre':'F10'
    ,'Cream Cheese':'F11'
    ,'Cebolinha':'F12'
    ,'Ovo':'F13'};;
var pieceComposition = [['A2', {
    'C1':'C2'
    ,'D1':'D2'
    ,'E1':'E2'
    ,'F1':'F2'
    ,'G1':'G2'
    ,'H1':'H2'
    ,'I1':'I2'
    ,'J1':'J2'
    ,'K1':'K2'
    ,'L1':'L2'
    ,'M1':'M2'
    ,'N1':'N2'
    }],
 ['A3', {
    'C1':'C3'
    ,'D1':'D3'
    ,'E1':'E3'
    ,'F1':'F3'
    ,'G1':'G3'
    ,'H1':'H3'
    ,'I1':'I3'
    ,'J1':'J3'
    ,'K1':'K3'
    ,'L1':'L3'
    ,'M1':'M3'
    ,'N1':'N3'
    }],
 ['A4', {
    'C1':'C4'
    ,'D1':'D4'
    ,'E1':'E4'
    ,'F1':'F4'
    ,'G1':'G4'
    ,'H1':'H4'
    ,'I1':'I4'
    ,'J1':'J4'
    ,'K1':'K4'
    ,'L1':'L4'
    ,'M1':'M4'
    ,'N1':'N4'
    }],
 ['A5', {
    'C1':'C5'
    ,'D1':'D5'
    ,'E1':'E5'
    ,'F1':'F5'
    ,'G1':'G5'
    ,'H1':'H5'
    ,'I1':'I5'
    ,'J1':'J5'
    ,'K1':'K5'
    ,'L1':'L5'
    ,'M1':'M5'
    ,'N1':'N5'
    }],];
// Load an existing workbook

var setupAmbient = () => {
    day = day + 1;
    clients = {};
    console.log('----------------------------------------------------------------');
    console.log('');
    console.log('Day: ' + day);
    console.log('Ganho: ' + earned + ' | ' + 'Lucro: ' + profit);
    console.log('');
    console.log('----------------------------------------------------------------');
    orders.forEach(element => {
        if(element.day == day){
            updateStock(element.dict);
        }else{
            console.log('nothing to buy');
        }
    });
    xlsx.fromFileAsync("./spreadsheets/GP.xlsx")
    .then(workbook => {
        console.log('setting the things up before oppening');
        const products = workbook.sheet("Products");
        const stock = workbook.sheet("Stock");
        const composition = workbook.sheet("Composition");
        //Ingredients in stock
        inStock = {
            'Salmão':'C2'
            ,'Arroz':'C3'
            ,'Folhas Nori':'C4'
            ,'Água':'C5'
            ,'Açúcar':'C6'
            ,'Sal':'C7'
            ,'Vinagre de Arroz':'C8'
            ,'Shoyu':'C9'
            ,'Gengibre':'C10'
            ,'Cream Cheese':'C11'
            ,'Cebolinha':'C12'
            ,'Ovo':'C13'};
        //test if stock has the minimum required
        if(day >= 2){
            toBuy = {};
            for(key in inStock){
                if(stock.cell(inStock[key]).value() <= stock.cell(minStock[key]).value()){
                    toBuy[key] = stock.cell(minStock[key]).value() * 4;
                    console.log("Precisa Repor: " + JSON.stringify(JSON.parse(JSON.stringify(toBuy))));
                    console.log(toBuy)
                    orders.push({
                        "day": day + 1,
                        "dict": toBuy
                    });
                    //"dict": JSON.parse(JSON.stringify(toBuy))
                }
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
        console.log('pieces of sushi loaded');
        piecePrice = {};
        
        pieceComposition.forEach(element => {
            name = element[0];
            sum = 0;
            for(key in element[1]){
                for(i in prices){
                    if(stock.cell(i).value() == composition.cell(key).value()){
                        sum = sum + (composition.cell(element[1][key]).value() * prices[i]);
                    }
                }
            }
            piecePrice[name] = parseFloat(sum.toPrecision(3));
        });
        console.log('sushi prices set');
    //Calcular o preço do prato
     dishes.forEach(element => {
         dishPrice[element[0]] = 0;
         for(key in element[1]){
             if(products.cell(key).value() == 'Sushi de Salmão'){
                 dishPrice[element[0]] = dishPrice[element[0]] + (piecePrice['A2'] * products.cell(element[1][key]).value());
             }if(products.cell(key).value() == 'Sashimi de Salmão'){
                 dishPrice[element[0]] = dishPrice[element[0]] + (piecePrice['A3'] * products.cell(element[1][key]).value());
             }if(products.cell(key).value() == 'Sushi Philadélfia'){
                 dishPrice[element[0]] = dishPrice[element[0]] + (piecePrice['A4'] * products.cell(element[1][key]).value());
             }if(products.cell(key).value() == 'Hot Philadélfia'){
                 dishPrice[element[0]] = dishPrice[element[0]] + (piecePrice['A5'] * products.cell(element[1][key]).value());
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

var updateStock = (products) => {
    console.log(products);
    xlsx.fromFileAsync("./spreadsheets/GP.xlsx")
    .then(workbook => {
        const stock = workbook.sheet("Stock");
        for(key in products){
            stock.cell(key).value(products[key]);
        }
        return workbook.toFileAsync("./spreadsheets/GP.xlsx");
    }); 
};

var randomDish = () => {
    rand = Math.floor(Math.random()*getDicLength(dishPrice));
    i = 0
    for(key in dishPrice){
        if(i == rand){
            console.log('Prato: ' + key);
            return key;
        }else{
            i++;
        }
    }
};

var getDish = (position) =>{
    xlsx.fromFileAsync("./spreadsheets/GP.xlsx")
    .then(workbook => {
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
    xlsx.fromFileAsync("./spreadsheets/GP.xlsx")
    .then(workbook => {
        const products = workbook.sheet("Products");
        const stock = workbook.sheet("Stock");
        const composition = workbook.sheet("Composition");
        dish = clients[client];
        piecePortion = {};
        dishes.forEach(element => {
            if(element[0] == dish){
                for(key in element[1]){
                    piecePortion[products.cell(key).value()] = products.cell(element[1][key]).value();
                }
            }
        });
        //para cada peçaIngrediente
        pieceComposition.forEach(element => {
            //para cada porção
            for(key in piecePortion){
                //se a peça estiver contida no prato
                if(composition.cell(element[0]).value() == key){
                    //então para cada ingrediente
                    for(ingredient in element[1]){
                        //recupera o valor atual na tabela
                        value = stock.cell(inStock[composition.cell(ingredient).value()]).value();
                        //calcula o novo valor
                        newValue = value - (composition.cell(element[1][ingredient]).value() * piecePortion[key]);
                        newValue = parseFloat(newValue.toPrecision(3));
                        //atualiza a tabela
                        stock.cell(inStock[composition.cell(ingredient).value()]).value(newValue);
                    }
                }
            }            
        });
        return workbook.toFileAsync("./spreadsheets/GP.xlsx");
    });
}

function newClient(){
    newId = getDicLength(clients) + 1;
    if(newId < 100){
        dish = randomDish();
        clients[newId] = dish
        console.log('New client arrived. Total of clients: ' + (newId));
        consumption(newId);
        earned = earned + (dishPrice[dish] + dishPrice[dish] * 0.4);
        earned = parseFloat(earned.toPrecision(3));
        profit = profit + dishPrice[dish] * 0.4;
        profit = parseFloat(profit.toPrecision(3));
        console.log('Ganho: ' + earned + ' | ' + 'Lucro: ' + profit);
    }
}

var reception = () =>{
    setInterval(newClient, 1000);
};

setupAmbient();
setInterval(setupAmbient, 33000)


