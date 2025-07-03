import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import getDB from "lib/db";
import { checkEmailValidity, checkPSWValidity, getHashedPassword } from "lib/utils";
import { useState } from "react";
import { Alert, Image, Keyboard, Text, TouchableOpacity, View } from "react-native";
import { RootStackParamList, User } from "types";
import { Container } from "~/components/Container";
import Input from "~/components/Input";

export default function RegisterScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    const [email, setEmail] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confPassword, setConfPassword] = useState<string>('');
    const [emailError, setEmailError] = useState<null | string>(null);
    const [passwordError, setPasswordError] = useState<null | string>(null);
    const [userNameError, setUserNameError] = useState<null | string>(null);
    const [confPasswordError, setConfPasswordError] = useState<null | string>(null);

    const handleRegister = async() => {
        Keyboard.dismiss();
        if(!validateCredentials()){
            return;
        }

        if((await isUserExists())){
            return;
        }

        try{
            const hashedPsw = getHashedPassword(password);
    
            const db = await getDB();
            const registerResult = await db.runAsync(
                "INSERT INTO users (userName, email, password) VALUES (?,?,?)",
                [userName, email, hashedPsw]
            );

            navigation.navigate("Login");
            
            if (!registerResult.changes) {
                Alert.alert("Error", 'Registration Failed!');
                return;
            }
            
            Alert.alert("Success", 'Registration Completed!');
        }catch(e){
            console.error('handleRegister ', e);
            Alert.alert("Error", 'Registration Failed!');
        }
    }

    const isUserExists = async()=>{
        try{
            const db = await getDB();
            const result = await db.getFirstAsync("SELECT * FROM users WHERE userName = ? OR email = ?",[userName, email]) as User;
            
            if(result?.email === email){
                setEmailError('This email is already registered!');
                return true;
            }

            if(result?.userName === userName){
                setUserNameError("This username is already registered!");
                return true;
            }
    
            return false;
        }catch(e){
            console.error("isUserExists ", e);
            return false;
        }
    }

    const validateCredentials = ()=>{
        const emailValidity = checkEmailValidity(email);
        const pwsValidity = checkPSWValidity(password);
        const userNameValidity = userName === '' ? "User name can't be empty!" : null;
        let confPswValidity = confPassword === '' ? "Confirmation password can't be empty!" : null;

        setEmailError(emailValidity);
        setPasswordError(pwsValidity);
        setUserNameError(userNameValidity);
        setConfPasswordError(confPswValidity);

        if(!pwsValidity){
            confPswValidity = password !== confPassword ? "Confirm password should be same as password!" : null;
            setPasswordError(pwsValidity);
            setConfPasswordError(confPswValidity);
            
            return !confPswValidity ? true : false;
        }

        if(!emailValidity && !pwsValidity && ! userNameValidity){
            return true;
        }

        return false;
    }

    return <Container>
        <View className="flex-1 justify-center px-6">
            <View className="mb-4">
                <Image
                    source={require('../../assets/images/finmate-logo-tp.png')}
                    className="size-24 mb-2 self-center"
                    resizeMode="contain"
                />
                <Text className="text-3xl font-bold text-center text-green-600">FinMate</Text>
            </View>
            <Text
                className="text-2xl font-bold mb-8 text-center px-20"
            >
                Simplify Your Finances, Empower Your Future
            </Text>
            <Input
                placeholder="Username"
                value={userName}
                onChangeText={setUserName}
                error={userNameError}
            />
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
            <Input
                placeholder="Confirm Password"
                secureTextEntry
                value={confPassword}
                onChangeText={setConfPassword}
                error={confPasswordError}
            />
            <TouchableOpacity
                className="bg-lime-600 py-3 rounded-lg"
                onPress={handleRegister}
            >
                <Text className="text-white text-center text-lg font-semibold">Register</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                className="mt-4 p-2"
            >
                <Text className="text-center text-gray-500">
                    Already have an account? <Text className="text-green-600">Login</Text>
                </Text>
            </TouchableOpacity>
        </View>
    </Container>
}