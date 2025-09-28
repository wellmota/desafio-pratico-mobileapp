import React, { useState, useEffect } from 'react';
import { ScrollView, Alert, Linking } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, MessageCircle, BarChart3 } from 'lucide-react-native';
import { 
  Box, 
  VStack, 
  HStack, 
  Text as GluestackText,
  Pressable,
  Image,
  Button,
  ButtonText,
  Badge,
  BadgeText
} from '@gluestack-ui/themed';
import { getProduct, Product } from '../../services/products';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      const productData = await getProduct(id);
      setProduct(productData);
    } catch (error) {
      console.error('Error loading product:', error);
      Alert.alert('Erro', 'Erro ao carregar produto');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactSeller = () => {
    if (product?.seller.phone) {
      const phoneNumber = product.seller.phone.replace(/\D/g, '');
      const whatsappUrl = `whatsapp://send?phone=55${phoneNumber}&text=Olá! Vi seu produto "${product.title}" no Marketplace e gostaria de saber mais informações.`;
      
      Linking.canOpenURL(whatsappUrl)
        .then((supported) => {
          if (supported) {
            return Linking.openURL(whatsappUrl);
          } else {
            Alert.alert('Erro', 'WhatsApp não está instalado no dispositivo');
          }
        })
        .catch((error) => {
          console.error('Error opening WhatsApp:', error);
          Alert.alert('Erro', 'Não foi possível abrir o WhatsApp');
        });
    }
  };

  if (isLoading) {
    return (
      <Box flex={1} backgroundColor="$background" justifyContent="center" alignItems="center">
        <GluestackText>Carregando...</GluestackText>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box flex={1} backgroundColor="$background" justifyContent="center" alignItems="center">
        <GluestackText>Produto não encontrado</GluestackText>
      </Box>
    );
  }

  return (
    <Box flex={1} backgroundColor="$background">
      <ScrollView>
        <VStack space="lg" padding="$6" paddingTop="$16">
          {/* Header */}
          <HStack justifyContent="space-between" alignItems="center">
            <Pressable onPress={() => router.back()}>
              <HStack space="xs" alignItems="center">
                <ArrowLeft color="#1D1D1D" size={20} />
                <GluestackText color="$gray500">Voltar</GluestackText>
              </HStack>
            </Pressable>
          </HStack>

          {/* Product Image */}
          <Box position="relative">
            <Image
              source={{ uri: product.images[0] }}
              alt={product.title}
              width="100%"
              height={300}
              borderRadius="$lg"
            />
            <Badge
              position="absolute"
              top="$4"
              right="$4"
              backgroundColor="$blueBase"
              borderRadius="$full"
            >
              <BadgeText color="$white" size="sm">
                {product.views} visualizações
              </BadgeText>
            </Badge>
          </Box>

          {/* Product Info */}
          <VStack space="md">
            {/* Title and Price */}
            <VStack space="sm">
              <GluestackText size="2xl" fontWeight="$bold" color="$gray500">
                {product.title}
              </GluestackText>
              <GluestackText size="3xl" fontWeight="$bold" color="$orangeBase">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </GluestackText>
            </VStack>

            {/* Description */}
            <VStack space="sm">
              <GluestackText size="md" fontWeight="$semibold" color="$gray400">
                Descrição
              </GluestackText>
              <GluestackText size="md" color="$gray500" lineHeight="$lg">
                {product.description}
              </GluestackText>
            </VStack>

            {/* Dimensions */}
            <VStack space="sm">
              <GluestackText size="md" fontWeight="$semibold" color="$gray400">
                Dimensões
              </GluestackText>
              <VStack space="xs">
                <GluestackText size="md" color="$gray500">
                  Largura: 1,80m
                </GluestackText>
                <GluestackText size="md" color="$gray500">
                  Altura do chão: 20cm
                </GluestackText>
              </VStack>
            </VStack>

            {/* Category */}
            <VStack space="sm">
              <GluestackText size="md" fontWeight="$semibold" color="$gray400">
                Categoria
              </GluestackText>
              <Badge backgroundColor="$orangeBase" borderRadius="$md" alignSelf="flex-start">
                <BadgeText color="$white" size="md">
                  {product.category}
                </BadgeText>
              </Badge>
            </VStack>

            {/* Views Metric */}
            <Box 
              backgroundColor="$blueLight" 
              borderRadius="$lg" 
              padding="$4"
              marginTop="$4"
            >
              <HStack space="sm" alignItems="center">
                <BarChart3 color="#009CF0" size={20} />
                <GluestackText size="md" color="$blueDark" fontWeight="$semibold">
                  {product.views} pessoas visualizaram este produto nos últimos 7 dias
                </GluestackText>
              </HStack>
            </Box>
          </VStack>
        </VStack>
      </ScrollView>

      {/* Bottom Action Bar */}
      <Box
        backgroundColor="$white"
        padding="$6"
        borderTopWidth={1}
        borderTopColor="$shape"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <VStack>
          <GluestackText size="sm" color="$gray300">
            Preço
          </GluestackText>
          <GluestackText size="xl" fontWeight="$bold" color="$orangeBase">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </GluestackText>
        </VStack>
        
        <Button
          size="lg"
          backgroundColor="$orangeBase"
          borderRadius="$lg"
          onPress={handleContactSeller}
          flex={1}
          marginLeft="$4"
        >
          <HStack space="sm" alignItems="center">
            <MessageCircle color="white" size={20} />
            <ButtonText color="$white" fontWeight="$semibold">
              Entrar em contato
            </ButtonText>
          </HStack>
        </Button>
      </Box>
    </Box>
  );
}
