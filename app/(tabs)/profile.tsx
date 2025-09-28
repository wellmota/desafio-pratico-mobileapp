import React, { useState, useEffect } from 'react';
import { ScrollView, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { router } from 'expo-router';
import { LogOut, Eye, EyeOff, Mail, User, Phone, Camera, ArrowLeft } from 'lucide-react-native';
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
import { getUser, updateUser, updatePassword, User } from '../../services/user';
import { logout } from '../../services/auth';

const updateUserSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  phone: z.string().min(10, 'Telefone inválido'),
  email: z.string().email('E-mail inválido'),
});

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: z.string().min(6, 'Nova senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});

type UpdateUserFormData = z.infer<typeof updateUserSchema>;
type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);

  const {
    control: userControl,
    handleSubmit: handleUserSubmit,
    formState: { errors: userErrors },
    reset: resetUserForm,
  } = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
  });

  const {
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await getUser();
      setUser(userData);
      setAvatar(userData.avatar || null);
      
      // Reset form with user data
      resetUserForm({
        name: userData.name,
        phone: userData.phone,
        email: userData.email,
      });
    } catch (error) {
      console.error('Error loading user:', error);
      Alert.alert('Erro', 'Erro ao carregar dados do usuário');
    } finally {
      setIsLoading(false);
    }
  };

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

  const onUserUpdate = async (data: UpdateUserFormData) => {
    setIsUpdating(true);
    try {
      const updatedUser = await updateUser({
        ...data,
        avatar,
      });
      setUser(updatedUser);
      Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
    } catch (error: any) {
      Alert.alert('Erro', error.response?.data?.message || 'Erro ao atualizar dados');
    } finally {
      setIsUpdating(false);
    }
  };

  const onPasswordUpdate = async (data: UpdatePasswordFormData) => {
    setIsUpdating(true);
    try {
      await updatePassword(data);
      resetPasswordForm();
      Alert.alert('Sucesso', 'Senha atualizada com sucesso!');
    } catch (error: any) {
      Alert.alert('Erro', error.response?.data?.message || 'Erro ao atualizar senha');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da aplicação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <Box flex={1} backgroundColor="$background" justifyContent="center" alignItems="center">
        <GluestackText>Carregando...</GluestackText>
      </Box>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#FBF4F4' }}>
      <VStack space="xl" padding="$6" paddingTop="$16">
        {/* Header */}
        <HStack justifyContent="space-between" alignItems="center">
          <Pressable onPress={() => router.back()}>
            <HStack space="xs" alignItems="center">
              <ArrowLeft color="#1D1D1D" size={20} />
              <GluestackText color="$gray500">Voltar</GluestackText>
            </HStack>
          </Pressable>
          <Pressable onPress={handleLogout}>
            <LogOut color="#1D1D1D" size={24} />
          </Pressable>
        </HStack>

        {/* Profile Picture */}
        <VStack space="sm" alignItems="center">
          <Pressable onPress={pickImage}>
            <Avatar size="2xl">
              <AvatarImage 
                source={avatar ? { uri: avatar } : undefined}
                alt="Profile picture"
              />
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
            </Avatar>
          </Pressable>
        </VStack>

        {/* User Info Form */}
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
                isInvalid={!!userErrors.name}
                borderColor={userErrors.name ? '$danger' : '$gray200'}
              >
                <InputIcon as={User} color="$gray300" marginLeft="$3" />
                <Controller
                  control={userControl}
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
              {userErrors.name && (
                <GluestackText size="xs" color="$danger" marginTop="$1">
                  {userErrors.name.message}
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
                isInvalid={!!userErrors.phone}
                borderColor={userErrors.phone ? '$danger' : '$gray200'}
              >
                <InputIcon as={Phone} color="$gray300" marginLeft="$3" />
                <Controller
                  control={userControl}
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
              {userErrors.phone && (
                <GluestackText size="xs" color="$danger" marginTop="$1">
                  {userErrors.phone.message}
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
                  isInvalid={!!userErrors.email}
                  borderColor={userErrors.email ? '$danger' : '$gray200'}
                >
                  <InputIcon as={Mail} color="$gray300" marginLeft="$3" />
                  <Controller
                    control={userControl}
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
                {userErrors.email && (
                  <GluestackText size="xs" color="$danger" marginTop="$1">
                    {userErrors.email.message}
                  </GluestackText>
                )}
              </Box>
            </VStack>

            {/* Current Password Input */}
            <VStack space="xs">
              <GluestackText size="sm" fontWeight="$medium" color="$gray400">
                SENHA ATUAL
              </GluestackText>
              <Box position="relative">
                <Input
                  variant="outline"
                  size="lg"
                  isInvalid={!!passwordErrors.currentPassword}
                  borderColor={passwordErrors.currentPassword ? '$danger' : '$gray200'}
                >
                  <InputIcon 
                    as={showCurrentPassword ? EyeOff : Eye} 
                    color="$gray300" 
                    marginLeft="$3"
                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                  />
                  <Controller
                    control={passwordControl}
                    name="currentPassword"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <InputField
                        placeholder="Sua senha"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        secureTextEntry={!showCurrentPassword}
                        marginLeft="$10"
                      />
                    )}
                  />
                </Input>
                {passwordErrors.currentPassword && (
                  <GluestackText size="xs" color="$danger" marginTop="$1">
                    {passwordErrors.currentPassword.message}
                  </GluestackText>
                )}
              </Box>
            </VStack>

            {/* New Password Input */}
            <VStack space="xs">
              <GluestackText size="sm" fontWeight="$medium" color="$gray400">
                NOVA SENHA
              </GluestackText>
              <Box position="relative">
                <Input
                  variant="outline"
                  size="lg"
                  isInvalid={!!passwordErrors.newPassword}
                  borderColor={passwordErrors.newPassword ? '$danger' : '$gray200'}
                >
                  <InputIcon 
                    as={showNewPassword ? EyeOff : Eye} 
                    color="$gray300" 
                    marginLeft="$3"
                    onPress={() => setShowNewPassword(!showNewPassword)}
                  />
                  <Controller
                    control={passwordControl}
                    name="newPassword"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <InputField
                        placeholder="Sua nova senha"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        secureTextEntry={!showNewPassword}
                        marginLeft="$10"
                      />
                    )}
                  />
                </Input>
                {passwordErrors.newPassword && (
                  <GluestackText size="xs" color="$danger" marginTop="$1">
                    {passwordErrors.newPassword.message}
                  </GluestackText>
                )}
              </Box>
            </VStack>

            {/* Confirm Password Input */}
            <VStack space="xs">
              <GluestackText size="sm" fontWeight="$medium" color="$gray400">
                CONFIRMAR NOVA SENHA
              </GluestackText>
              <Box position="relative">
                <Input
                  variant="outline"
                  size="lg"
                  isInvalid={!!passwordErrors.confirmPassword}
                  borderColor={passwordErrors.confirmPassword ? '$danger' : '$gray200'}
                >
                  <InputIcon 
                    as={showNewPassword ? EyeOff : Eye} 
                    color="$gray300" 
                    marginLeft="$3"
                    onPress={() => setShowNewPassword(!showNewPassword)}
                  />
                  <Controller
                    control={passwordControl}
                    name="confirmPassword"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <InputField
                        placeholder="Confirme sua nova senha"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        secureTextEntry={!showNewPassword}
                        marginLeft="$10"
                      />
                    )}
                  />
                </Input>
                {passwordErrors.confirmPassword && (
                  <GluestackText size="xs" color="$danger" marginTop="$1">
                    {passwordErrors.confirmPassword.message}
                  </GluestackText>
                )}
              </Box>
            </VStack>
          </VStack>

          {/* Update Button */}
          <Button
            size="lg"
            backgroundColor="$orangeBase"
            borderRadius="$lg"
            onPress={handleUserSubmit(onUserUpdate)}
            isDisabled={isUpdating}
            marginTop="$4"
          >
            <ButtonText color="$white" fontWeight="$semibold">
              Atualizar cadastro
            </ButtonText>
          </Button>
        </VStack>
      </VStack>
    </ScrollView>
  );
}
