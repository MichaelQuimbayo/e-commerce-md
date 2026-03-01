// Array de imágenes para productos sin variantes de color específicas
const genericImages = [
  'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/3da99393e5294a1fab1681dd60425ac1_9366/Camiseta_Local_Millonarios_FC_2025_Azul_KB3185_01_laydown.jpg',
  'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/b350341341734565a3f13050188c18c9_9366/Camiseta_Local_Millonarios_FC_2025_Azul_KB3185_02_laydown_fs.jpg',
  'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/c932043cde504180831b0200844a453c_9366/Camiseta_Local_Millonarios_FC_2025_Azul_KB3185_41_detail.jpg',
];

export const products = [
  {
    id: 1,
    name: 'Camiseta Selección Colombia 2024',
    slug: 'camiseta-seleccion-colombia-2024',
    originalPrice: '$62.50',
    price: '$49.99',
    description: 'Viste los colores de la selección. Esta camiseta de fútbol adidas para hinchas te mantiene cómodo mientras apoyas a tu equipo.',
    // --- ¡CAMBIO CLAVE! ---
    // "colors" ahora es un array de objetos, cada uno con su propia galería.
    colors: [
      {
        name: 'Local',
        colorHex: '#F7D100', // Color para el swatch
        images: [
          'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/e5f99998cb2445329816b0c193a514f4_9366/Camiseta_Local_Seleccion_Colombia_24_Amarillo_HY6931_01_laydown.jpg',
          'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/e3c315632d834195b1b101b1f5c89362_9366/Camiseta_Local_Seleccion_Colombia_24_Amarillo_HY6931_41_detail.jpg',
          'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/d583333333d04595b10807759a8c642c_9366/Camiseta_Local_Seleccion_Colombia_24_Amarillo_HY6931_42_detail.jpg',
        ]
      },
      {
        name: 'Visitante',
        colorHex: '#1A1A1A', // Negro
        images: [
          'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/b3383c47a47a47b481772c725f714088_9366/Camiseta_Visitante_Seleccion_Colombia_24_Negro_HY6934_01_laydown.jpg',
          'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/c69c64a631614a87b640304a91c16c68_9366/Camiseta_Visitante_Seleccion_Colombia_24_Negro_HY6934_41_detail.jpg',
        ]
      }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    status: 'available',
    rating: 5,
    category: 'hombre',
  },
  {
    id: 2,
    name: 'Camiseta Local Benfica 24/25',
    slug: 'camiseta-local-benfica-24-25',
    price: '$39.99',
    images: genericImages, // <-- Mantenemos la estructura simple para los demás
    description: 'El ADN del Benfica. El escudo del club destaca sobre el clásico color rojo de esta camiseta de fútbol adidas.',
    colors: ['Rojo', 'Blanco'],
    sizes: ['S', 'M', 'L'],
    badge: 'Nuevo',
    status: 'available',
    rating: 4,
    category: 'hombre',
  },
  // ... (el resto de productos siguen usando la estructura simple por ahora)
];
