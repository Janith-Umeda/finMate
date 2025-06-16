import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text, TouchableOpacity, View } from "react-native";
import { RootStackParamList } from "types";

export default function RegisterScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

    return <>
        <View className="flex-1 justify-center px-6 bg-white">
            <Text className="text-3xl font-bold text-center text-green-600 mb-8">Register Page</Text>

            <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                className="mt-4 p-2"
            >
                <Text className="text-center text-gray-500">
                    Already have an account? <Text className="text-green-600">Login</Text>
                </Text>
            </TouchableOpacity>
        </View>
    </>
}