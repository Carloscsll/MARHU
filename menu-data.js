/* =========================================================================
   MARHU SUSHI BAR — DATOS DEL MENÚ
   -------------------------------------------------------------------------
   Aquí se editan precios, platillos y fotos. No hace falta tocar nada más.

   Cada platillo acepta:
     n      Nombre
     p      Precio (número). Si no tiene precio, omítelo o pon null
     pt     Texto a mostrar en lugar del precio (ej. "Precio de mercado")
     d      Descripción (opcional)
     img    Foto (opcional) → ej. "img/amazon.jpg"
     t      Íconos (opcional): "picante", "picante2", "fresco", "tempura", "horno"
     v      Variantes con precio distinto: [["Camarón",150],["Pulpo",180]]
     o      Opciones al mismo precio: ["Corona","Victoria","Pacífico"]

   Para agregar una foto: copia el archivo a la carpeta /img y escribe
   img: "img/nombre-del-archivo.jpg" en el platillo.
   ========================================================================= */

window.MARHU_CONFIG = {
  // Número de WhatsApp del negocio: código de país + número, solo dígitos.
  // México: 52 + 10 dígitos. Ejemplo: "5216671234567" o "526671234567"
  whatsapp: "524759581306",
  nombre: "MARHU Sushi Bar",
};

window.MARHU_MENU = [
  /* ============================ COCINA ============================ */
  {
    id: "cocina", titulo: "Cocina", grupos: [
      {
        id: "entradas", titulo: "Entradas", items: [
          { n: "Camarones a la cucaracha", p: 200 },
          { n: "Chicharrón de pescado", p: 150 },
          { n: "Carpaccio de salmón", p: 220, d: "Extracto de cáscara de limón en chiltepín, apio, cebolla morada, vinagreta" },
          { n: "Carpaccio de atún", p: 220, d: "Chile crunchy garlic, apio, cebolla morada y vinagreta" },
          { n: "Mejillones", p: 280, t: ["picante2"], img: "img/mejillones.jpg" },
          { n: "Salmón en salsa chipotle", p: 280 },
          { n: "Atún al mojo diabla", p: 300, t: ["picante2"] },
          { n: "Yakimeshi especial", p: 170, d: "Yakimeshi con tampico, camarón tempura, queso crema y aguacate" },
          { n: "Bola de arroz", p: 60 },
          { n: "Tuna tartar", p: 180 },
        ]
      },
      {
        id: "ensaladas", titulo: "Ensaladas", items: [
          { n: "House salad", p: 100, d: "Sin proteína" },
          { n: "Ensalada de atún", p: 180 },
          { n: "Ensalada de salmón", p: 180 },
          { n: "Ensalada de pollo", p: 150 },
        ]
      },
      {
        id: "tostadas", titulo: "Tostadas", nota: "Masago, cebollín, japanese mayo", items: [
          { n: "Tostada de atún", p: 120 },
          { n: "Tostada de atún a la pimienta", p: 120 },
          { n: "Tostada de salmón", p: 120 },
          { n: "Tostada de pulpo", p: 120 },
        ]
      },
      {
        id: "ceviches", titulo: "Ceviches", items: [
          { n: "Ceviche regular", p: 70 },
          { n: "Ceviche en salsas negras", p: 120 },
          { n: "Coctel camarón / pulpo", v: [["Camarón", 150], ["Pulpo", 180]] },
          { n: "Aguachile verde", p: 160, t: ["picante2"] },
          { n: "Aguachile en salsas negras", p: 200, t: ["picante"], img: "img/aguachile-negras.png" },
        ]
      },
      {
        id: "camarones", titulo: "Camarones",
        nota: "Acompañados con yakimeshi, ensalada, aderezo de miso y proteína al gusto", items: [
          { n: "Camarones a la diabla", p: 215, t: ["picante2"] },
          { n: "Camarones al mojo de ajo", p: 200 },
          { n: "Camarones a la mantequilla", p: 200, img: "img/camarones-mantequilla.jpg" },
          { n: "Camarones empanizados", p: 220 },
          { n: "Camarones a la plancha", p: 190 },
          { n: "Camarones en salsa cilantro", p: 190 },
          { n: "Camarones a la momia", p: 260 },
        ]
      },
      {
        id: "filetes", titulo: "Filetes",
        nota: "Acompañados con yakimeshi, ensalada, aderezo de miso y proteína al gusto", items: [
          { n: "Filete a la diabla", p: 200, t: ["picante2"] },
          { n: "Filete al mojo de ajo", p: 180 },
          { n: "Filete a la mantequilla", p: 180 },
          { n: "Filete empanizado", p: 200 },
          { n: "Filete a la plancha", p: 170 },
          { n: "Filete en salsa cilantro", p: 180 },
        ]
      },
      {
        id: "caldos", titulo: "Caldos", items: [
          { n: "Caldo de camarón", p: 250 },
          { n: "Caldo de pulpo", p: 280 },
          { n: "Vuelve a la vida", p: 280 },
        ]
      },
      {
        id: "carnes", titulo: "Carnes", items: [
          { n: "Ribeye (300 g aprox)", p: 320 },
          { n: "Plancha de arrachera (300 g aprox)", p: 280 },
          { n: "Mar y tierra", p: 350, img: "img/mar-y-tierra.jpg" },
          { n: "Huachinango frito", pt: "Precio de mercado" },
        ]
      },
      {
        id: "ninos", titulo: "Menú de niños", items: [
          { n: "Chicken nuggets con papas", p: 80 },
          { n: "Dedos de queso (4 pzs)", p: 70 },
          { n: "Camarones tempura (5 pzs)", p: 100 },
        ]
      },
      {
        id: "postres", titulo: "Postres", items: [
          { n: "Oreo tempura", p: 180, img: "img/oreo-tempura.jpg" },
          { n: "Gelatina de café", p: 110, d: "Base de 3 leches y nieve de vainilla" },
          { n: "Fried ice cream", p: 160 },
          { n: "Cheesecake tempura", p: 150 },
        ]
      },
    ]
  },

  /* ============================ SUSHI ============================ */
  {
    id: "sushi", titulo: "Sushi", leyenda: true, grupos: [
      {
        id: "especiales", titulo: "Especiales", items: [
          { n: "Amazon", p: 170, t: ["fresco"], d: "Atún fresco, queso crema, aguacate, kani kama picante, pasta coreana, salsa de anguila" },
          { n: "China", p: 170, t: ["fresco", "picante"], d: "Camarón tempura, aguacate, salmón fresco, atún picante, pasta coreana, salsa de anguila, mayonesa japonesa" },
          { n: "Angry Dragon", p: 170, t: ["picante2"], d: "Masago, salmón, cilantro, serrano, salsa ponzu" },
          { n: "Chicken roll", p: 170, d: "Pollo tempura, queso, aguacate, salsa de anguila, pasta coreana, mayonesa picante" },
          { n: "Charly", p: 180, t: ["fresco", "picante"], d: "Pescado blanco tempura, aguacate, queso crema, salmón picante, salsa de anguila, pasta coreana, mayonesa picante" },
          { n: "Don Burro", p: 170, t: ["tempura"], d: "Masago, salmón, atún, aguacate, tempura frito, salsa de anguila, pasta coreana, mayonesa japonesa" },
          { n: "La Madrina", p: 180, t: ["tempura"], d: "Salmón fresco, camarón tempura, queso crema, aguacate, tempura frito, salsa de anguila" },
          { n: "El Profesor", p: 160, t: ["fresco"], d: "Camarón tempura, pepino, kani kama, pasta coreana, mayonesa japonesa", img: "img/profesor.jpg" },
          { n: "Millenium", p: 170, t: ["fresco", "picante"], d: "Atún picante, atún a la pimienta, aguacate, salsa ponzu, aceite de ajonjolí" },
          { n: "Mandilón", p: 180, t: ["horno"], d: "Camarón tempura, queso crema, kani kama, mayonesa picante, al horno" },
          { n: "Don Viagra", p: 190, t: ["horno"], d: "Salmón, queso crema, callo de hacha, mayonesa picante, al horno" },
          { n: "Caterpillar", p: 200, t: ["fresco"], d: "Unagui, aguacate, camarón", img: "img/caterpillar.jpg" },
          { n: "Lady roll", p: 190, t: ["fresco"], d: "Spicy kani kama, aguacate, salmón, salsa ponzu" },
          { n: "Tampico roll", p: 200, t: ["fresco"], d: "Ensalada tampico, cubos de atún, pasta coreana, cebollín, salsa de anguila" },
        ]
      },
      {
        id: "temakis", titulo: "Temakis",
        nota: "Cono de alga nori relleno de arroz, pepino, queso crema, aguacate y proteína a elección", items: [
          { n: "Temaki shrimp tempura", p: 90 },
          { n: "Temaki California", p: 90 },
          { n: "Temaki Philadelphia", p: 90 },
          { n: "Temaki veggie", p: 70 },
          { n: "Temaki salmón", p: 90 },
          { n: "Temaki atún", p: 90 },
          { n: "Temaki callo de hacha", p: 105 },
          { n: "Temaki unagui", p: 105 },
        ]
      },
      {
        id: "makis", titulo: "Makis", items: [
          { n: "Maki camarón tempura", p: 110, d: "Camarón tempura, pepino, masago, mayonesa japonesa" },
          { n: "Maki California kani kama", p: 110, d: "Kani kama, pepino, aguacate, ajonjolí" },
          { n: "Maki Philadelphia", p: 110, d: "Salmón, aguacate, queso crema, ajonjolí" },
          { n: "Tuna roll", d: "Solo tuna", v: [["Regular", 90], ["Picante", 110]] },
          { n: "Maki salmón", d: "Solo salmón", v: [["Regular", 90], ["Picante", 110]] },
        ]
      },
      {
        id: "nigiri", titulo: "Nigiri", unidad: "Precio por pieza", foto: "img/nigiri-maguro-sake.jpg", items: [
          { n: "Nigiri maguro", d: "Atún", p: 60 },
          { n: "Nigiri sake", d: "Salmón", p: 60 },
          { n: "Nigiri unagui", d: "Anguila", p: 75 },
          { n: "Nigiri ebi", d: "Camarón", p: 50 },
          { n: "Nigiri kaibashira", d: "Callo de hacha", p: 60 },
          { n: "Nigiri squit", d: "Pulpo", p: 60 },
          { n: "Nigiri tako", p: 50 },
          { n: "Nigiri atún a la pimienta", p: 65 },
        ]
      },
      {
        id: "sashimis", titulo: "Sashimis", nota: "Maguro, sake y tako: 100 g · Unagui, ebi, kani kama y hotate: 5 pzs", items: [
          { n: "Sashimi maguro (100 g)", d: "Atún", pt: "Consultar" },
          { n: "Sashimi sake (100 g)", d: "Salmón", pt: "Consultar" },
          { n: "Sashimi tako (100 g)", d: "Pulpo", pt: "Consultar" },
          { n: "Sashimi unagui (5 pzs)", d: "Anguila", pt: "Consultar" },
          { n: "Sashimi ebi (5 pzs)", d: "Camarón", pt: "Consultar" },
          { n: "Sashimi kani kama (5 pzs)", d: "Cangrejo", pt: "Consultar" },
          { n: "Sashimi hotate (5 pzs)", d: "Callo de hacha", pt: "Consultar" },
        ]
      },
    ]
  },

  /* ============================ BEBIDAS ============================ */
  {
    id: "bebidas", titulo: "Bebidas", grupos: [
      {
        id: "sin-alcohol", titulo: "Sin alcohol", items: [
          { n: "Familia Coca-Cola", p: 45 },
          { n: "Jugo del Valle", p: 30 },
          { n: "Volt", p: 60 },
          { n: "Limonada", v: [["Natural", 30], ["Mineral", 50]] },
          { n: "Naranjada", v: [["Natural", 35], ["Mineral", 50]] },
          { n: "Rusa", p: 50 },
        ]
      },
      {
        id: "cervezas", titulo: "Cervezas", items: [
          { n: "Cerveza", d: "Corona, Victoria, Pacífico", p: 45, o: ["Corona", "Victoria", "Pacífico"] },
          { n: "Lata", d: "Modelo y Pacífico", p: 45, o: ["Modelo", "Pacífico"] },
          { n: "Corona Cero", p: 45 },
          { n: "Vaso preparado", p: 25 },
          { n: "Greñudas", p: 55 },
        ]
      },
      {
        id: "whisky", titulo: "Whisky", sub: "Copeo", items: [
          { n: "Buchanan's 12", p: 160 },
          { n: "Buchanan's 18", p: 280 },
          { n: "Black Label Johnnie Walker", p: 150 },
          { n: "Doble Black Label", p: 180 },
        ]
      },
      {
        id: "tequila", titulo: "Tequila", sub: "Copeo", items: [
          { n: "Don Julio 70", p: 210 },
          { n: "1800 Cristalino", p: 170 },
          { n: "1800 Reposado", p: 160 },
          { n: "1800 Añejo", p: 170 },
          { n: "Herradura Ultra", p: 150 },
          { n: "Herradura Añejo", p: 120 },
          { n: "Centenario Ultra", p: 150 },
          { n: "Centenario Añejo", p: 130 },
          { n: "Centenario Reposado", p: 100 },
          { n: "Siete Leguas Blanco", p: 150 },
          { n: "Siete Leguas Añejo", p: 180 },
          { n: "Siete Leguas Reposado", p: 160 },
          { n: "Hacienda de Tepa Cristalino", p: 120 },
          { n: "Hacienda de Tepa Blanco", p: 100 },
          { n: "Maestro Dobel", p: 150 },
        ]
      },
      {
        id: "cognac", titulo: "Cognac", sub: "Copeo", items: [
          { n: "Remy Martin VSOP", p: 250 },
          { n: "Martell VSOP", p: 200 },
          { n: "Hennessy VSOP", p: 230 },
        ]
      },
      {
        id: "brandy", titulo: "Brandy", sub: "Copeo", items: [
          { n: "Torres 20", p: 210 },
          { n: "Torres 10", p: 120 },
        ]
      },
      {
        id: "vodka", titulo: "Vodka", sub: "Copeo", items: [
          { n: "Vodka Absolut", p: 170 },
          { n: "Grey Goose", p: 210 },
        ]
      },
      {
        id: "ron", titulo: "Ron", sub: "Copeo", items: [
          { n: "Bacardí", p: 80 },
          { n: "Malibu", p: 90 },
        ]
      },
      {
        id: "mezcal", titulo: "Mezcal", sub: "Copeo", items: [
          { n: "Amarás - Espadín", p: 130 },
          { n: "400 Conejos", p: 100 },
          { n: "Gusano Rojo", p: 150 },
        ]
      },
      {
        id: "digestivos", titulo: "Digestivos", sub: "Copeo", items: [
          { n: "Baileys", p: 100 },
          { n: "Licor 43", p: 100 },
        ]
      },
      {
        id: "sake", titulo: "Sake", sub: "Botella", items: [
          { n: "Hakutsuki", p: 450 },
          { n: "Kawabe", p: 900 },
          { n: "Daiginjo", p: 600 },
          { n: "Yamada Nishiki", p: 600 },
          { n: "Hakutsuru Ginjo", p: 250 },
        ]
      },
      {
        id: "soju", titulo: "Soju", sub: "Botella", items: [
          { n: "Soju original", p: 200 },
          { n: "Soju durazno", p: 200 },
          { n: "Soju fresa", p: 200 },
        ]
      },
      {
        id: "vino-tinto", titulo: "Vino tinto", sub: "Botella", items: [
          { n: "Riunite Lambrusco", p: 300 },
          { n: "Concha y Toro Cabernet", p: 280 },
          { n: "L.A. Cetto Cabernet", p: 210 },
          { n: "3V Casa Madero", p: 930 },
          { n: "Dulce Tinto", p: 270 },
          { n: "Cuatro Soles", p: 300 },
        ]
      },
      {
        id: "vino-espumoso", titulo: "Vino espumoso", sub: "Botella", items: [
          { n: "Champbrulé Brut", p: 500 },
          { n: "Riunite Espumoso", p: 450 },
        ]
      },
      {
        id: "champagne", titulo: "Champagne", sub: "Botella", items: [
          { n: "Rosé Impérial Moët", p: 3200 },
          { n: "Impérial Moët", p: 3000 },
          { n: "Nectar Impérial Moët", p: 2800 },
        ]
      },
    ]
  },

  /* ============================ COCTELERÍA ============================ */
  {
    id: "cocteleria", titulo: "Coctelería", grupos: [
      {
        id: "coc-tequila", titulo: "Tequila", items: [
          { n: "Paloma", p: 130 },
          { n: "Cazuela", p: 200, img: "img/coctel-cazuela.png" },
          { n: "Vampiro", p: 130, img: "img/coctel-vampiro.png" },
          { n: "Margarita", p: 130 },
          { n: "Banderitas", pt: "Consultar", img: "img/coctel-banderitas.png" },
        ]
      },
      {
        id: "coc-ron", titulo: "Ron", items: [
          { n: "Canario", p: 130, img: "img/coctel-canario.png" },
          { n: "Piña colada", p: 130, img: "img/coctel-pina-colada.png" },
          { n: "Mojito", p: 130, img: "img/coctel-mojito.png" },
          { n: "Daiquiri", p: 110 },
        ]
      },
      {
        id: "coc-vodka", titulo: "Vodka", items: [
          { n: "Moscow mule", p: 170, img: "img/coctel-moscow-mule.png" },
          { n: "Bloody Mary", p: 130, img: "img/coctel-bloody-mary.png" },
        ]
      },
      {
        id: "coc-digestivos", titulo: "Digestivos", items: [
          { n: "Carajillo", p: 120, img: "img/coctel-carajillo.png" },
          { n: "Baileys", p: 100 },
          { n: "Espresso martini", p: 140 },
          { n: "Chocolate martini", p: 140, img: "img/coctel-chocolate-martini.png" },
        ]
      },
      {
        id: "coc-espumoso", titulo: "Vino espumoso", items: [
          { n: "Hugo Spritz", p: 240, img: "img/coctel-hugo-spritz.png" },
          { n: "Aperol Spritz", p: 210 },
          { n: "Mimosa", p: 150 },
        ]
      },
      {
        id: "coc-tinto", titulo: "Vino tinto", items: [
          { n: "Clericot", p: 140 },
          { n: "Jarra de clericot", p: 450 },
          { n: "Rodoskhey", p: 150, img: "img/coctel-rodoskhey.png" },
        ]
      },
      {
        id: "coc-hierbas", titulo: "Licor de hierbas", items: [
          { n: "Jäger Boom", p: 130 },
          { n: "Perla Negra", p: 130, img: "img/coctel-perla-negra.png" },
        ]
      },
      {
        id: "coc-mezcal", titulo: "Mezcal", items: [
          { n: "Rodozcal", p: 150, img: "img/coctel-rodozcal.png" },
          { n: "Mezcalito", p: 130, img: "img/coctel-mezcalito.png" },
        ]
      },
    ]
  },
];
