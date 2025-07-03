import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import getDB from "lib/db";
import { checkEmailValidity, checkPSWValidity } from "lib/utils";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { RootStackParamList, User } from "types";
import { Container } from "~/components/Container";
import Input from "~/components/Input";

export default function LoginScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [emailError,setEmailError] = useState<null|string>(null);
    const [passwordError,setPasswordError] = useState<null|string>(null);

    const handleLogin = async () => {
        try{
            const emailValidity = checkEmailValidity(email);
            const pwsValidity = checkPSWValidity(password);
            if(emailValidity){
                setEmailError(emailValidity);
                setPasswordError(pwsValidity);
                return;
            }
            
            if(pwsValidity){
                setPasswordError(pwsValidity);
                return;
            }
    
            setEmailError(null);
            setPasswordError(null);
    
            const db = await getDB();
            const user = await db.getFirstAsync('SELECT * FROM users WHERE email = ?', [email]) as User;
    
            if(!user){
                setEmailError("Wrong Email!");
                setPasswordError("Wrong Password!");
                return;
            }
            navigation.navigate("Dashboard", user);
        }catch(e){
            console.error('handleLogin: ', e);
        }
    }

    return <Container>
        <View className="flex-1 justify-center px-6">
            <View className="mb-5">
                <Image
                    source={require('../../assets/images/finmate-logo-tp.png')}
                    className="size-24 mb-2 self-center"
                    resizeMode="contain"
                />
                <Text className="text-3xl font-bold text-center text-green-600">FinMate</Text>
            </View>
            <Text
                className="text-3xl font-semibold mb-8 text-center"
            >
                Welcome back!
            </Text>
            <Input
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                error={emailError}
            />
            <Input
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                error={passwordError}
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
                <Text className="text-center text-gray-500 text-lg">
                    Don&apos;t have an account? <Text className="text-green-600">Register</Text>
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate('ContactList')}
                className="mt-4"
            >
                <Text className="text-center text-green-600 text-lg p-1">
                    Go to Contact List
                </Text>
            </TouchableOpacity>
        </View>
    </Container>
}