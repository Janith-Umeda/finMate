import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { RootStackParamList } from "types";

export default function LoginScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleLogin = () => {
        Alert.alert('Error', "This is a Test Alert!")
    }

    return <>
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <View className="flex-1 justify-center px-6">
                    <Image
                        source={require('../../assets/images/finmate-logo-tp.png')}
                        style={{ width: 100, height: 100, alignSelf: 'center', marginBottom: 24 }}
                        resizeMode="contain"
                    />
                    <Text className="text-3xl font-bold text-center text-green-600 mb-8">FinMate</Text>
                    <Text>Welcome back {email}!</Text>
                    <TextInput
                        className="border border-gray-300 rounded-lg p-3 mb-4"
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                    />
                    <TextInput
                        className="border border-gray-300 rounded-lg p-3 mb-6"
                        placeholder="Password"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TextInput
                        className="border border-gray-300 rounded-lg p-3 mb-6"
                        placeholder="Password"
                        secureTextEntry
                    />
                    <TouchableOpacity
                        onPress={handleLogin}
                        className="bg-green-600 py-3 rounded-lg"
                    >
                        <Text className="text-white text-center text-lg font-semibold">Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Register')}
                        className="mt-4"
                    >
                        <Text className="text-center text-gray-500">
                            Don&apos;t have an account? <Text className="text-green-600">Register</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    </>
}