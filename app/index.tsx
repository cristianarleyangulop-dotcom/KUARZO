import React from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { CardProduct } from '../components/CardProduct';
import Carrusel from '../components/Carrusel';
import CustomButton from '../components/CustomButton';
import Header from '../components/header';

const App = () => {

  // Mock de Banners Promocionales (Imágenes completas)
  const sampleBanners = [
    { id: 1, image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000&auto=format&fit=crop" },
    { id: 2, image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1000&auto=format&fit=crop" },
    { id: 3, image: "https://images.unsplash.com/photo-1515562141207-7a8ef27ce011?q=80&w=1000&auto=format&fit=crop" },
  ];

  const sampleProduct = {
    nombre: "Pulsera Volcánica",
    descripcion: "Piedras volcánicas y dijes de acero.",
    precio: 45000,
    imagen: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1170&auto=format&fit=crop"
  };

  // Generamos 6 productos ficticios para las recomendaciones
  const sampleProducts = Array.from({ length: 6 }).map((_, i) => ({
    ...sampleProduct,
    id: i + 1,
    nombre: `Pulsera Modelo ${i + 1}`
  }));

  return (
    <ScrollView className='flex-1 bg-gray-50' showsVerticalScrollIndicator={false}>
      <Header />
      
      <View className="items-center mt-4">
        <CustomButton children="Menú Principal" color="primary" className='w-1/2' />
      </View>

      {/* 1. EJEMPLO: Carrusel como BANNER PRINCIPAL (1 item por vista) */}
      <View className="mt-6 w-full">
         <Carrusel
            data={sampleBanners}
            itemsPerPage={1}
            gap={0} 
            showArrows={false} // Ocultar flechas suele ser mejor UX en móvil top
            showDots={true}
            renderItem={(item, index, cardWidth) => (
                <TouchableOpacity activeOpacity={0.9} className="items-center justify-center">
                    <Image 
                        source={{ uri: item.image }} 
                        // Utilizamos exactamente el cardWidth provisto por el carrusel
                        style={{ width: cardWidth, height: 180, borderRadius: 12 }} 
                        resizeMode="cover"
                    />
                </TouchableOpacity>
            )}
         />
      </View>

      {/* 2. EJEMPLO: Carrusel como RECOMENDACIONES DE PRODUCTOS (Múltiples items) */}
      <View className="mt-6 mb-12 w-full">
         <Carrusel
            title="RECOMENDACIONES"
            data={sampleProducts}
            showArrows={true}
            showDots={false} // Queda más limpio sin puntos si hay muchos productos
            // Dejamos que el Carrusel deduzca itemsPerPage basado en pantalla o responsive
            renderItem={(item, index, cardWidth) => (
                <CardProduct producto={item} width={cardWidth} />
            )}
         />
      </View>

    </ScrollView>
  )
}

export default App
