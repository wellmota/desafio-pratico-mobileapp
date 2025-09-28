import React, { useState, useEffect } from 'react';
import { ScrollView, RefreshControl, Alert } from 'react-native';
import { router } from 'expo-router';
import { Search, Filter, ShoppingBag, ArrowRight } from 'lucide-react-native';
import { 
  Box, 
  VStack, 
  HStack, 
  Text as GluestackText,
  Pressable,
  Input,
  InputField,
  InputIcon,
  Button,
  ButtonText,
  Avatar,
  AvatarImage,
  Image,
  Badge,
  BadgeText
} from '@gluestack-ui/themed';
import { getProducts, Product, ProductFilters } from '../../services/products';
import { getUser, User } from '../../services/user';

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState<ProductFilters>({});

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (searchText.length > 0 || Object.keys(filters).length > 0) {
      loadProducts();
    }
  }, [searchText, filters]);

  const loadData = async () => {
    try {
      await Promise.all([loadUser(), loadProducts()]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUser = async () => {
    try {
      const userData = await getUser();
      setUser(userData);
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const searchFilters: ProductFilters = {
        ...filters,
        ...(searchText && { search: searchText }),
      };
      const productsData = await getProducts(searchFilters);
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const handleFilterPress = () => {
    setShowFilterModal(true);
  };

  const applyFilters = (newFilters: ProductFilters) => {
    setFilters(newFilters);
    setShowFilterModal(false);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchText('');
    setShowFilterModal(false);
  };

  if (isLoading) {
    return (
      <Box flex={1} backgroundColor="$background" justifyContent="center" alignItems="center">
        <GluestackText>Carregando...</GluestackText>
      </Box>
    );
  }

  return (
    <Box flex={1} backgroundColor="$background">
      <ScrollView 
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        <VStack space="lg" padding="$6" paddingTop="$16">
          {/* Header with User Info */}
          <HStack justifyContent="space-between" alignItems="center">
            <HStack space="sm" alignItems="center">
              <Avatar size="md">
                <AvatarImage 
                  source={user?.avatar ? { uri: user.avatar } : undefined}
                  alt="Profile"
                />
              </Avatar>
              <VStack>
                <GluestackText size="lg" fontWeight="$semibold" color="$gray500">
                  Olá, {user?.name?.split(' ')[0]}!
                </GluestackText>
                <Pressable onPress={() => router.push('/(tabs)/profile')}>
                  <HStack space="xs" alignItems="center">
                    <GluestackText size="sm" color="$orangeBase">
                      Ver perfil
                    </GluestackText>
                    <ArrowRight color="#F24D0D" size={16} />
                  </HStack>
                </Pressable>
              </VStack>
            </HStack>
          </HStack>

          {/* Search Section */}
          <VStack space="md">
            <GluestackText size="lg" fontWeight="$semibold" color="$gray500">
              Explore produtos
            </GluestackText>
            <HStack space="sm">
              <Box flex={1}>
                <Input variant="outline" size="lg" borderColor="$gray200">
                  <InputIcon as={Search} color="$gray300" marginLeft="$3" />
                  <InputField
                    placeholder="Pesquisar"
                    value={searchText}
                    onChangeText={setSearchText}
                    marginLeft="$10"
                  />
                </Input>
              </Box>
              <Button
                size="lg"
                backgroundColor="$orangeBase"
                borderRadius="$lg"
                onPress={handleFilterPress}
              >
                <Filter color="white" size={20} />
              </Button>
            </HStack>
          </VStack>

          {/* Products Grid */}
          <VStack space="md">
            {products.length > 0 ? (
              <VStack space="md">
                {Array.from({ length: Math.ceil(products.length / 2) }).map((_, rowIndex) => (
                  <HStack key={rowIndex} space="md">
                    {products.slice(rowIndex * 2, (rowIndex + 1) * 2).map((product) => (
                      <Pressable
                        key={product.id}
                        flex={1}
                        onPress={() => handleProductPress(product.id)}
                      >
                        <VStack space="sm" backgroundColor="$white" borderRadius="$lg" padding="$3" hardShadow="1">
                          <Box position="relative">
                            <Image
                              source={{ uri: product.images[0] }}
                              alt={product.title}
                              width="100%"
                              height={120}
                              borderRadius="$md"
                            />
                            <Badge
                              position="absolute"
                              top="$2"
                              right="$2"
                              backgroundColor="$blueBase"
                              borderRadius="$full"
                            >
                              <BadgeText color="$white" size="xs">
                                {product.views} visualizações
                              </BadgeText>
                            </Badge>
                          </Box>
                          <VStack space="xs">
                            <GluestackText size="sm" fontWeight="$semibold" color="$gray500" numberOfLines={2}>
                              {product.title}
                            </GluestackText>
                            <GluestackText size="md" fontWeight="$bold" color="$orangeBase">
                              R$ {product.price.toFixed(2).replace('.', ',')}
                            </GluestackText>
                          </VStack>
                        </VStack>
                      </Pressable>
                    ))}
                  </HStack>
                ))}
              </VStack>
            ) : (
              <Box alignItems="center" padding="$8">
                <GluestackText color="$gray300" textAlign="center">
                  Nenhum produto encontrado
                </GluestackText>
              </Box>
            )}
          </VStack>
        </VStack>
      </ScrollView>

      {/* Floating Action Button */}
      <Box
        position="absolute"
        bottom="$6"
        right="$6"
        backgroundColor="$orangeBase"
        borderRadius="$lg"
        padding="$4"
        hardShadow="3"
      >
        <ShoppingBag color="white" size={24} />
      </Box>

      {/* Filter Modal */}
      {showFilterModal && (
        <FilterModal
          filters={filters}
          onApplyFilters={applyFilters}
          onClearFilters={clearFilters}
          onClose={() => setShowFilterModal(false)}
        />
      )}
    </Box>
  );
}

// Filter Modal Component
function FilterModal({ 
  filters, 
  onApplyFilters, 
  onClearFilters, 
  onClose 
}: {
  filters: ProductFilters;
  onApplyFilters: (filters: ProductFilters) => void;
  onClearFilters: () => void;
  onClose: () => void;
}) {
  const [minPrice, setMinPrice] = useState(filters.minPrice?.toString() || '');
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice?.toString() || '');
  const [selectedCategory, setSelectedCategory] = useState(filters.category || '');

  const categories = [
    'Brinquedo',
    'Móvel', 
    'Papelaria',
    'Saúde & Beleza',
    'Utensílio',
    'Vestuário'
  ];

  const handleApply = () => {
    const newFilters: ProductFilters = {};
    
    if (minPrice) {
      newFilters.minPrice = parseFloat(minPrice);
    }
    if (maxPrice) {
      newFilters.maxPrice = parseFloat(maxPrice);
    }
    if (selectedCategory) {
      newFilters.category = selectedCategory;
    }
    
    onApplyFilters(newFilters);
  };

  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      backgroundColor="rgba(0,0,0,0.5)"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        backgroundColor="$white"
        borderRadius="$lg"
        padding="$6"
        margin="$4"
        width="90%"
        maxHeight="80%"
      >
        <HStack justifyContent="space-between" alignItems="center" marginBottom="$4">
          <GluestackText size="xl" fontWeight="$bold" color="$gray500">
            Filtrar anúncios
          </GluestackText>
          <Pressable onPress={onClose}>
            <GluestackText size="xl" color="$gray300">×</GluestackText>
          </Pressable>
        </HStack>

        <VStack space="lg">
          {/* Price Filter */}
          <VStack space="sm">
            <GluestackText size="md" fontWeight="$semibold" color="$gray400">
              Valor
            </GluestackText>
            <HStack space="sm">
              <Box flex={1}>
                <Input variant="outline" size="md">
                  <InputField
                    placeholder="De"
                    value={minPrice}
                    onChangeText={setMinPrice}
                    keyboardType="numeric"
                  />
                </Input>
              </Box>
              <Box flex={1}>
                <Input variant="outline" size="md">
                  <InputField
                    placeholder="Até"
                    value={maxPrice}
                    onChangeText={setMaxPrice}
                    keyboardType="numeric"
                  />
                </Input>
              </Box>
            </HStack>
          </VStack>

          {/* Category Filter */}
          <VStack space="sm">
            <GluestackText size="md" fontWeight="$semibold" color="$gray400">
              Categoria
            </GluestackText>
            <VStack space="xs">
              {categories.map((category) => (
                <Pressable
                  key={category}
                  onPress={() => setSelectedCategory(selectedCategory === category ? '' : category)}
                >
                  <HStack space="sm" alignItems="center" padding="$2">
                    <Box
                      width={20}
                      height={20}
                      borderRadius="$sm"
                      borderWidth={2}
                      borderColor={selectedCategory === category ? '$orangeBase' : '$gray200'}
                      backgroundColor={selectedCategory === category ? '$orangeBase' : 'transparent'}
                      justifyContent="center"
                      alignItems="center"
                    >
                      {selectedCategory === category && (
                        <GluestackText color="$white" size="xs">✓</GluestackText>
                      )}
                    </Box>
                    <GluestackText color="$gray500">{category}</GluestackText>
                  </HStack>
                </Pressable>
              ))}
            </VStack>
          </VStack>

          {/* Action Buttons */}
          <HStack space="sm" marginTop="$4">
            <Button
              flex={1}
              variant="outline"
              borderColor="$orangeBase"
              onPress={onClearFilters}
            >
              <ButtonText color="$orangeBase">Limpar filtro</ButtonText>
            </Button>
            <Button
              flex={1}
              backgroundColor="$orangeBase"
              onPress={handleApply}
            >
              <ButtonText color="$white">Filtrar</ButtonText>
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
}
