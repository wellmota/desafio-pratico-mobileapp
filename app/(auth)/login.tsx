import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, router } from 'expo-router';
import { Eye, EyeOff, Mail, ArrowRight } from 'lucide-react-native';
import { 
  Box, 
  VStack, 
  HStack, 
  Input, 
  InputField, 
  InputIcon, 
  Button, 
  ButtonText,
  Text as GluestackText,
  Pressable
} from '@gluestack-ui/themed';
import { login, setToken } from '../../services/auth';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await login(data);
      await setToken(response.token);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Erro', error.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#FBF4F4' }}>
      <VStack space="xl" padding="$6" paddingTop="$16">
        {/* Header */}
        <VStack space="sm" alignItems="center">
          <GluestackText size="3xl" fontWeight="$bold" color="$gray500">
            Acesse sua conta
          </GluestackText>
          <GluestackText size="md" color="$gray300" textAlign="center">
            Informe seu e-mail e senha para entrar
          </GluestackText>
        </VStack>

        {/* Form */}
        <VStack space="lg">
          {/* Email Input */}
          <VStack space="xs">
            <GluestackText size="sm" fontWeight="$medium" color="$gray400">
              E-MAIL
            </GluestackText>
            <Box position="relative">
              <Input
                variant="outline"
                size="lg"
                isInvalid={!!errors.email}
                borderColor={errors.email ? '$danger' : '$gray200'}
              >
                <InputIcon as={Mail} color="$gray300" marginLeft="$3" />
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <InputField
                      placeholder="mail@exemplo.br"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      marginLeft="$10"
                    />
                  )}
                />
              </Input>
              {errors.email && (
                <GluestackText size="xs" color="$danger" marginTop="$1">
                  {errors.email.message}
                </GluestackText>
              )}
            </Box>
          </VStack>

          {/* Password Input */}
          <VStack space="xs">
            <GluestackText size="sm" fontWeight="$medium" color="$gray400">
              SENHA
            </GluestackText>
            <Box position="relative">
              <Input
                variant="outline"
                size="lg"
                isInvalid={!!errors.password}
                borderColor={errors.password ? '$danger' : '$gray200'}
              >
                <InputIcon 
                  as={showPassword ? EyeOff : Eye} 
                  color="$gray300" 
                  marginLeft="$3"
                  onPress={() => setShowPassword(!showPassword)}
                />
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <InputField
                      placeholder="Sua senha"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      secureTextEntry={!showPassword}
                      marginLeft="$10"
                    />
                  )}
                />
              </Input>
              {errors.password && (
                <GluestackText size="xs" color="$danger" marginTop="$1">
                  {errors.password.message}
                </GluestackText>
              )}
            </Box>
          </VStack>

          {/* Login Button */}
          <Button
            size="lg"
            backgroundColor="$orangeBase"
            borderRadius="$lg"
            onPress={handleSubmit(onSubmit)}
            isDisabled={isLoading}
            marginTop="$4"
          >
            <HStack space="sm" alignItems="center">
              <ButtonText color="$white" fontWeight="$semibold">
                Acessar
              </ButtonText>
              <ArrowRight color="white" size={20} />
            </HStack>
          </Button>
        </VStack>

        {/* Register Link */}
        <VStack space="sm" alignItems="center" marginTop="$8">
          <GluestackText size="md" color="$gray300">
            Ainda não tem uma conta?
          </GluestackText>
          <Link href="/(auth)/register" asChild>
            <Pressable>
              <HStack space="sm" alignItems="center">
                <GluestackText size="md" color="$orangeBase" fontWeight="$semibold">
                  Cadastrar
                </GluestackText>
                <ArrowRight color="#F24D0D" size={20} />
              </HStack>
            </Pressable>
          </Link>
        </VStack>
      </VStack>
    </ScrollView>
  );
}
