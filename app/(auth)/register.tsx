import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, router } from 'expo-router';
import { Eye, EyeOff, Mail, User, Phone, ArrowRight, Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
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
  Pressable,
  Avatar,
  AvatarImage
} from '@gluestack-ui/themed';
import { register, setToken } from '../../services/auth';

const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  phone: z.string().min(10, 'Telefone inválido'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const response = await register({
        ...data,
        avatar,
      });
      await setToken(response.token);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Erro', error.response?.data?.message || 'Erro ao cadastrar');
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
            Crie sua conta
          </GluestackText>
          <GluestackText size="md" color="$gray300" textAlign="center">
            Informe os seus dados pessoais e de acesso
          </GluestackText>
        </VStack>

        {/* Avatar Upload */}
        <VStack space="sm" alignItems="center">
          <Pressable onPress={pickImage}>
            <Avatar size="2xl">
              <AvatarImage 
                source={avatar ? { uri: avatar } : undefined}
                alt="Profile picture"
              />
              {!avatar && (
                <Box 
                  position="absolute" 
                  bottom={0} 
                  right={0} 
                  backgroundColor="$orangeBase" 
                  borderRadius="$full" 
                  padding="$2"
                >
                  <Camera color="white" size={20} />
                </Box>
              )}
            </Avatar>
          </Pressable>
        </VStack>

        {/* Form */}
        <VStack space="lg">
          {/* Name Input */}
          <VStack space="xs">
            <GluestackText size="sm" fontWeight="$medium" color="$gray400">
              NOME
            </GluestackText>
            <Box position="relative">
              <Input
                variant="outline"
                size="lg"
                isInvalid={!!errors.name}
                borderColor={errors.name ? '$danger' : '$gray200'}
              >
                <InputIcon as={User} color="$gray300" marginLeft="$3" />
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <InputField
                      placeholder="Seu nome completo"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      marginLeft="$10"
                    />
                  )}
                />
              </Input>
              {errors.name && (
                <GluestackText size="xs" color="$danger" marginTop="$1">
                  {errors.name.message}
                </GluestackText>
              )}
            </Box>
          </VStack>

          {/* Phone Input */}
          <VStack space="xs">
            <GluestackText size="sm" fontWeight="$medium" color="$gray400">
              TELEFONE
            </GluestackText>
            <Box position="relative">
              <Input
                variant="outline"
                size="lg"
                isInvalid={!!errors.phone}
                borderColor={errors.phone ? '$danger' : '$gray200'}
              >
                <InputIcon as={Phone} color="$gray300" marginLeft="$3" />
                <Controller
                  control={control}
                  name="phone"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <InputField
                      placeholder="(00) 00000-0000"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      keyboardType="phone-pad"
                      marginLeft="$10"
                    />
                  )}
                />
              </Input>
              {errors.phone && (
                <GluestackText size="xs" color="$danger" marginTop="$1">
                  {errors.phone.message}
                </GluestackText>
              )}
            </Box>
          </VStack>

          {/* Access Section */}
          <VStack space="md">
            <GluestackText size="md" fontWeight="$semibold" color="$gray400">
              Acesso
            </GluestackText>

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
                        keyboardType="email-address"
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

            {/* Confirm Password Input */}
            <VStack space="xs">
              <GluestackText size="sm" fontWeight="$medium" color="$gray400">
                CONFIRMAR SENHA
              </GluestackText>
              <Box position="relative">
                <Input
                  variant="outline"
                  size="lg"
                  isInvalid={!!errors.confirmPassword}
                  borderColor={errors.confirmPassword ? '$danger' : '$gray200'}
                >
                  <InputIcon 
                    as={showConfirmPassword ? EyeOff : Eye} 
                    color="$gray300" 
                    marginLeft="$3"
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                  <Controller
                    control={control}
                    name="confirmPassword"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <InputField
                        placeholder="Confirme a senha"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        secureTextEntry={!showConfirmPassword}
                        marginLeft="$10"
                      />
                    )}
                  />
                </Input>
                {errors.confirmPassword && (
                  <GluestackText size="xs" color="$danger" marginTop="$1">
                    {errors.confirmPassword.message}
                  </GluestackText>
                )}
              </Box>
            </VStack>
          </VStack>

          {/* Register Button */}
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
                Cadastrar
              </ButtonText>
              <ArrowRight color="white" size={20} />
            </HStack>
          </Button>
        </VStack>

        {/* Login Link */}
        <VStack space="sm" alignItems="center" marginTop="$8">
          <GluestackText size="md" color="$gray300">
            Já tem uma conta?
          </GluestackText>
          <Link href="/(auth)/login" asChild>
            <Pressable>
              <HStack space="sm" alignItems="center">
                <GluestackText size="md" color="$orangeBase" fontWeight="$semibold">
                  Acessar
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
