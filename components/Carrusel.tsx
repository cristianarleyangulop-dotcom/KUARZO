import React, { useCallback, useMemo, useRef, useState } from 'react';
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, StyleProp, Text, TouchableOpacity, useWindowDimensions, View, ViewStyle } from 'react-native';

export type CarruselProps<T> = {
    title?: string;
    data: T[];
    // El padre decide CÓMO renderizar cada item y nosotros le pasamos el ancho disponible
    renderItem: (item: T, index: number, cardWidth: number) => React.ReactElement;
    
    // Configuración opcional
    itemsPerPage?: number;     // Si no se pasa, calcula automáticamente 1 a 4 según la pantalla
    showDots?: boolean;        // Mostrar puntitos abajo (por defecto true)
    showArrows?: boolean;      // Mostrar flechas a los lados (por defecto true)
    gap?: number;              // Espacio (margin) entre tarjetas (por defecto 12)
    containerStyle?: StyleProp<ViewStyle>;
};

function Carrusel<T>({ 
    title, 
    data = [], 
    renderItem, 
    itemsPerPage, 
    showDots = true,
    showArrows = true,
    gap = 12,
    containerStyle 
}: CarruselProps<T>) {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const flatListRef = useRef<FlatList>(null);
    const { width: screenWidth } = useWindowDimensions();

    const horizontalPadding = 16;
    
    // 1. Calcular cuántas tarjetas mostrar. Si no se especificó, lo calculamos por ancho de pantalla
    const visibleCards = itemsPerPage ?? (screenWidth >= 1200 ? 4 : screenWidth >= 900 ? 3 : screenWidth >= 640 ? 2 : 1);
    
    // 2. Calcular el ancho exacto de cada tarjeta para que quepan 'visibleCards'
    const CARD_WIDTH = useMemo(() => {
        return Math.floor((screenWidth - (horizontalPadding * 2) - gap * Math.max(0, visibleCards - 1)) / visibleCards);
    }, [screenWidth, gap, visibleCards, horizontalPadding]);

    // 3. Índice máximo para no hacer scroll más allá del final dejando espacio vacío
    const maxIndex = Math.max(0, data.length - visibleCards);

    // Navegar haciendo clic en las flechas
    const scrollToIndex = (index: number) => {
        if (data.length === 0) return;
        const nextIndex = Math.max(0, Math.min(index, maxIndex));
        flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    };

    // Actualizar el índice mientras el usuario hace scroll
    const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const x = event.nativeEvent.contentOffset.x;
        // Se calcula el índice más cercano
        const newIndex = Math.round(x / (CARD_WIDTH + gap));
        setActiveIndex(newIndex);
    }, [CARD_WIDTH, gap]);

    // Envolvemos el renderizado del padre para forzar el ancho
    const renderFlatListItem = useCallback(({ item, index }: { item: T; index: number }) => {
        return (
            <View style={{ width: CARD_WIDTH }}>
                {renderItem(item, index, CARD_WIDTH)}
            </View>
        );
    }, [renderItem, CARD_WIDTH]);

    const canGoLeft = activeIndex > 0;
    const canGoRight = activeIndex < maxIndex;

    return (
        <View style={[{ width: '100%' }, containerStyle]}>
            {/* Título opcional */}
            {title ? (
                <Text className="text-2xl font-bold text-gray-800 mb-4 text-center">
                    {title}
                </Text>
            ) : null}

            <View className="relative w-full py-4">
                <FlatList
                    ref={flatListRef}
                    data={data}
                    renderItem={renderFlatListItem}
                    ItemSeparatorComponent={() => <View style={{ width: gap }} />}
                    keyExtractor={(_item: T, index: number) => `carrusel-${index}`}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: horizontalPadding }}
                    decelerationRate="fast"
                    snapToInterval={CARD_WIDTH + gap}
                    snapToAlignment="start"
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    getItemLayout={(_data: any, index: number) => ({
                        length: CARD_WIDTH + gap,
                        offset: (CARD_WIDTH + gap) * index,
                        index,
                    })}
                />

                {/* Flecha Izquierda */}
                {showArrows && canGoLeft ? (
                    <TouchableOpacity
                        onPress={() => scrollToIndex(activeIndex - 1)}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            marginTop: -22,
                            left: 16,
                            width: 44,
                            height: 44,
                            borderRadius: 22,
                            backgroundColor: '#000',
                            alignItems: 'center',
                            justifyContent: 'center',
                            elevation: 3,
                            zIndex: 10,
                            opacity: 0.8,
                        }}
                    >
                        <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>‹</Text>
                    </TouchableOpacity>
                ) : null}

                {/* Flecha Derecha */}
                {showArrows && canGoRight ? (
                    <TouchableOpacity
                        onPress={() => scrollToIndex(activeIndex + 1)}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            marginTop: -22,
                            right: 16,
                            width: 44,
                            height: 44,
                            borderRadius: 22,
                            backgroundColor: '#000',
                            alignItems: 'center',
                            justifyContent: 'center',
                            elevation: 3,
                            zIndex: 10,
                            opacity: 0.8,
                        }}
                    >
                        <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>›</Text>
                    </TouchableOpacity>
                ) : null}
            </View>

            {/* Paginador (Puntitos) */}
            {showDots && data.length > 1 ? (
                <View className="px-4 mt-2 flex-row items-center justify-center gap-2">
                    {data.map((_, idx) => (
                        <View
                            key={`dot-${idx}`}
                            className={`h-2 rounded-full transition-all duration-300 ${idx === activeIndex ? 'w-6 bg-yellow-500' : 'w-2 bg-gray-300'}`}
                        />
                    ))}
                </View>
            ) : null}
        </View>
    );
}

export default Carrusel;

